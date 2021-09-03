import { ApolloProvider } from "@apollo/client";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import React, { ReactElement } from "react";
import { Icon } from "react-native-elements";

import About from "./src/containers/About";
import Todos from "./src/containers/Todos";
import apolloClient from "./src/utils/apolloClient";
import { RootStackParamList } from "./src/utils/types";

const Drawer = createDrawerNavigator<RootStackParamList>();

export default function App(): ReactElement {
  return (
    <ApolloProvider client={apolloClient}>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Todos">
          <Drawer.Screen
            name="Todos"
            component={Todos}
            options={{
              drawerIcon: ({ color, size }) => (
                <Icon color={color} size={size} name="home" />
              ),
            }}
          />
          <Drawer.Screen
            name="About"
            component={About}
            options={{
              drawerIcon: ({ color, size }) => (
                <Icon color={color} size={size} name="info" />
              ),
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}
