import {
  DrawerContentOptions,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import {
  DrawerDescriptorMap,
  DrawerNavigationHelpers,
} from "@react-navigation/drawer/src/types";
import { DrawerNavigationState } from "@react-navigation/native";
import * as React from "react";
import { Divider, Icon } from "react-native-elements";

type Props = Omit<DrawerContentOptions, "contentContainerStyle" | "style"> & {
  state: DrawerNavigationState;
  navigation: DrawerNavigationHelpers;
  descriptors: DrawerDescriptorMap;
};

export default function DrawerContent({ state, navigation, ...rest }: Props) {
  const filteredRoutes = state.routes.filter(
    (route) => route.name !== "SignIn"
  );
  const updatedState = {
    ...state,
    routes: state.routes.slice(1),
    index: state.index - (state.routes.length - filteredRoutes.length),
  };
  return (
    <DrawerContentScrollView {...rest}>
      <DrawerItemList state={updatedState} navigation={navigation} {...rest} />
      <Divider />
      <DrawerItem
        label="Logout"
        // Logout by prompting a new Auth0 login
        // https://github.com/expo/auth0-example/issues/25#issuecomment-468582410
        onPress={() => navigation.navigate("SignIn")}
        icon={({ color, size }: { color: string; size: number }) => (
          <Icon color={color} size={size} name="exit-to-app" />
        )}
      />
    </DrawerContentScrollView>
  );
}
