# cfs-expo-auth0

This package includes the shareable Expo Auth0 library used by [Create Full Stack](https://github.com/tiagob/create-full-stack).<br>
Please refer to its documentation:

- [Getting Started](https://create-full-stack.com/docs) – How to create a new full stack.
- [User Guide](https://create-full-stack.com) – How to develop apps bootstrapped with Create Full Stack.

## Usage in Create Full Stack Projects

The easiest way to use this is with [Create Full Stack](https://github.com/tiagob/create-full-stack), which includes it by default.

**You don’t need to configure it separately in Create Full Stack projects.**

## Usage Outside of Create Full Stack

### Installation

Using [yarn](https://yarnpkg.com/)

```bash
yarn add cfs-expo-auth0
```

Using [npm](https://www.npmjs.com/)

```bash
npm install cfs-expo-auth0
```

### Getting Started

Configure the SDK by wrapping your application in `Auth0Provider`:

```js
// App.js
import { Auth0Provider } from "cfs-expo-auth0";
import React, { ReactElement } from "react";

import { Content } from "./Content";

export default function App() {
  return (
    <Auth0Provider
      clientId="YOUR_AUTH0_CLIENT_ID"
      audience="YOUR_AUTH0_API_AUDIENCE"
      domain="YOUR_AUTH0_DOMAIN"
      onLogin={() => {
        // Replace with your navigation code
      }}
      onTokenRequestFailure={() => {
        // Replace with your navigation code
      }}
    >
      <Content />
    </Auth0Provider>
  );
}
```

Use the `useAuth0` hook in your components to access authentication state (`user`, `accessToken`, `request` and `result`) and authentication methods (`login`):

```js
import { useAuth0 } from "cfs-expo-auth0";
import React from "react";

export default function HelloLogin() {
  const { user, result, login } = useAuth0();

  if (user) {
    return <div>Hello {user.name}</div>;
  }
  if (result?.type === "error") {
    return <div>Oops... an error occurred</div>;
  }

  return <button onClick={login}>Log in</button>;
}
```
