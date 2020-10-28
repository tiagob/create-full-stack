---
id: available_scripts
title: Available Scripts
image: /img/logo.svg
---

## Root level

### `yarn start`

Starts all platforms for local development. Platforms automatically reload if edits are made. Lint errors are displayed in the console.

:::caution
This continues to run if one of the processes fails. You may need to scroll up to find the error. [concurrently/issues/135](https://github.com/kimmobrunfeldt/concurrently/issues/135).
:::

### `yarn test`

Runs all the tests across the platforms once. Unlike platform specific `yarn test`, this does not use watch mode which makes it useful for CI.

### `yarn lint`

Use [ESLint](https://eslint.org/) to lint all `.ts` and `.tsx` files with autofix enabled. Files are automatically linted and formatted on save with VSCode.

This uses a [custom ESLint configuration](https://github.com/tiagob/create-full-stack/tree/master/packages/eslint-config-create-full-stack) which includes [Airbnb style guide](https://github.com/airbnb/javascript) rules.

### `yarn prettier`

Use [Prettier](https://prettier.io/) to format all files. Files are automatically linted and formatted on save with VSCode.

### `yarn generate`

Generates TypeScript types and React hooks for the Apollo GraphQL client. To run in watch mode which actively updates on any change, add the `--watch` flag. If Hasura backend is selected, the Hasura docker container must be up locally.

### `docker-compose up`

Starts Hasura (if selected) and Postgres in Docker containers running locally.

## Apollo Server Express

If included, run from `packages/server/`.

### `yarn start`

Starts the server running locally.

### `yarn test`

Launches the test runner in the interactive watch mode.

## Hasura

If included, run from `hasura/`.

Common commands are shown below. Additional commands are documented on the [Hasura docs](https://hasura.io/docs/1.0/graphql/core/hasura-cli/index.html#commands).

:::info
Create Full Stack installs the Hasura CLI locally to the workspace so you must run `yarn hasura` to access it.
:::

### `yarn hasura console`

Run a web server to host the Hasura console for the GraphQL engine to manage the database and build queries. The Hasura backend must be up locally for the console to load.

Changes to the schema automatically update or create the migrations files.

## Mobile

If included, run from `packages/mobile/`.

Common commands are shown below. Additional commands are documented on the [Expo docs](https://docs.expo.io/workflow/expo-cli/#commands).

:::info
Create Full Stack installs the Expo CLI locally to the workspace so you must run `yarn expo` to access it.
:::

### `yarn start`

Starts or restarts a local server for your app and gives you a url to it. Unlike the default `expo start` this clears the Metro bundler cache. The cache is cleared between runs in case a `.env` file is updated otherwise stale values may persist.

:::caution
Expo web is unsupported. If you need this, +1 [create-full-stack/issues/148](https://github.com/tiagob/create-full-stack/issues/148).
:::

### `yarn test`

Launches the test runner in the interactive watch mode.

## Postgres (on Docker)

To make changes to the database see [migrations documentation](/docs/migrations).

### `docker exec -it <project name>_postgres_1 psql -U postgres`

Connects to your Postgres instance running in docker.

## Pulumi AWS

If included, run from `packages/pulumi-aws`.

Common commands are shown below. Additional commands are documented on the [Pulumi docs](https://www.pulumi.com/docs/reference/cli/#common-commands).

### `pulumi up`

Creates or updates the resources in a stack.

### `pulumi destroy`

Destroys an existing stack and its resources.

### `pulumi stack select <stack>`

Switches the current workspace to the given stack.

### `pulumi stack ls`

List stacks.

## Web

If included, run from `packages/web/`.

Common commands are shown below. Additional commands are documented on the [Create React App docs](https://create-react-app.dev/docs/available-scripts).

### `yarn start`

Starts or restarts a local server for your app and gives you a url to it.

### `yarn test`

Launches the test runner in the interactive watch mode.
