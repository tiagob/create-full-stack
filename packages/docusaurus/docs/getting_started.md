---
id: getting_started
title: Getting Started
sidebar_label: Getting Started
slug: /
image: /img/logo.svg
---

Create Full Stack (CFS) generates a boilerplate Todo app for you, integrating the tools you select ([view demo](http://demo-full-stack.com/)). It provides the glue between the libraries and frameworks. No more stitching together random blog posts guessing about best practices. Build scalable applications on a solid foundation. CFS works on macOS, and Linux.

## Prerequisites

- [Yarn](https://yarnpkg.com/getting-started/install#global-install) >= v1.12.0
- [Docker](https://docs.docker.com/get-docker/) >= 1.25.5
- Node ^12.10 || 14.x
  - You can use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) to switch Node versions

Check versions:

```bash
yarn --version
docker-compose --version
node --version
```

:::note
CFS support for `npm` will be added when [npm v7](https://blog.npmjs.org/post/626173315965468672/npm-v7-series-beta-release-and-semver-major) is stable, which contains the required [workspaces feature](https://github.com/npm/rfcs/blob/latest/accepted/0026-workspaces.md).
:::

## Run

```bash
yarn create full-stack my-full-stack
```

**Follow the instructions generated in `my-full-stack/development.html` to complete the setup.** Then try spinning up the full stack locally.

```bash
cd my-full-stack
yarn start
```

## Development URLs

`yarn start` brings up the development stack locally. The following URLs are available if the given services are selected.

- web: [http://localhost:3000](http://localhost:3000)
- mobile (expo devtools): [http://localhost:19002](http://localhost:19002)
- backend (hasura): [http://localhost:8080/v1/graphql](http://localhost:8080/v1/graphql)
- backend (apollo-server-express): [http://localhost:8080/graphql](http://localhost:8080/graphql)

:::caution
If [auth](/docs/auth) is enabled, expect:

- A redirect to your [Auth0 login page](https://auth0.com/docs/universal-login) from web
- An authorization error from the backend APIs

:::

## Setup [VSCode](https://code.visualstudio.com/) (recommended IDE/Editor)

When opening the project in VSCode, click on the dialog to install [recommended extensions](https://code.visualstudio.com/docs/editor/extension-gallery#_workspace-recommended-extensions) which automatically:

- Format on save
- Lint on save
- Understand Dockerfiles
- Spellcheck
