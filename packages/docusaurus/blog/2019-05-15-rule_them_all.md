---
slug: rule_them_all
title: One full-stack to rule them all!
author: Tiago Bandeira
author_url: https://github.com/tiagob
author_image_url: https://avatars3.githubusercontent.com/u/1031522?v=4
---

Yes, yet another todo example app! 🤦 Needed to throw my hat in the ring because the existing solutions weren’t cutting it.

We want a stack that enables rapid iteration as requirements change without producing bugs. Ideally, it should scale in terms of traffic and developers without requiring costly re-writes.

To achieve this we chose components that are:

1. A single language, eliminating developer context switching
1. Type-safe, eliminating a whole class of bugs
1. Tested at scale in production
1. Used by enough developers that solutions are easy to find

## Why?

Coming from Google, I realized the importance of static types across the entire stack (including the API). There are thousands of engineers working on Search and Ads at Google (I was one of them). No one person completely understands the systems because they’ve been built over 10 years by thousands of engineers. Bringing data from the database through the Ad Server and onto Search crossed ~8 different services. Making these changes was scary, to say the least.

Static typing across the stack and a single mono repo are what make this possible. Static typing ensures the data is there and of the expected type when you access it. Mono repo ensures all services are in the same state and the API contracts (Protobufs at Google) are enforced by the compiler. At Google code that doesn’t compile can’t be checked in.

## Why TypeScript (TS)?

What other typed languages can run on the client and server and aren’t experimental?
Having a single language reduces context switching for engineers. It gives us the confidence to own full-stack changes. TypeScript is rapidly growing in popularity. It’s a superset of JavaScript which is the most popular language of all time so most programmers are at least somewhat familiar with the syntax.

