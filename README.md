<h1 align="center">
  <!-- Logo -->
  <br/>
  @marko/urql
	<br/>

  <!-- Format -->
  <a href="https://github.com/prettier/prettier">
    <img src="https://img.shields.io/badge/styled_with-prettier-ff69b4.svg" alt="Styled with prettier"/>
  </a>
  <!-- Coverage -->
  <a href="https://codecov.io/gh/marko-js/urql">
    <img src="https://codecov.io/gh/marko-js/urql/branch/main/graph/badge.svg?token=cSvMDikbE4"/>
  </a>
  <!-- NPM Version -->
  <a href="https://npmjs.org/package/@marko/urql">
    <img src="https://img.shields.io/npm/v/@marko/urql.svg" alt="NPM Version"/>
  </a>
  <!-- Downloads -->
  <a href="https://npmjs.org/package/@marko/urql">
    <img src="https://img.shields.io/npm/dm/@marko/urql.svg" alt="Downloads"/>
  </a>
</h1>

<p align="center">
  A wrapper over the <a href="https://github.com/FormidableLabs/urql">URQL</a> GraphQL client for Marko.
</p>

# Installation

```console
npm install @marko/urql
```

# How it works

This package exposes 3 tags `<gql-client>`, `<gql-query>` and `<gql-mutation>` designed to work on both the client and server.

## On the server

When the page is being rendered a request will be made to the GraphQL service and Marko will continue rendering and streaming the page to the browser. On completion of that request Marko will stream the completed HTML to the browser. If the GraphQL query is not under a stateful component Marko will only serialize the data as needed by descendant stateful components and the GraphQL client will not be part of your bundle.

## In the browser

If your GraphQL query is part of a stateful component when the browser receives the final HTML it will also receive the serialized data which will initialize a query cache which will be used for future requests.

## Caching

This package uses query cache where queries are cached by combination of query and variables. Requesting the same query will return the cached results instead of requesting to the server again by default. This behavior can be modified setting the `requestPolicy.

Available Cache Policies are:
* `cache-first` (the default) prefers cached results and falls back to sending an API request when no prior result is cached.
* `cache-and-network` returns cached results but also always sends an API request, which is perfect for displaying data quickly while keeping it up-to-date.
* `network-only` will always send an API request and will ignore cached results.
* `cache-only` will always return cached results or null.

# Example

```marko
import { gql } from "@marko/urql";

static const QUERY = gql`
  query($name: String) {
    hello(name: $name)
  }
`;
class {
  onCreate() {
    this.state = { name: "John" }
  }
  handleClick() {
    this.state.name = "Jack"
  }
}

<gql-client url="https://api.acme.com/graphql" />

<gql-query query=QUERY variables={ name: state.name }>
  <@then|{ data, fetching }|>
    <if(fetching)>
      <span>Stale</span>
    </if>
    <button on-click("handleClick")>Toggle</button>
    <span>${data.hello}</span>
  </@then>
  <@placeholder>
    <spinner />
  <@placeholder>
</gql-query>
```

# API

## `<gql-client>`

This central Client manages all of our GraphQL requests and results.

### Attributes

#### `url`

The url of the GraphQL server.

#### `fetch`

This attribute allows you to pass a custom `fetch` implementation.

In the following example we'll add a token to each fetch request that our Client sends to our GraphQL API.
```marko
<gql-client
  url="http://localhost:3000/graphql"
  fetch=((resource, init) => {
    const token = getToken();
    return fetch(resource, {
      ...init
      headers: { authorization: token ? `Bearer ${token}` : '' },
    });
  })
/>
```

#### `requestPolicy`

Set the default cache policy. The default is "cache-first".

## `<gql-query>`

This tag is used to query a GraphQL server for data.

### Attributes

#### `query`

The graphql query to perform.

#### `variables`

Any variables to pass to the query.

#### `requestPolicy`

The cache policy to use with this query request.

#### `@then|results, revalidate|`

The content to display on query completion. The results object consists of:

* `data` is the data returned from the graphql request
* `error` is any errors that come back from request
* `fetching` is a boolean to indicate if the request is currently in flight

`revalidate` is a function to refresh the current query. By default it uses `network-only` cache policy, but it is overridable by passing `requestPolicy` key on options object passed to it.

#### `@placeholder`

The loading state placeholder to use on initial render.

## `<gql-mutation|mutate, results|>`

This tag performs graphql mutations. The content is rendered immediately on mount and provides the `mutate` method that can be used to trigger the mutation. `mutate` takes the variables as first argument and options as second argument.

The results object consists of:

* `data` is the data returned from the graphql mutation
* `error` is any errors that come back from request
* `fetching` is a boolean to indicate if the request is currently in flight

Example:

```marko
import { gql } from "../../../../../../index";

static const MUTATION = gql`
  mutation addMessage(
    $text: String!
  ) {
    addMessage(text: $text)
  }
`;

class {
  handleClick(mutate, e) {
    mutate({ text: "Hello" });
  }
}

<gql-mutation|mutate, results| mutation=MUTATION>
  <h1>Messages</h1>
  <span>${results.data && results.data.addMessage}</span>
  <span>${results.fetching ? "executing" : ""}</span>
  <button on-click("handleClick", mutate)>Add</button>
</gql-mutation>
```

### Attributes

#### `mutation`

The graphql query to perform.

#### `requestPolicy`

The cache policy to use with this query request.

# Code of Conduct

This project adheres to the [eBay Code of Conduct](./.github/CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.
