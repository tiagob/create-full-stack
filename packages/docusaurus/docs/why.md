---
id: why
title: Why?
---

## Problem

Focus on building your ideas and delighting your users, not fitting libraries and frameworks together. Get started today without the need to rewrite tomorrow.

## Solution

### Curated libraries and Frameworks

- Best tools in class
  - Every [library and framework](/docs/libraries_and_frameworks) has a large community
  - Ensures fewer edge cases and better support
- CFS provides the glue and cross-platform consistent [configuration](/docs/configuration)

### Guard rails

- Catch bugs early without sacrificing developer velocity
- Static type checking from the DB (Postgres) to UI and back
  - API layer is type checked with GraphQL
  - TypeScript types are generated from the GraphQL schema
- Strict linting ([Airbnb](https://github.com/airbnb/javascript)) and code formatting ([Prettier](https://prettier.io/))
  - Almost everything is autofix on save in VSCode

### Production ready

- No need to mess around with the AWS console
- Deploy with one command in minutes using [Pulumi](/docs/cloud)
- [CI/CD](/docs/cicd)
  - No 💩 gets checked in
  - Run tests automatically on GitHub
  - Pushes to master automatically deploy your full stack
- Change DB schema safely with [migration support](/docs/migrations)