TS eliminates [15% of production bugs](/pdf/typestudy.pdf). It scales to hundreds, if not thousands, of developers. Microsoft, Google, and countless other companies rely on it in production systems with billions of users. Google is increasingly adopting it over Closure (Google’s prehistoric typed JS language). It has great documentation and IDE support with a thriving community ([3rd most loved language on StackOverflow](https://insights.stackoverflow.com/survey/2019#technology-_-most-loved-dreaded-and-wanted-languages)). It presents clear errors when the compiler fails.

The TypeScript team has been [rapidly improving TS across many dimensions](https://www.youtube.com/watch?v=Au-rrY0afe4). In the last year they added:

- Support for existing tools to meet developers where they are
  - TS + Babel for easy integration in the React ecosystem
  - TS + ESLint for better linting support (TSLint is too slow)
- Improved error messages. Instead of highlighting an entire interface when there’s a type issue it jumps to the property that’s causing the issue.

![TypeScript v2.8 vs v3.0](/img/typescript_comparison.png)

- More advanced type checking (no overloads necessary in generics). Ex. [Promise.all](https://youtu.be/Au-rrY0afe4?t=1690)

## Why React?

It’s 2019! MVC should be dead! Long live JS in templates and one-direction data flow!

JS in templates gives us access to a Turing complete language when we’re constructing what’s displayed. This pushes complexity to the leaves instead of APIs or random custom functions which reduces overall complexity (see [Pete Hunt’s talk](https://www.youtube.com/watch?v=x7cQ3mrcKaY)). In Django (I have a python background pre-React), you’d use [tags, filters](https://docs.djangoproject.com/en/2.2/ref/templates/builtins/#) or write your own [custom versions](https://docs.djangoproject.com/en/2.2/howto/custom-template-tags/#writing-custom-template-filters) when you run into things like formatting date time ranges. Learning an extra template language and writing complicated escape hatches is a waste!

One way data flow ensures there’s a single source of truth and you don’t run into bugs where the same value could be in different states. Google just announced Compose, a React-like framework, in Android. They dive into the issues with two-way data bindings in [their talk at IO](https://www.youtube.com/watch?v=VsStyq4Lzxo).

Since React’s public launch in 2013, it’s only gotten better and grown in popularity. Many of the worlds most used sites are completely or nearly completely written in React ([Twitter](https://medium.com/@paularmstrong/twitter-lite-and-high-performance-react-progressive-web-apps-at-scale-d28a00e780a3), [Netflix](https://medium.com/netflix-techblog/netflix-likes-react-509675426db), Uber, [Facebook](https://developers.facebook.com/videos/2019/building-the-new-facebookcom-with-react-graphql-and-relay/), and Airbnb). Companies that value developer productivity are wise to adopt because it significantly reduces UI code complexity over more traditional frameworks.

## Why GraphQL with Apollo?

[GraphQL](https://graphql.org/) provides a simple way for clients to request only the data they need and easily move across relationships. Requests can change without server modifications and deploys. Try that with REST or Protobufs!

If we extended our Todo example to have different users we could query for their specific todos. Any additional fields on either user or todo are emitted from the response but could be fetched in different queries without changes to the API

```graphql
query {
  user(id: "xxx") {
    name
    todos {
      name
      complete
    }
  }
}
```

Apollo has client and server support that requires less upfront learning and setup cost than Relay. It has automated TypeScript type generation through [graphql-code-generator](https://graphql-code-generator.com/). Solid documentation and tooling with a thriving community. Ability to [batch queries](https://blog.apollographql.com/batching-client-graphql-queries-a685f5bcd41b) but can defer until needed, avoiding fragment complexity.

The two major distinctions from a devX perspective I see between Relay and Apollo for queries are containers and cursors. Both are required in Relay (opinionated) and optional in Apollo (flexible).

Container queries batch all query fragments (data required by each component in the subtree) into a single container level query. In the simple Todo list case, this is actually a bit tricky. It involves importing the lower level fragments and [composing them up the tree](https://facebook.github.io/relay/docs/en/quick-start-guide#composing-fragments). In Apollo, we’d simply request the data at the component level. The tradeoff is in the number of requests, containers are more efficient at the cost of complexity and difficulty debugging issues.

Cursors are a standard way for [pagination in Relay](https://facebook.github.io/relay/docs/en/pagination-container). They require the type you’re fetching to wrap additional details.

Todo GraphQL schema for Relay cursor pagination:

```graphql
# An object with an ID
interface Node {
  # The id of the object.
  id: ID!
}

# Information about pagination in a connection.
type PageInfo {
  # When paginating forwards, are there more items?
  hasNextPage: Boolean!
  # When paginating backwards, are there more items?
  hasPreviousPage: Boolean!
  # When paginating backwards, the cursor to continue.
  startCursor: String
  # When paginating forwards, the cursor to continue.
  endCursor: String
}

type Todo implements Node {
  # The ID of an object
  id: ID!
  text: String
  complete: Boolean
}

# A connection to a list of items.
type TodoConnection {
  # Information to aid in pagination.
  pageInfo: PageInfo!
  # A list of edges.
  edges: [TodoEdge]
}

# An edge in a connection.
type TodoEdge {
  # The item at the end of the edge
  node: Todo
  # A cursor for use in pagination
  cursor: String!
}
```

If we’re using [Apollo offset based pagination](https://www.apollographql.com/docs/react/features/pagination) (assuming you have a SQL database this is straightforward), then we just need the Todo type and we pass the limit and offset in the query. The downside is that if new items are inserted or deleted in the original set it can return duplicates or skip results. Cursor based pagination fixes this.

This a simple comparison between Relay and Apollo. For Facebook, Relay’s additional complexities make sense for performance and data guarantees. For us, the added complexity didn’t make sense but it’s something we could revisit.

_[Relay TypeScript Todo example](https://github.com/relay-tools/relay-compiler-language-typescript/tree/master/example) for comparison (linked from the official docs)_

## Why Node?

Our requirement for a single language across client and server limits our server language choices.

Node has some [“regrets”](https://www.youtube.com/watch?v=M3BM9TB-8yA) like security, the build system, and package.json but, the ecosystem is unparalleled.

Node is by far the most popular language on GAE and AWS Lambda. It’s great for rapid development. However, many companies also use Node at scale in production (Instagram, [Netflix](https://medium.com/dev-channel/a-netflix-web-performance-case-study-c0bcde26a9d9), [Airbnb](https://medium.com/airbnb-engineering/operationalizing-node-js-for-server-side-rendering-c5ba718acfc9), and [Walmart](https://medium.com/walmartlabs/the-benefits-of-server-side-rendering-over-client-side-rendering-5d07ff2cefe8)).

Is there something else that can run TypeScript on the server safely in production? Unfortunately, [Deno](https://deno.land/) (from the creator of Node) isn’t there yet.

## Conclusions

While there is never truly one stack to rule them all, we believe that our set of requirements likely matches many people building web apps today. While all of these pieces have been battle tested individually the sum of their parts creates a relatively novel way of developing web apps that isn’t currently well documented.
