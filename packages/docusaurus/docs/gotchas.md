---
id: gotchas
title: Gotchas
---

## EADDRINUSE, Address already in use

Kill all node processes.

```bash
killall node
```

## Hooks can only be called inside the body of a function component

React in both `packages/mobile/package.json` and `packages/web/package.json` need to be the same version since they're shared in Yarn Workspaces (unless you add [nohoist](https://yarnpkg.com/blog/2018/02/15/nohoist/)).

## Auth0 login hangs on Android virtual device

Must use Android 11. https://github.com/expo/expo/issues/9845

## FatalError: relation \"todos\" already exists

Reset your docker Postgres volume. This wipes any existing data.

```bash
docker rm <project name>_postgres_1
docker volume rm <project name>_db_data
```

## An unexpected error occurred: "https://github.com/expo/react-native/archive/sdk-x.x.x.tar.gz: ENOENT: no such file or directory

An unknown issue with the yarn cache that can occur when running `yarn create full-stack <project-directory>`. Resolve by re-running.

## pulumi:providers:aws default_x_x_x error: no resource plugin 'aws-vx.x.x' found in the workspace or on your \$PATH, install the plugin using `pulumi plugin install resource aws vx.x.x`

This can occur in continuous deployment (CD) with GitHub actions. You must setup and deploy the production stack locally first before GitHub actions can deploy. https://github.com/pulumi/pulumi/issues/2097

To deploy the production stack run:

```bash
cd packages/pulumi-aws
pulumi stack select production
pulumi up
```
