import React, { useState } from "react";
import { Item, Input } from "native-base";
import { useCreateTodoMutation } from "common";

const styles = {
  root: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10
  }
};

export default function CreateTodo() {
  const [name, setName] = useState("");
  const [createTodo] = useCreateTodoMutation();

  return (
    <Item rounded style={styles.root}>
      <Input
        placeholder="What needs to be done?"
        value={name}
        onChangeText={text => setName(text)}
        onSubmitEditing={() => {
          createTodo({ variables: { name } }).then(() => setName(""));
        }}
      />
    </Item>
  );
}
