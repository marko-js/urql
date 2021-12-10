import path from "path";
import fixture from "../../../__tests__/fixture";

describe("client-only", fixture(path.join(__dirname, "fixtures/client-only")));
describe(
  "client-only-placeholder",
  fixture(path.join(__dirname, "fixtures/client-only-placeholder"))
);
describe(
  "client-only-variables",
  fixture(path.join(__dirname, "fixtures/client-only-variables"))
);

describe("isomorphic", fixture(path.join(__dirname, "fixtures/isomorphic")));
describe(
  "isomorphic-placeholder",
  fixture(path.join(__dirname, "fixtures/isomorphic-placeholder"))
);
describe(
  "isomorphic-variables",
  fixture(path.join(__dirname, "fixtures/isomorphic-variables"))
);

describe("server-only", fixture(path.join(__dirname, "fixtures/server-only")));
describe(
  "server-only-placeholder",
  fixture(path.join(__dirname, "fixtures/server-only-placeholder"))
);
describe(
  "server-only-variables",
  fixture(path.join(__dirname, "fixtures/server-only-variables"))
);

describe(
  "update-variables",
  fixture(path.join(__dirname, "fixtures/update-variables"), [
    async (page) => await page.click("text=Toggle"),
    async (page) => await page.click("text=Toggle"),
    async (page) => await page.click("text=Toggle"),
  ])
);

describe(
  "request-policy",
  fixture(path.join(__dirname, "fixtures/request-policy"), [
    async (page) => await page.click("text=Toggle"),
    async (page) => await page.click("text=Toggle"),
    async (page) => await page.click("text=Toggle"),
  ])
);
