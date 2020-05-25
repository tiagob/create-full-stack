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

### Create and register Firebase

If you haven't already as part of the web or mobile setup.

Complete steps [#1](https://firebase.google.com/docs/web/setup#create-project) and [#2](https://firebase.google.com/docs/web/setup#register-app) in the [setup docs](https://firebase.google.com/docs/web/setup)

### Add your Firebase Service Account Key

Generate and download the Firebase Application Credentials into `src/utils/serviceAccountKey.json`.

1. In the Firebase console, open Project Settings > [Service Accounts](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk).
1. Click Generate New Private Key, then confirm by clicking Generate Key.

Replace snake_case key names with camelCase. In `serviceAccountKey.json` the keys should look like:

```json
{
  "type": "",
  "projectId": "",
  "privateKeyId": "",
  "privateKey": "",
  "clientEmail": "",
  "clientId": "",
  "authUri": "",
  "tokenUri": "",
  "authProviderX509CertUrl": "",
  "clientX509CertUrl": ""
}
```

### Enable Google Sign-In in the Firebase console

If you haven't already as part of the web or mobile setup.

1. In the [Firebase console](https://console.firebase.google.com/), open the Auth section.
1. On the Sign in method tab, enable the Google sign-in method and click Save.

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
