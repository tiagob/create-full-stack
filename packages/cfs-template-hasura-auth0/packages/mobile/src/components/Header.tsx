import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useAuth0 } from "cfs-expo-auth0";
import React from "react";
import { Platform } from "react-native";
import { Avatar, Header as ElementsHeader } from "react-native-elements";

import { RootStackParamList } from "../utils/types";

interface Props {
  navigation: DrawerNavigationProp<
    RootStackParamList,
    "Todos" | "About" | "SignIn"
  >;
}

export default function Header({ navigation }: Props) {
  const { user } = useAuth0();
  return (
    <ElementsHeader
      containerStyle={Platform.select({
        android: Platform.Version <= 20 ? { paddingTop: 0, height: 56 } : {},
      })}
      barStyle="light-content"
      leftComponent={
        <Avatar
          rounded
          source={{
            uri: user?.picture,
          }}
          onPress={() => navigation.openDrawer()}
        />
      }
    />
  );
}
