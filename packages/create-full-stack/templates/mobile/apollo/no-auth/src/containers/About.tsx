import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Linking, View } from "react-native";
import { Button, Header, Icon } from "react-native-elements";

import { RootStackParamList } from "../utils/types";

type ScreenNavigationProp = StackNavigationProp<RootStackParamList, "About">;

interface Props {
  navigation: ScreenNavigationProp;
}

export default function About({ navigation }: Props) {
  return (
    <View style={{ flex: 1 }}>
      <Header
        centerComponent={{ text: "ABOUT", style: { color: "white" } }}
        leftComponent={
          <Icon
            name="arrow-back"
            onPress={() => navigation.push("Todos")}
            color="white"
          />
        }
      />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          title="Go to GitHub"
          onPress={() =>
            Linking.openURL("https://github.com/tiagob/create-full-stack")
          }
        />
      </View>
    </View>
  );
}
