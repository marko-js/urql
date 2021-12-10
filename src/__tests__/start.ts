import fs from "fs";
import path from "path";
import { once } from "events";
import { AddressInfo } from "net";
import express from "express";
import markoExpress from "@marko/express";
import { wait } from "./queue";
import build from "./build";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello(name: String): String
    messages: [String]
  }

  type Mutation {
    addMessage(text: String): String
    doError: String
  }
`);

// The root provides a resolver function for each API endpoint
const createRoot = () => {
  const messages: Array<string> = [];
  return {
    hello: ({ name = "world" }) => {
      return `Hello ${name}!`;
    },
    messages: () => {
      return messages;
    },
    addMessage: ({ text }: { text: string }) => {
      if (text) {
        messages.push(text);
      }
      return text;
    },
    doError: () => {
      throw new Error("Oh No")
    }
  };
};

export async function start(dir: string) {
  const entries = await fs.promises.readdir(dir);
  const app = express();
  app.use(
    "/graphql",
    graphqlHTTP({
      schema: schema,
      rootValue: createRoot(),
    })
  );
  app.use(throttleMiddleware());
  app.use(markoExpress());

  await Promise.all(
    entries.map(async (entry) => {
      const name = path.basename(entry, ".marko");
      if (name !== entry) {
        const file = path.join(dir, entry);
        const runtimeId = `${path.basename(dir)}_${name}`.replace(
          /[^a-z0-9_$]+/g,
          "_"
        );
        const assets = await build(runtimeId, file);
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const template = require(file).default;

        for (const ext in assets) {
          for (const asset of assets[ext]) {
            app.get(`/${asset.path}`, (_req, res) => {
              res.type(ext);
              res.end(asset.code);
            });
          }
        }

        app.get(`/${name === "index" ? "" : name}`, (_req, res) => {
          res.locals.runtimeId = runtimeId;
          res.locals.assets = assets;

          if (process.env.NODE_ENV === "test") {
            // for some reason express suppresses errors in test env.
            res.on("error", console.error);
          }
          res.marko(template, {
            graphqlURL: `http://localhost:${
              (server.address() as AddressInfo).port
            }/graphql`,
          });
        });
      }
    })
  );

  const server = app.listen();
  await once(server, "listening");
  // process.env.PORT = server.address().port

  return {
    url: `http://localhost:${(server.address() as AddressInfo).port}`,
    close: () => new Promise<void>((r) => server.close(() => r())),
  };
}

// Ensure each write is flushed completely and throttled
// to avoid race conditions.
function throttleMiddleware() {
  return ((_req, res, next) => {
    const write = res.write.bind(res);
    const end = res.end.bind(res);
    let buf = "";

    (res as any).flush = () => {
      call(write);
    };

    res.write = (chunk) => {
      buf += chunk.toString();
      return true;
    };

    res.end = ((chunk) => {
      if (chunk && typeof chunk !== "function") {
        res.write(chunk);
      }

      call(end);
    }) as express.Response["end"];

    next();

    function call(write: (chunk: string, cb: () => void) => void) {
      const data = buf;
      buf = "";
      wait(() => new Promise((resolve) => write(data, resolve)));
    }
  }) as express.RequestHandler;
}
