import {
  createClient,
  dedupExchange,
  cacheExchange,
  fetchExchange,
  ssrExchange,
  type ClientOptions,
  type Client,
} from "@urql/core";

let client: Client;
let ssr: ReturnType<typeof ssrExchange>;

export function getClient() {
  assertConfigured();
  return client;
}

export function configureClient(config: ClientOptions) {
  ssr = ssrExchange({ isClient: true });
  const exchanges = [dedupExchange, cacheExchange, ssr, fetchExchange];
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    exchanges.push(require("@urql/devtools").devtoolsExchange);
  }

  client = createClient({
    exchanges,
    fetch,
    ...config,
  });
}

export function hydrateQuery(opKey: string, data: any, error: any) {
  assertConfigured();
  ssr.restoreData({
    [opKey]: {
      data: data ? JSON.stringify(data) : undefined,
      error,
    },
  });
}

function assertConfigured() {
  if (!client) throw new Error("<gql-client> not configured.");
}
