import { NavigationContainerRef } from "@react-navigation/native";
import { Auth0Provider } from "cfs-expo-auth0";
import React, { ReactElement } from "react";

import Navigator from "./src/containers/Navigator";

export const navigationRef = React.createRef<NavigationContainerRef>();

export default function App(): ReactElement {
  if (!process.env.AUTH0_CLIENT_ID) {
    throw new Error(
      "`AUTH0_CLIENT_ID` is required. See development.html or DEVELOPMENT.md. Changes to `.env` files requires a restart."
    );
  }
  if (!process.env.AUTH0_AUDIENCE) {
    throw new Error(
      "`AUTH0_AUDIENCE` is required. See development.html or DEVELOPMENT.md. Changes to `.env` files requires a restart."
    );
  }
  if (!process.env.AUTH0_DOMAIN) {
    throw new Error(
      "`AUTH0_DOMAIN` is required. See development.html or DEVELOPMENT.md. Changes to `.env` files requires a restart."
    );
  }
  return (
    <Auth0Provider
      clientId={process.env.AUTH0_CLIENT_ID}
      audience={process.env.AUTH0_AUDIENCE}
      domain={process.env.AUTH0_DOMAIN}
      onLogin={() => {
        navigationRef.current?.navigate("Todos");
      }}
      onTokenRequestFailure={() => {
        navigationRef.current?.navigate("SignIn");
      }}
    >
      <Navigator navigationRef={navigationRef} />
    </Auth0Provider>
  );
}
