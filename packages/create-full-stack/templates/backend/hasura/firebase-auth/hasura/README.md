# Hasura

[Hasura](https://hasura.io/) is an open source engine that connects to your databases & microservices and auto-generates a production-ready GraphQL backend.

## Setup

- Install [Docker](https://docs.docker.com/install/)
- Install [Docker Compose](https://docs.docker.com/compose/install/)
- Install the [Hasura CLI](https://hasura.io/docs/1.0/graphql/manual/hasura-cli/install-hasura-cli.html)

## Run

```bash
docker-compose up -d
```

## Console

Run a web server to serve the Hasura console for the GraphQL engine to manage the database and build queries.

```bash
hasura console --admin-secret myadminsecretkey
```

Accessing the console via http://localhost:9695/ automatically adds database migration and metadata files on changes ([docs](https://hasura.io/docs/1.0/graphql/manual/migrations/index.html#how-is-hasura-state-managed)).
