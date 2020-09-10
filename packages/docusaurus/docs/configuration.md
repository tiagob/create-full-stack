---
id: configuration
title: Configuration
---

Configuration across web, mobile and apollo-sever-express follows CRA's [environment variables](https://create-react-app.dev/docs/adding-custom-environment-variables/). Configuration specific to cloud deployment is found in the [Pulumi stack](https://www.pulumi.com/docs/intro/concepts/stack/).

Create Full Stack loads environment variables from `.env` files into `process.env`. Storing configuration in the environment separate from code is based on [The Twelve-Factor App methodology](https://12factor.net/config).

`.env` files are in their corresponding platform packages directories. For instance, `packages/web/.env.production` or `packages/mobile/.env.production`.

- `.env`: Default.
- `.env.local`: Local overrides. This file is loaded for all environments except test.
- `.env.development`, `.env.test`, `.env.production`: Environment-specific settings.
- `.env.development.local`, `.env.test.local`, `.env.production.local`: Local overrides of environment-specific settings.

Files on the left have more priority than files on the right:

- `npm start`: `.env.development.local`, `.env.development`, `.env.local`, `.env`
- `npm run build`: `.env.production.local`, `.env.production`, `.env.local`, `.env`
- `npm test`: `.env.test.local`, `.env.test`, `.env` (note `.env.local` is missing)

## With Pulumi AWS

| production                                   | development        | test        |
| -------------------------------------------- | ------------------ | ----------- |
| `Pulumi.production.yml` or `.env.production` | `.env.development` | `.env.test` |

Pulumi stack configuration is in the `pulumi-aws` package. For instance, `packages/pulumi-aws/Pulumi.production.yml`. If Auth0 is included, Auth0 local development configuration is included in the Pulumi stack `Pulumi.development.yml` since this exists in the cloud.

Pulumi stacks shouldn't be confused with `NODE_ENV`. A `NODE_ENV` of production tells CRA and Node to set various optimizations (ex. minification) relevant for running on a server. `NODE_ENV` is used to determine which `.env` files are loaded. Alternatively, Pulumi stacks can be seen as deployed environments (ex. production or staging). If you were to create a staging environment you'd have a `Pulumi.staging.yml` which would also load `.env.production`.
