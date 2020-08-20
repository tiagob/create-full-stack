import { ApolloProvider } from "@apollo/client";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import React from "react";
import { Icon } from "react-native-elements";

import CustomDrawerContent from "../components/CustomDrawerContent";
import getApolloClient from "../utils/getApolloClient";
import { useAuth0 } from "../utils/reactNativeAuth0";
import { RootStackParamList } from "../utils/types";
import About from "./About";
import SignIn from "./SignIn";
import Todos from "./Todos";

const Drawer = createDrawerNavigator<RootStackParamList>();

interface Props {
  navigationRef: React.RefObject<NavigationContainerRef>;
}

export default function Navigator({ navigationRef }: Props) {
  const { token, logout } = useAuth0();
  const apolloClient = getApolloClient(token);

  return (
    <ApolloProvider client={apolloClient}>
      <NavigationContainer ref={navigationRef}>
        <Drawer.Navigator
          initialRouteName="SignIn"
          drawerContent={CustomDrawerContent(() => logout?.())}
        >
          <Drawer.Screen
            name="SignIn"
            component={SignIn}
            options={{ swipeEnabled: false }}
          />
          <Drawer.Screen
            name="Todos"
            component={Todos}
            options={{
              drawerIcon: ({
                color,
                size,
              }: {
                color: string;
                size: number;
              }) => <Icon color={color} size={size} name="home" />,
            }}
          />
          <Drawer.Screen
            name="About"
            component={About}
            options={{
              drawerIcon: ({
                color,
                size,
              }: {
                color: string;
                size: number;
              }) => <Icon color={color} size={size} name="info" />,
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}
