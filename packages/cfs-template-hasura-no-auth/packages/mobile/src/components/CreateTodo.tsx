import { useCreateTodo } from "common";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Icon, Input } from "react-native-elements";

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
  },
});

export default function CreateTodo() {
  const [name, setName] = useState("");
  const [createTodo] = useCreateTodo();

  function onSubmit() {
    createTodo({ variables: { name } });
    setName("");
  }

  return (
    <View style={styles.root}>
      <Input
        placeholder="What needs to be done?"
        value={name}
        onChangeText={(text: string) => setName(text)}
        onSubmitEditing={onSubmit}
        rightIcon={
          <Icon name="add" accessibilityLabel="submit" onPress={onSubmit} />
        }
      />
    </View>
  );
}
