import {
  createClient as internalCreate,
  dedupExchange,
  cacheExchange,
  fetchExchange,
  ssrExchange,
} from "@urql/core";
import lookup from "./lookup";

export function createClient({
  isServer,
  fetch,
}: {
  isServer: boolean;
  fetch?: (resource: RequestInfo, options?: RequestInit) => Promise<Response>;
}) {
  // The `ssrExchange` must be initialized with `isClient` and `initialState`
  const ssr = ssrExchange({
    isClient: !isServer,
  });

  const client = internalCreate({
    exchanges: [
      dedupExchange,
      cacheExchange,
      ssr, // Add `ssr` in front of the `fetchExchange`
      fetchExchange,
    ],
    ...lookup.config,
    fetch,
  });

  return { client, ssr };
}
