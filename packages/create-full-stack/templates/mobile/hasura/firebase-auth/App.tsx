import { ApolloProvider } from "@apollo/react-hooks";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { ReactElement } from "react";

import About from "./src/containers/About";
import SignIn from "./src/containers/SignIn";
import Todos from "./src/containers/Todos";
import apolloClient from "./src/utils/apolloClient";
import { RootStackParamList } from "./src/utils/types";

const Stack = createStackNavigator<RootStackParamList>();

export default function App(): ReactElement {
  return (
    <ApolloProvider client={apolloClient}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SignIn" headerMode="none">
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="Todos" component={Todos} />
          <Stack.Screen name="About" component={About} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}
