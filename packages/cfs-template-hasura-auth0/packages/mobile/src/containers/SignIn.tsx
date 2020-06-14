import React from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-elements";

import Header from "../components/Header";
import { useAuth0 } from "../utils/reactNativeAuth0";

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

export default function SignIn() {
  const { request, loginWithRedirect } = useAuth0();

  return (
    <View style={styles.root}>
      <Header
        centerComponent={{ text: "SIGN IN", style: { color: "white" } }}
      />
      <View style={styles.container}>
        <Button
          title="SIGN IN"
          onPress={loginWithRedirect}
          disabled={!request}
        />
      </View>
    </View>
  );
}
