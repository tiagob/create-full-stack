---
id: getting_started
title: Getting Started
sidebar_label: Getting Started
slug: /
---

Create Full Stack (CFS) generates a boilerplate Todo app for you, integrating the tools you select ([view demo](http://demo-full-stack.com/)). It provides the glue between the libraries and frameworks. No more stitching together random blog posts guessing about best practices. Build scalable applications on a solid foundation. CFS works on macOS, and Linux.

Pre-requisites are [Yarn](https://yarnpkg.com/getting-started/install#global-install) and [Docker](https://docs.docker.com/get-docker/).

```bash
yarn create full-stack my-full-stack
```

Follow the instructions generated in `my-full-stack/README.md` to complete the setup. Then try spinning up the full stack locally.

```bash
cd my-full-stack
yarn start
```

**Node v12.10.0 or later is required**. You can use [n](https://github.com/tj/n) to switch Node versions.

:::note
CFS support for `npm` will be added when [npm v7](https://blog.npmjs.org/post/626173315965468672/npm-v7-series-beta-release-and-semver-major) is stable, which contains the required [workspaces feature](https://github.com/npm/rfcs/blob/latest/accepted/0026-workspaces.md).
:::

## Development URLs

`yarn start` brings up the development stack locally. The following URLs are available if the given services are selected.

- backend (apollo-server-express): [http://localhost:8080/graphql](http://localhost:8080/graphql)
- backend (hasura): [http://localhost:8080/v1/graphql](http://localhost:8080/v1/graphql)
- mobile (expo devtools): [http://localhost:19003](http://localhost:19003)
- web: [http://localhost:3000](http://localhost:3000)
