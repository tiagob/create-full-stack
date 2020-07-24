import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { ReactElement } from "react";

import About from "./src/containers/About";
import Auth0ApolloProvider from "./src/containers/Auth0ApolloProvider";
import SignIn from "./src/containers/SignIn";
import Todos from "./src/containers/Todos";
import { Auth0Provider } from "./src/utils/reactNativeAuth0";
import { RootStackParamList } from "./src/utils/types";

const Stack = createStackNavigator<RootStackParamList>();

export const navigationRef = React.createRef<NavigationContainerRef>();

export default function App(): ReactElement {
  return (
    <Auth0Provider
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      clientId={process.env.AUTH0_CLIENT_ID!}
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      audience={process.env.AUTH0_AUDIENCE!}
      authorizationEndpoint={`https://${process.env.AUTH0_DOMAIN}/authorize`}
      onRedirectCallback={() => {
        navigationRef.current?.navigate("Todos");
      }}
    >
      <Auth0ApolloProvider>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator initialRouteName="SignIn" headerMode="none">
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="Todos" component={Todos} />
            <Stack.Screen name="About" component={About} />
          </Stack.Navigator>
        </NavigationContainer>
      </Auth0ApolloProvider>
    </Auth0Provider>
  );
}
