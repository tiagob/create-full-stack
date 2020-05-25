import { StackNavigationProp } from "@react-navigation/stack";
import Constants from "expo-constants";
import * as Google from "expo-google-app-auth";
import React, { useState } from "react";
import { View } from "react-native";
import { Button, Header } from "react-native-elements";

import firebase from "../utils/firebase";
import { RootStackParamList } from "../utils/types";

type ScreenNavigationProp = StackNavigationProp<RootStackParamList, "SignIn">;

interface Props {
  navigation: ScreenNavigationProp;
}

export default function SignIn({ navigation }: Props) {
  const [loading, setLoading] = useState(false);
  return (
    <View style={{ flex: 1 }}>
      <Header
        centerComponent={{ text: "SIGN IN", style: { color: "white" } }}
      />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
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
