import path from "path";
import { Module } from "module";

// For our browser remapped modules we skip resolution during testing and resolve the original source files.
const modules: Record<string, string> = {
  "@internal/client": path.resolve("src/node_modules/@internal/client/node.ts"),
  "@internal/client/devtools": path.resolve(
    "src/node_modules/@internal/client/devtools.ts",
  ),
  "@internal/gql-query": path.resolve(
    "src/node_modules/@internal/gql-query/node.marko",
  ),
};

const originalResolveFilename = (Module as any)._resolveFilename;
(Module as any)._resolveFilename = function (id: string) {
  // eslint-disable-next-line prefer-rest-params
  return modules[id] || originalResolveFilename.apply(this, arguments);
};
