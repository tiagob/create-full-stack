import { DrawerNavigationProp } from "@react-navigation/drawer";
import React from "react";
import { Linking, StyleSheet, View } from "react-native";
import { Button } from "react-native-elements";

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

type ScreenNavigationProp = DrawerNavigationProp<RootStackParamList, "About">;

interface Props {
  navigation: ScreenNavigationProp;
}

export default function About({ navigation }: Props) {
  return (
    <View style={styles.root}>
      <Header navigation={navigation} />
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
