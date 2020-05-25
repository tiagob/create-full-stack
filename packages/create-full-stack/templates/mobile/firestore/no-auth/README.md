# Mobile

An Expo [managed workflow](https://docs.expo.io/introduction/managed-vs-bare/#managed-workflow) for [react-native](https://reactnative.dev/).

## Setup

### Create and register Firebase

If you haven't already as part of backend or web setup.

Complete steps [#1](https://firebase.google.com/docs/web/setup#create-project) and [#2](https://firebase.google.com/docs/web/setup#register-app) in the [setup docs](https://firebase.google.com/docs/web/setup)

Record the Firebase config variables `apiKey`, `authDomain` and `projectId`.

![Firebase Config](https://raw.githubusercontent.com/tiagob/ts-react-apollo-node/firebase-auth/firebaseConfig.png)

### Set the environment variables

Create and edit `.env` with your favorite editor

```bash
FIREBASE_API_KEY=apiKey
FIREBASE_AUTH_DOMAIN=authDomain
FIREBASE_PROJECT_ID=projectId
```

**All [custom environment variables](https://facebook.github.io/create-react-app/docs/adding-custom-environment-variables) on the client must be prefaced with `REACT_APP_`**

## Run

```bash
yarn start
```
