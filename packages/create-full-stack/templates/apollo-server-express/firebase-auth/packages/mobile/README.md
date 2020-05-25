# Mobile

An Expo [managed workflow](https://docs.expo.io/introduction/managed-vs-bare/#managed-workflow) for [react-native](https://reactnative.dev/).

## Setup

### Create and register Firebase

If you haven't already as part of backend or web setup.

Complete steps [#1](https://firebase.google.com/docs/web/setup#create-project) and [#2](https://firebase.google.com/docs/web/setup#register-app) in the [setup docs](https://firebase.google.com/docs/web/setup)

### Create OAuth 2.0 Client IDs in the Google Developer Console

Instructions adapted from the [Expo docs](https://docs.expo.io/versions/latest/sdk/google/#using-it-inside-of-the-expo-app).

To use Google Sign In, you will need to create a project on the Google Developer Console and create an OAuth 2.0 client ID. This is, unfortunately, super annoying to do and we wish there was a way we could automate this for you, but at the moment the Google Developer Console does not expose an API. _You also need to register a separate set of Client IDs for a standalone app, the process for this is described later in this document_.

#### Get an app set up on the Google Developer Console

- Go to the [Credentials Page](https://console.developers.google.com/apis/credentials)
- Create an app for your project if you haven't already.
- Once that's done, click "Create Credentials" and then "OAuth client ID." You will be prompted to set the product name on the consent screen, go ahead and do that.

#### Create an iOS OAuth Client ID

- Select "iOS Application" as the Application Type. Give it a name if you want (e.g. "iOS Development").
- Use host.exp.exponent as the bundle identifier.
- Click "Create"
- You will now see a modal with the client ID.
- The client ID is used in the `iosClientId` environment variables below.

#### Create an Android OAuth Client ID

- Select "Android Application" as the Application Type. Give it a name if you want (maybe "Android Development").
- Run openssl rand -base64 32 | openssl sha1 -c in your terminal, it will output a string that looks like A1:B2:C3 but longer. Copy the output to your clipboard.
- Paste the output from the previous step into the "Signing-certificate fingerprint" text field.
- Use host.exp.exponent as the "Package name".
- Click "Create"
- You will now see a modal with the Client ID.
- The client ID is used in the `androidClientId` environment variables below.

### Set the environment variables

Create and edit `.env` with your favorite editor

Copy the Firebase config variables (`apiKey`, `authDomain` and `projectId`) to `/client/.env`. Found in step [#2](https://firebase.google.com/docs/web/setup#register-app) or in [Project Settings Config](https://support.google.com/firebase/answer/7015592).

![Firebase Config](https://raw.githubusercontent.com/tiagob/ts-react-apollo-node/firebase-auth/firebaseConfig.png)

```bash
FIREBASE_API_KEY=apiKey
FIREBASE_AUTH_DOMAIN=authDomain
FIREBASE_PROJECT_ID=projectId
GOOGLE_IOS_CLIENT_ID=iosClientId
GOOGLE_ANDROID_CLIENT_ID=androidClientId
```

**All [custom environment variables](https://facebook.github.io/create-react-app/docs/adding-custom-environment-variables) on the client must be prefaced with `REACT_APP_`**

### Enable Google Sign-In in the Firebase console

If you haven't already as part of backend or web setup.

1. In the [Firebase console](https://console.firebase.google.com/), open the Auth section.
1. On the Sign in method tab, enable the Google sign-in method and click Save.

## Run

```bash
yarn start
```
