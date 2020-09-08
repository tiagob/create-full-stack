import { NavigationContainerRef } from "@react-navigation/native";
import { Auth0Provider } from "cfs-expo-auth0";
import React, { ReactElement } from "react";

import Navigator from "./src/containers/Navigator";

export const navigationRef = React.createRef<NavigationContainerRef>();

export default function App(): ReactElement {
  return (
    <Auth0Provider
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      clientId={process.env.AUTH0_CLIENT_ID!}
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      audience={process.env.AUTH0_AUDIENCE!}
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      domain={process.env.AUTH0_DOMAIN!}
      onLogin={() => {
        navigationRef.current?.navigate("Todos");
      }}
    >
      <Navigator navigationRef={navigationRef} />
    </Auth0Provider>
  );
}
