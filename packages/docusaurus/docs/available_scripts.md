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

Generates TypeScript types and React hooks for the Apollo GraphQL client. This runs in watch mode which actively updates on any changes.

## Web

If included, run from `packages/web/`.

https://create-react-app.dev/docs/available-scripts

## Mobile

If included, run from `packages/mobile/`.

### `yarn start`

Starts or restarts a local server for your app and gives you a url to it.

### `yarn test`

Launches the test runner in the interactive watch mode.

### Additional Expo commands

Expo CLI comes with many commands which can be run from `packages/mobile/`. https://docs.expo.io/workflow/expo-cli/#commands

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
