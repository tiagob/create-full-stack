# Backend

## Setup

### Install Postgres

```bash
brew install postgres
```

Start Postgres

```bash
brew services start postgres
```

### Setup database

Create database and sync (creating tables).

```bash
cd packages/backend
./createDb.sh  # Assumes Postgres is installed and running
yarn sync-db
```

### Auth0 setup

**TODO**

## Run

```bash
yarn watch
```

## Gotchas

### ECONNREFUSED 127.0.0.1:5432

Postgres isn't running. Start it with:

```bash
brew services start postgres
```
