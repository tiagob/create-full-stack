# Mobile

An Expo [managed workflow](https://docs.expo.io/introduction/managed-vs-bare/#managed-workflow) for [react-native](https://reactnative.dev/).

## Setup

### Create and register Firebase

If you haven't already as part of backend or web setup.

Complete steps [#1](https://firebase.google.com/docs/web/setup#create-project) and [#2](https://firebase.google.com/docs/web/setup#register-app) in the [setup docs](https://firebase.google.com/docs/web/setup)

Record the Firebase config variables `apiKey`, `authDomain` and `projectId`.

![Firebase Config](https://raw.githubusercontent.com/tiagob/ts-react-apollo-node/firebase-auth/firebaseConfig.png)

### Create OAuth 2.0 Client ID for iOS

1. Go to the [Firebase console](https://console.firebase.google.com/).
1. In the center of the project overview page, click the **iOS** icon to launch the setup workflow. If you've already added an app to your Firebase project, click **Add app** to display the platform options.
1. Enter "host.exp.exponent" in the **iOS bundle ID** field.
1. Click **Download GoogleService-Info.plist** to obtain your Firebase iOS config file (`GoogleService-Info.plist`).
1. Record the `CLIENT_ID` from `GoogleService-Info.plist`. It will later be used as the `iosClientId`.
1. Skip the rest of the steps.

### Create OAuth 2.0 Client ID for Android

1. Go to the [Firebase console](https://console.firebase.google.com/).
1. In the center of the project overview page, click the **Android** icon to launch the setup workflow. If you've already added an app to your Firebase project, click **Add app** to display the platform options.
1. Enter "host.exp.exponent" in the **Android package name** field.
1. Run `openssl rand -base64 32 | openssl sha1 -c` in your terminal, it will output a string that looks like A1:B2:C3 but longer. Copy the output to your clipboard.
1. Paste the output from the previous step into the **Debug signing certificate SHA-1** field (Required for Google Sign-In).
1. Click **Download google-services.json** to obtain your Firebase Android config file (`google-services.json`).
1. Record the first `client_id` under `oauth_client` from `google-services.json`. It will later be used as the `androidClientId`.
1. Skip the rest of the steps.

### Set the environment variables

Create and edit `.env` with your favorite editor

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
