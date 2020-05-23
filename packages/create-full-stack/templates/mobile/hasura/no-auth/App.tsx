import { ApolloProvider } from "@apollo/react-hooks";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { ReactElement } from "react";

import About from "./src/containers/About";
import Todos from "./src/containers/Todos";
import apolloClient from "./src/utils/apolloClient";
import { RootStackParamList } from "./src/utils/types";

const Stack = createStackNavigator<RootStackParamList>();

export default function App(): ReactElement {
  return (
    <ApolloProvider client={apolloClient}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Todos" headerMode="none">
          <Stack.Screen name="Todos" component={Todos} />
          <Stack.Screen name="About" component={About} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}
