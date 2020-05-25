import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { Header, Icon } from "react-native-elements";

import CreateTodo from "../components/CreateTodo";
import Todo from "../components/Todo";
import { getTodosCollection } from "../utils/firebase";
import { RootStackParamList, TodoType } from "../utils/types";

type ScreenNavigationProp = StackNavigationProp<RootStackParamList, "Todos">;

interface Props {
  navigation: ScreenNavigationProp;
}

export default function Todos({ navigation }: Props) {
  const [todos, setTodos] = useState<TodoType[]>([]);
  useEffect(() => {
    const unsubscribe = getTodosCollection().onSnapshot((querySnapshot) => {
      const firestoreTodos: TodoType[] = [];
      querySnapshot.forEach((doc) => {
        firestoreTodos.push({ id: doc.id, ...(doc.data() as TodoType) });
      });
      setTodos(firestoreTodos);
    });
    return unsubscribe;
  }, []);

  return (
    <View style={{ flex: 1 }}>
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
        data={todos}
        renderItem={({ item }) => <Todo todo={item} />}
        keyExtractor={(item) => item.id.toString()}
        style={{ flex: 1 }}
      />
    </View>
  );
}
