import React, { useState } from "react";
import { View } from "react-native";
import { Icon, Input } from "react-native-elements";

import useCreateTodo from "../graphql/useCreateTodo";

export default function CreateTodo() {
  const [name, setName] = useState("");
  const [createTodo] = useCreateTodo();

  async function onSubmit() {
    await createTodo({ variables: { name } });
    setName("");
  }

  return (
    <View
      style={{
        flexDirection: "row",
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
      }}
    >
      <Input
        placeholder="What needs to be done?"
        value={name}
        onChangeText={(text: string) => setName(text)}
        onSubmitEditing={onSubmit}
        rightIcon={<Icon name="send" onPress={onSubmit} />}
      />
    </View>
  );
}
