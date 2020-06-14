import React from "react";
import { Platform } from "react-native";
import { Header as ElementsHeader, HeaderProps } from "react-native-elements";

export default function Header(props: HeaderProps) {
  return (
    <ElementsHeader
      // Fix height on Android
      // https://github.com/react-native-elements/react-native-elements/issues/1793#issuecomment-482352764
      statusBarProps={{ translucent: true }}
      containerStyle={Platform.select({
        android: Platform.Version <= 20 ? { paddingTop: 0, height: 56 } : {},
      })}
      barStyle="light-content"
      {...props}
    />
  );
}
