import React from "react";
import {
  Container,
  Header,
  Title,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text,
  View
} from "native-base";
import { Linking, Dimensions } from "react-native";
import { NavigationScreenProps } from "react-navigation";

export default function AboutScreen({ navigation }: NavigationScreenProps) {
  return (
    <Container>
      <Header>
        <Left>
          <Button transparent onPress={() => navigation.push("Todo")}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>About</Title>
        </Body>
        <Right />
      </Header>
      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          flex: 1
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center"
          }}
        >
          <Button
            onPress={() =>
              Linking.openURL("https://github.com/tiagob/todo-starter")
            }
          >
            <Text>github</Text>
          </Button>
        </View>
      </View>
    </Container>
  );
}
