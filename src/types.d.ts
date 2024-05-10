declare module "@internal/client" {
  import "marko";
  import type { Client, ClientOptions } from "@urql/core";
  export const readyLookup: Record<string, any>;
  export function getClient(out?: Marko.Out, name?: string): Client;
  export function configureClient(
    config: ClientOptions & { fetch?: any; name?: string },
    out: Marko.Out,
  ): void;
  export function hydrateQuery(
    opKey: string,
    data: any,
    error: any,
    name?: string,
  ): void;
}

declare module "@internal/gql-query" {
  import "marko";
  const template: Marko.Template;
  export default template;
}
