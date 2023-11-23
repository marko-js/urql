import fetchImpl from "make-fetch-happen";
import {
  createClient,
  dedupExchange,
  cacheExchange,
  fetchExchange,
  ssrExchange,
  type ClientOptions,
  type Client,
} from "@urql/core";

const kClient = Symbol("client");
const strictSSL = process.env.NODE_TLS_REJECT_UNAUTHORIZED !== "0";

export function getClient(out: any): Client {
  const client = out.global[kClient];
  if (!client) throw new Error("<gql-client> not configured.");
  return out.global[kClient];
}

export function configureClient(config: ClientOptions, out: any) {
  out.global[kClient] = createClient({
    exchanges: [
      dedupExchange,
      cacheExchange,
      ssrExchange({ isClient: false }),
      fetchExchange,
    ],
    fetch: ((url: string, options: fetchImpl.FetchOptions) => {
      const incomingMessage =
        (out.stream && (out.stream.req || out.stream.request)) ||
        out.global.req ||
        out.global.request;
      if (!incomingMessage) return fetchImpl(url, options);
      const protocol =
        incomingMessage.headers["x-forwarded-proto"] ||
        incomingMessage.protocol;
      const host =
        incomingMessage.headers["x-forwarded-host"] ||
        incomingMessage.headers.host;
      return fetchImpl(new URL(url, `${protocol}://${host}`).toString(), {
        ...options,
        strictSSL,
        headers: {
          ...incomingMessage.headers,
          ...options.headers,
        },
      });
    }) as any,
    ...config,
  });
}

export function whenConfigured() {
  throw new Error("Cannot be called on the server.");
}

export function hydrateQuery() {
  throw new Error("Cannot be called on the server.");
}
