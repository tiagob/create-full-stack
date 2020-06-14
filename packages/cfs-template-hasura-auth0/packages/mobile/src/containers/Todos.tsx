import { StackNavigationProp } from "@react-navigation/stack";
import { useTodosQuery } from "common";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Icon } from "react-native-elements";

import CreateTodo from "../components/CreateTodo";
import Header from "../components/Header";
import Todo from "../components/Todo";
import { RootStackParamList } from "../utils/types";

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

type ScreenNavigationProp = StackNavigationProp<RootStackParamList, "Todos">;

interface Props {
  navigation: ScreenNavigationProp;
}

export default function Todos({ navigation }: Props) {
  const { data } = useTodosQuery();
  return (
    <View style={styles.root}>
      <Header
        centerComponent={{ text: "TODOS", style: { color: "white" } }}
        rightComponent={
          <Icon
            name="info"
            onPress={() => navigation.push("About")}
            color="white"
          />
        }
      />
      <CreateTodo />
      <FlatList
        data={data?.todos || []}
        renderItem={({ item }) => <Todo todo={item} />}
        keyExtractor={(item) => item.id.toString()}
        style={{ flex: 1 }}
      />
    </View>
  );
}
