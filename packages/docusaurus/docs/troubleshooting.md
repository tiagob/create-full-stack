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

## Failed to load resource: net::ERR_EMPTY_RESPONSE

If either of the following URLs returns an empty response:

- Hasura backend: `https://hasura.[YOUR DOMAIN].com/v1/graphql`
- Apollo Server Express backend: `https://server.[YOUR DOMAIN].com/graphql`

If you just launched the service, Fargate can sometimes take a few minutes to come up. If it's been over ten minutes, try re-provisioning Fargate and the associated listener and target group. To do that, comment out the Fargate resource in `packages/pulumi-aws/index.ts`:

```bash
--- a/packages/pulumi-aws/index.ts
+++ b/packages/pulumi-aws/index.ts
@@ -33,18 +33,18 @@ const { connectionString } = new Rds("server-db", {
dbUsername,
dbPassword,
});
-new Fargate(path.basename(serverPath), {

- certificateArn,
- domain: serverDomain,
- image: awsx.ecs.Image.fromDockerBuild("image", {
- context: "../..",
- dockerfile: `${serverPath}/Dockerfile`,
- }),
- env: {
- DATABASE_URL: connectionString,
- CORS_ORIGIN: webUrl,
- },
  -});
  +// new Fargate(path.basename(serverPath), {
  +// certificateArn,
  +// domain: serverDomain,
  +// image: awsx.ecs.Image.fromDockerBuild("image", {
  +// context: "../..",
  +// dockerfile: `${serverPath}/Dockerfile`,
  +// }),
  +// env: {
  +// DATABASE_URL: connectionString,
  +// CORS_ORIGIN: webUrl,
  +// },
  +// });
```

Then run:

```bash
pulumi up --yes
```

Undo the changes above in `packages/pulumi-aws/index.ts` then again run:

```bash
pulumi up --yes
```
