import { StackNavigationProp } from "@react-navigation/stack";
import Constants from "expo-constants";
import * as Google from "expo-google-app-auth";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-elements";

import Header from "../components/Header";
import firebase from "../utils/firebase";
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

type ScreenNavigationProp = StackNavigationProp<RootStackParamList, "SignIn">;

interface Props {
  navigation: ScreenNavigationProp;
}

export default function SignIn({ navigation }: Props) {
  const [loading, setLoading] = useState(false);
  return (
    <View style={styles.root}>
      <Header
        centerComponent={{ text: "SIGN IN", style: { color: "white" } }}
      />
      <View style={styles.container}>
        <Button
          title="SIGN IN WITH GOOGLE"
          onPress={async () => {
            setLoading(true);
            const { type, idToken } = (await Google.logInAsync({
              iosClientId: Constants.manifest.extra.googleIosClientId,
              androidClientId: Constants.manifest.extra.googleAndroidClientId,
            })) as {
              type: "success" | "cancel";
              idToken?: string | null;
            };
            if (type === "success" && idToken) {
              // Build Firebase credential with the Facebook access token.
              const credential = firebase.auth.GoogleAuthProvider.credential(
                idToken
              );

              // Sign in with credential from the Facebook user.
              await firebase.auth().signInWithCredential(credential);
              setLoading(false);
              navigation.push("Todos");
            }
          }}
          disabled={loading}
        />
      </View>
    </View>
  );
}
