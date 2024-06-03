import fs from "fs";
import path from "path";
import { once } from "events";
import { AddressInfo } from "net";
import express from "express";
import markoExpress from "@marko/express";
import { wait } from "./queue";
import build from "./build";
import { buildSchema } from "graphql";
import { createHandler } from "graphql-http/lib/use/http";

import "./alias-virtual-modules";

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    hello(name: String): String
    todo(id: String): Todo
    messages: [String]
  }

  type Todo {
    id: String
    name: String
  }

  type Mutation {
    addMessage(text: String): String
    doError: String
  }
`);

// The root provides a resolver function for each API endpoint
const createRoot = (contentPostfix = "", delay = 0) => {
  const messages: Array<string> = [];
  return {
    hello: async ({ name = "world" }) => {
      await new Promise((r) => setTimeout(r, delay));
      return `Hello ${name}!${contentPostfix}`;
    },
    todo: async ({ id }: { id: string }) => {
      await new Promise((r) => setTimeout(r, delay));
      return {
        id,
        name: "Todo " + id + contentPostfix,
      };
    },
    messages: async () => {
      await new Promise((r) => setTimeout(r, delay));
      return messages;
    },
    addMessage: async ({ text }: { text: string }) => {
      await new Promise((r) => setTimeout(r, delay));
      if (text) {
        messages.push(text + contentPostfix);
      }
      return text + contentPostfix;
    },
    doError: async () => {
      await new Promise((r) => setTimeout(r, delay));
      throw new Error("Oh No" + contentPostfix);
    },
  };
};

export async function start(dir: string) {
  const entries = await fs.promises.readdir(dir);
  const app = express();
  app.use(
    "/graphql",
    createHandler({
      schema: schema,
      rootValue: createRoot(),
    }),
  );
  app.use(
    "/graphqlAlt",
    createHandler({
      schema: schema,
      rootValue: createRoot("(Alt)", 100),
    }),
  );
  app.use(throttleMiddleware());
  app.use(markoExpress());

  await Promise.all(
    entries.map(async (entry) => {
      const name = path.basename(entry, ".marko");
      if (name !== entry) {
        const file = path.join(dir, entry);
        const assets = await build(file);
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
          res.locals.assets = assets;

          if (process.env.NODE_ENV === "test") {
            // for some reason express suppresses errors in test env.
            res.on("error", console.error);
          }
          res.marko(template, {
            graphqlURL: `http://localhost:${
              (server.address() as AddressInfo).port
            }/graphql`,
            graphqlURLAlt: `http://localhost:${
              (server.address() as AddressInfo).port
            }/graphqlAlt`,
          });
        });
      }
    }),
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
