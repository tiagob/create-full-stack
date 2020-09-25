---
id: backend
title: Backend
---

Backend choices for Create Full Stack. Hasura is recommended for most cases.

## Apollo Server Express

[![GitHub stars](https://img.shields.io/github/stars/apollographql/apollo-server.svg?style=social&label=Star&maxAge=2592000)](https://github.com/apollographql/apollo-server/stargazers/)

This choice scaffolds out a TypeScript Node server at `packages/server/`.

[Apollo Server Express](https://www.npmjs.com/package/apollo-server-express) uses Node.js and the Express web framework to create a GraphQL API. Developers explicitly define the GraphQL resolvers. This makes use cases with lots of custom business logic simpler at the expense of manually coding everything.

### Features

- GraphQL: Yes
- Automatic resolvers: No
- Developer console: No
- GraphQL playground: Yes
- Permissions/Auth support: Yes
- Database: Postgres
- ORM: [TypeORM](https://typeorm.io/#/)
- Migration support: Yes
- Custom business logic: Yes

### Stack

- [Apollo Server Express](https://github.com/apollographql/apollo-server/tree/main/packages/apollo-server-express) (GraphQL resolver)
- [Express](https://github.com/expressjs/express)
- [TS Jest](https://github.com/kulshekhar/ts-jest) (testing)
- [Node](https://github.com/nodejs/node)
- [Postgres](https://www.postgresql.org/)
- [TypeORM](https://github.com/typeorm/typeorm) (ORM)

## Hasura

[![GitHub stars](https://img.shields.io/github/stars/hasura/graphql-engine.svg?style=social&label=Star&maxAge=2592000)](https://github.com/hasura/graphql-engine/stargazers/)

This choice includes the Hasura Docker image and configuration files at `hasura/`.

Given a Postgres database [Hasura](https://hasura.io/opensource) provides a GraphQL API and a web console. From the web console developers can modify the Postgres schema, API permissions on a column level or add hooks for custom business logic. Schema changes from the console automatically create migration files which are applied anytime Hasura is spun up. Hasura is open-source and runs in a Docker container.

### Features

- GraphQL: Yes
- Automatic resolvers: Yes
- Developer console: No
- GraphQL playground: Yes
- Permissions/Auth support: Yes
- Database: Postgres
- ORM: N/A
- Migration support: Yes
- Custom business logic: Requires additional service
