import { useAuth0 } from "cfs-expo-auth0";
import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { Button } from "react-native-elements";

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
  const { request, login } = useAuth0();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <Button title="SIGN IN" onPress={login} disabled={!request} />
      </View>
    </View>
  );
}
