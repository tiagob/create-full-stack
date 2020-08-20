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

// https://reactnavigation.org/docs/drawer-navigator#providing-a-custom-drawercontent
// https://github.com/react-navigation/react-navigation/blob/main/packages/drawer/src/views/DrawerItemList.tsx

type Props = Omit<DrawerContentOptions, "contentContainerStyle" | "style"> & {
  state: DrawerNavigationState;
  navigation: DrawerNavigationHelpers;
  descriptors: DrawerDescriptorMap;
};

export default (logout: () => void) =>
  function CustomDrawerContent({ state, navigation, ...rest }: Props) {
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
        <DrawerItemList
          state={updatedState}
          navigation={navigation}
          {...rest}
        />
        <Divider />
        <DrawerItem
          label="Logout"
          onPress={logout}
          icon={({ color, size }: { color: string; size: number }) => (
            <Icon color={color} size={size} name="exit-to-app" />
          )}
        />
      </DrawerContentScrollView>
    );
  };
