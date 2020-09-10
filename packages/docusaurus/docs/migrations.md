---
id: migrations
title: Migrations
---

## Apollo Server Express

If included, run from `packages/server`.

Common commands are shown below. Additional commands are documented at https://typeorm.io/#/migrations

### `yarn typeorm migration:run`

Executes all pending migrations and runs them in a sequence ordered by their timestamps. This means all sql queries written in the up methods of your created migrations will be executed.

### `yarn typeorm migration:revert`

Executes down in the latest executed migration. If you need to revert multiple migrations you must call this command multiple times.

### `yarn typeorm migration:generate -n <title>`

Automatically generate migration files in the format `{TIMESTAMP}-{title}.ts` with schema changes you made.

## Hasura

If included, run from `packages/server`.

Common commands are shown below. Additional commands are documented at https://hasura.io/docs/1.0/graphql/core/hasura-cli/hasura_migrate.html#hasura-migrate. Learn more about Hasura migrations at https://hasura.io/docs/1.0/graphql/core/migrations/index.html

### `yarn hasura migrate apply`

Applies all migrations to the database.

### `hasura migrate status`

Displays the current status of migrations on a database.

## Resetting Docker Postgres locally

Sometimes you may need to completely wipe your local Postgres DB running on Docker. For instance, you're developing Create Full Stack and switching between Auth0 and no auth 😃.

Todo this remove the Docker container then the volume.

```bash
docker rm <project name>_postgres_1
docker volume rm <project name>_db_data
```
