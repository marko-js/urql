import {
  createClient as internalCreate,
  dedupExchange,
  cacheExchange,
  fetchExchange,
  ssrExchange,
} from "@urql/core";
import lookup from "./lookup";

type Fetch = typeof fetch;

export function createClient({
  isServer,
  fetch,
}: {
  isServer: boolean;
  fetch?: Fetch;
}) {
  // The `ssrExchange` must be initialized with `isClient` and `initialState`
  const ssr = ssrExchange({ isClient: !isServer });
  let exchanges = [
    dedupExchange,
    cacheExchange,
    ssr, // Add `ssr` in front of the `fetchExchange`
    fetchExchange,
  ];

  if (typeof window === "object" && process.env.NODE_ENV !== "production") {
    exchanges = [
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require("@urql/devtools").devtoolsExchange,
      ...exchanges,
    ];
  }

  const client = internalCreate({
    exchanges,
    fetch,
    ...lookup.config,
  });

  return { client, ssr };
}
