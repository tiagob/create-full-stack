import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Linking, StyleSheet, View } from "react-native";
import { Button, Icon } from "react-native-elements";

import Header from "../components/Header";
import { RootStackParamList } from "../utils/types";

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

type ScreenNavigationProp = StackNavigationProp<RootStackParamList, "About">;

interface Props {
  navigation: ScreenNavigationProp;
}

export default function About({ navigation }: Props) {
  return (
    <View style={styles.root}>
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
      <View style={styles.container}>
        <Button
          title="GO TO GITHUB"
          onPress={() =>
            Linking.openURL("https://github.com/tiagob/create-full-stack")
          }
        />
      </View>
    </View>
  );
}
