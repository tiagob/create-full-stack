# Backend

## Setup

### Install [MySQL](https://www.mysql.com/)

**TODO: Switch to Postgres**

Install MySQL with Homebrew ([MySQL commands on MacOS](https://gist.github.com/nrollr/3f57fc15ded7dddddcc4e82fe137b58e)).

```bash
brew install mysql
brew tap homebrew/services
```

Start MySQL

```bash
brew services start mysql
```

### Setup database

Create database and sync (creating tables).

```bash
cd packages/backend
./createDb.sh  # Assumes MySQL is installed with Homebrew
yarn sync-db
```

## Run

```bash
yarn watch
```
