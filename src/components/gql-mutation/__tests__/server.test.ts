import path from "path";
import fixture from "../../../__tests__/fixture";

describe("basic", fixture(path.join(__dirname, "fixtures/basic")));
describe(
  "run-mutation",
  fixture(path.join(__dirname, "fixtures/run-mutation"), [
    async (page) => await page.click("text=Add"),
  ]),
);

describe(
  "mutation-with-query",
  fixture(path.join(__dirname, "fixtures/mutation-with-query"), [
    async (page) => await page.click("text=Add"),
    async (page) => await page.click("text=Add"),
  ]),
);

// TODO: Investigate why test harness doesn't behave as expected.
// describe("mutation-error", fixture(path.join(__dirname, "fixtures/mutation-error"), [
//   async (page) => await page.click("text=Add")
// ]));
