# Create Full Stack

Set up a TypeScript full stack (web, mobile, backend, aws) with one command.

- [Getting Started](https://create-full-stack.com/docs) – How to create a new full stack.
- [User Guide](https://create-full-stack.com) – How to develop apps bootstrapped with Create Full Stack.

Create Full Stack works on macOS, and Linux.<br>
If something doesn’t work, please check [troubleshooting](https://create-full-stack.com/docs/troubleshooting) or file an [issue](https://github.com/tiagob/create-full-stack/issues).

**Looking for co-contributors. If this project interests you, email me@tiagobandeira.com**

## Choose your stack

### Backend

- Apollo Server Express
- Hasura

### Auth

- Auth0
- None

### Cloud

- AWS/Pulumi
- None

### Web

- React
- None

### Mobile

- React Native
- None

### CI/CD

- GitHub Actions
- None

## Prerequisites

- [Yarn](https://yarnpkg.com/getting-started/install#global-install) >= v1.12.0
- [Docker](https://docs.docker.com/get-docker/) >= 1.25.5
- Node ^12.10 || 14.x
  - You can use [n](https://github.com/tj/n) to switch Node versions

Check versions:

```bash
yarn --version
docker-compose --version
node --version
```

CFS support for `npm` will be added when [npm v7](https://blog.npmjs.org/post/626173315965468672/npm-v7-series-beta-release-and-semver-major) is stable, which contains the required [workspaces feature](https://github.com/npm/rfcs/blob/latest/accepted/0026-workspaces.md).

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
  - If [auth](https://create-full-stack.com/docs/auth) is enabled, this redirects to your [Auth0 login page](https://auth0.com/docs/universal-login)
- mobile (expo devtools): [http://localhost:19002](http://localhost:19002)
- backend (hasura): [http://localhost:8080/v1/graphql](http://localhost:8080/v1/graphql)
  - If [auth](https://create-full-stack.com/docs/auth) is enabled, expect an authorization error
- backend (apollo-server-express): [http://localhost:8080/graphql](http://localhost:8080/graphql)
  - If [auth](https://create-full-stack.com/docs/auth) is enabled, expect an authorization error

## Setup [VSCode](https://code.visualstudio.com/) (recommended IDE/Editor)

When opening the project in VSCode, click on the dialog to install [recommended extensions](https://code.visualstudio.com/docs/editor/extension-gallery#_workspace-recommended-extensions) which automatically:

- Format on save
- Lint on save
- Understand Dockerfiles
- Spellcheck

## Why

As a Software Engineer at Google, I was impressed with the seamless integration of the various libraries and frameworks. When starting a new project, Google developers never start from scratch. They build on a stable foundation with guard rails in place.

Since leaving Google, I've been dismayed that this same type of foundation doesn't exist. It's natural to cobble together solutions following one-off blog posts. A developer's focus isn't - and shouldn't be - infra at an early stage, so hacky solutions tend to win. Unfortunately, as what you're building scales, maintaining these solutions can be a nightmare.

## Goals

We want a stack that enables rapid iteration as requirements change without producing bugs. Ideally, it should scale in terms of traffic and developers without requiring costly re-writes.

To achieve this we chose components for the boilerplate that are:

1. A single language, eliminating developer context switching
1. Type-safe, eliminating a whole class of bugs
1. Tested at scale in production
1. Used by enough developers that solutions are easy to find
