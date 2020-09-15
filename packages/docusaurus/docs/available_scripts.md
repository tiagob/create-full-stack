---
id: available_scripts
title: Available Scripts
---

## Root level

### `yarn start`

Starts all platforms for local development. Platforms automatically reload if edits are made. Lint errors are displayed in the console.

:::caution
This continues to run if one of the processes fails. You may need to scroll up to find the error. [concurrently/issues/135](https://github.com/kimmobrunfeldt/concurrently/issues/135).
:::

### `yarn test`

Runs all the tests across the platforms once. Unlike platform specific `yarn test`, this does not use watch mode which makes it useful for CI.

### `yarn generate`

Generates TypeScript types and React hooks for the Apollo GraphQL client. To run in watch mode which actively updates on any change, add the `--watch` flag.

## Apollo Server Express

If included, run from `packages/server/`.

### `yarn start`

Starts the server running locally.

### `yarn test`

Launches the test runner in the interactive watch mode.

## Hasura

If included, run from `hasura/`.

Common commands are shown below. Additional commands are documented at https://hasura.io/docs/1.0/graphql/core/hasura-cli/index.html#commands

### `docker-compose up`

Starts Hasura and Postgres in Docker containers running locally.

### `yarn hasura console`

Run a web server to serve the Hasura console for the GraphQL engine to manage the database and build queries.

Changes to the schema automatically update the migrations file.

## Mobile

If included, run from `packages/mobile/`.

Common commands are shown below. Additional commands are documented at https://docs.expo.io/workflow/expo-cli/#commands

### `yarn start`

Starts or restarts a local server for your app and gives you a url to it.

### `yarn test`

Launches the test runner in the interactive watch mode.

## Pulumi AWS

If included, run from `packages/pulumi-aws`.

Common commands are shown below. Additional commands are documented at https://www.pulumi.com/docs/reference/cli/#common-commands

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

Common commands are shown below. Additional commands are documented at https://create-react-app.dev/docs/available-scripts

### `yarn start`

Starts or restarts a local server for your app and gives you a url to it.

### `yarn test`

Launches the test runner in the interactive watch mode.
