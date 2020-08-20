import { NavigationContainerRef } from "@react-navigation/native";
import React, { ReactElement } from "react";

import Navigator from "./src/containers/Navigator";
import { Auth0Provider } from "./src/utils/reactNativeAuth0";

export const navigationRef = React.createRef<NavigationContainerRef>();

export default function App(): ReactElement {
  return (
    <Auth0Provider
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      clientId={process.env.AUTH0_CLIENT_ID!}
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      audience={process.env.AUTH0_AUDIENCE!}
      authorizationEndpoint={`https://${process.env.AUTH0_DOMAIN}/authorize`}
      onLogin={() => {
        navigationRef.current?.navigate("Todos");
      }}
      onLogout={() => {
        navigationRef.current?.navigate("SignIn");
      }}
    >
      <Navigator navigationRef={navigationRef} />
    </Auth0Provider>
  );
}
