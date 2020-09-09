---
id: available_scripts
title: Available Scripts
---

## Root level

### `yarn start`

Launch all platforms for local development. Platforms will reload if edits are made. You will see any lint errors in the console.

### `yarn test`

Runs all the tests across the platforms once. Unlike platform specific `yarn test`, this does not use watch mode which makes it useful for CI.

### `yarn generate`

Generates TypeScript types and React hooks for the Apollo GraphQL client. To run in watch mode which actively updates on any change, add the `--watch` flag.

## Web

If included, run from `packages/web/`.

https://create-react-app.dev/docs/available-scripts

### `yarn start`

Starts or restarts a local server for your app and gives you a url to it.

### `yarn test`

Launches the test runner in the interactive watch mode.

## Mobile

If included, run from `packages/mobile/`.

Expo CLI comes with many commands https://docs.expo.io/workflow/expo-cli/#commands

### `yarn start`

Starts or restarts a local server for your app and gives you a url to it.

### `yarn test`

Launches the test runner in the interactive watch mode.

## Apollo Server Express

If included, run from `packages/server/`.

### `yarn start`

Launch the server running locally.

### `yarn test`

Launches the test runner in the interactive watch mode.

## Hasura

If included, run from `hasura/`.

https://hasura.io/docs/1.0/graphql/core/hasura-cli/index.html#commands

## Pulumi AWS

If included, run from `packages/pulumi-aws`.

https://www.pulumi.com/docs/reference/cli/#common-commands
