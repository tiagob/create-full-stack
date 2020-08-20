import { DrawerNavigationProp } from "@react-navigation/drawer";
import React from "react";
import { Platform } from "react-native";
import { Header as ElementsHeader, Icon } from "react-native-elements";

import { RootStackParamList } from "../utils/types";

interface Props {
  navigation: DrawerNavigationProp<RootStackParamList, "Todos" | "About">;
}

export default function Header({ navigation }: Props) {
  return (
    <ElementsHeader
      containerStyle={Platform.select({
        android: Platform.Version <= 20 ? { paddingTop: 0, height: 56 } : {},
      })}
      barStyle="light-content"
      leftComponent={
        <Icon
          name="menu"
          onPress={() => navigation.openDrawer()}
          color="white"
        />
      }
    />
  );
}
