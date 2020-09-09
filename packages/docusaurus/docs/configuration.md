---
id: configuration
title: Configuration
---

Configuration across web, mobile and apollo-sever-express follows CRA's `.env` [environment variables](https://create-react-app.dev/docs/adding-custom-environment-variables/). Configuration specific to cloud deployment is found in the [Pulumi stack](https://www.pulumi.com/docs/intro/concepts/stack/).

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

## Without Pulumi AWS

| development        | test        |
| ------------------ | ----------- |
| `.env.development` | `.env.test` |
