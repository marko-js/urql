import path from "path";
import fixture from "../../../__tests__/fixture";

describe("client-only", fixture(path.join(__dirname, "fixtures/client-only")));
describe(
  "client-only-multi-client",
  fixture(path.join(__dirname, "fixtures/client-only-multi-client")),
);
describe(
  "client-only-placeholder",
  fixture(path.join(__dirname, "fixtures/client-only-placeholder")),
);
describe(
  "client-only-variables",
  fixture(path.join(__dirname, "fixtures/client-only-variables")),
);

describe(
  "client-only-timeout",
  fixture(path.join(__dirname, "fixtures/client-only-timeout")),
);

describe("isomorphic", fixture(path.join(__dirname, "fixtures/isomorphic")));
describe(
  "isomorphic-fetch-imp",
  fixture(path.join(__dirname, "fixtures/isomorphic-fetch-imp")),
);
describe(
  "isomorphic-multi-client",
  fixture(path.join(__dirname, "fixtures/isomorphic-multi-client")),
);
describe(
  "isomorphic-placeholder",
  fixture(path.join(__dirname, "fixtures/isomorphic-placeholder")),
);
describe(
  "isomorphic-variables",
  fixture(path.join(__dirname, "fixtures/isomorphic-variables")),
);
describe(
  "isomorphic-timeout",
  fixture(path.join(__dirname, "fixtures/isomorphic-timeout")),
);

describe("server-only", fixture(path.join(__dirname, "fixtures/server-only")));
describe(
  "server-only-multi-client",
  fixture(path.join(__dirname, "fixtures/server-only-multi-client")),
);
describe(
  "server-only-placeholder",
  fixture(path.join(__dirname, "fixtures/server-only-placeholder")),
);
describe(
  "server-only-variables",
  fixture(path.join(__dirname, "fixtures/server-only-variables")),
);
describe(
  "server-only-timeout",
  fixture(path.join(__dirname, "fixtures/server-only-timeout")),
);

describe(
  "update-variables",
  fixture(path.join(__dirname, "fixtures/update-variables"), [
    async (page) => await page.click("text=Toggle"),
    async (page) => await page.click("text=Toggle"),
    async (page) => await page.click("text=Toggle"),
  ]),
);

describe(
  "update-variables-multi-client",
  fixture(path.join(__dirname, "fixtures/update-variables-multi-client"), [
    async (page) => await page.click("text=Toggle"),
    async (page) => await page.click("text=Toggle"),
    async (page) => await page.click("text=Toggle"),
  ]),
);

describe(
  "request-policy",
  fixture(path.join(__dirname, "fixtures/request-policy"), [
    async (page) => await page.click("text=Toggle"),
    async (page) => await page.click("text=Toggle"),
    async (page) => await page.click("text=Toggle"),
  ]),
);
