---
id: troubleshooting
title: Troubleshooting
---

## EADDRINUSE, Address already in use

Kill all node processes.

```bash
pkill node
```

## Hooks can only be called inside the body of a function component

React in both `packages/mobile/package.json` and `packages/web/package.json` need to be the same version since they're shared in Yarn Workspaces (unless you add [nohoist](https://yarnpkg.com/blog/2018/02/15/nohoist/)).

## Auth0 login hangs on Android virtual device

Your Android virtual device (AVD) must use Android 11. [expo/issues/9845](https://github.com/expo/expo/issues/9845)

## FatalError: relation \"todos\" already exists

Reset your docker Postgres volume. This wipes any existing data.

```bash
docker rm <project name>_postgres_1
docker volume rm <project name>_db_data
```

## pulumi:providers: no resource plugin found in the workspace or on your \$PATH, install the plugin

This can occur locally or in continuous deployment (CD) with GitHub actions.

If locally, run the command in the error message to install the plugin.

If on GitHub actions, you must setup and deploy the production stack locally first before GitHub actions can deploy. [pulumi/issues/2097](https://github.com/pulumi/pulumi/issues/2097)

To deploy the production stack run:

```bash
cd packages/pulumi-aws
pulumi stack select production
pulumi up
```

## Something is already running on port 3000

Check which service is running on the port.

```bash
sudo lsof -i tcp:3000
```

Kill it (ex. node)

```bash
pkill node
```
