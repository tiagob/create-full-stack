# Hasura

[Hasura](https://hasura.io/) is an open source engine that connects to your databases & microservices and auto-generates a production-ready GraphQL backend.

## Run

```bash
docker-compose up
```

## Console

Run a web server to serve the Hasura console for the GraphQL engine to manage the database and build queries.

```bash
hasura console
```

Accessing the console via http://localhost:9695/ automatically adds database migration and metadata files on changes ([docs](https://hasura.io/docs/1.0/graphql/manual/migrations/index.html#how-is-hasura-state-managed)).

## Migrations

### Apply all

```bash
hasura migrate apply --admin-secret myadminsecretkey
```

### Down

```bash
hasura migrate apply --admin-secret myadminsecretkey --down N
```

### Apply metadata

```bash
hasura metadata apply --admin-secret myadminsecretkey
```

### Recreate DB

Run only postgres (not hasura)

```bash
docker-compose up postgres
```

Drop the DB

```bash
docker-compose exec postgres dropdb postgres -U postgres
```

Create the DB

```bash
docker-compose exec postgres createdb postgres -U postgres
```
