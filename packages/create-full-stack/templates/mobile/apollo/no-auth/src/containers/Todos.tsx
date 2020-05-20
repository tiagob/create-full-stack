import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { FlatList, View } from "react-native";
import { Header, Icon } from "react-native-elements";

import CreateTodo from "../components/CreateTodo";
import Todo from "../components/Todo";
import { useTodosQuery } from "../graphql/__generated__";
import { RootStackParamList } from "../utils/types";

type ScreenNavigationProp = StackNavigationProp<RootStackParamList, "Todos">;

interface Props {
  navigation: ScreenNavigationProp;
}

export default function Todos({ navigation }: Props) {
  const { data } = useTodosQuery();
  return (
    <View style={{ flex: 1 }}>
      <Header
        centerComponent={{ text: "TODOS", style: { color: "white" } }}
        rightComponent={
          <Icon
            name="info"
            onPress={(): void => navigation.push("About")}
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
