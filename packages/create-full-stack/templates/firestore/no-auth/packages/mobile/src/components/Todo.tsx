import React from "react";
import { Button, CheckBox, Icon, ListItem } from "react-native-elements";

import { getTodosCollection } from "../utils/firebase";
import { TodoType } from "../utils/types";

interface Props {
  todo: TodoType;
}

export default function Todo({ todo }: Props) {
  return (
    <ListItem
      leftElement={
        <CheckBox
          onPress={() =>
            getTodosCollection().doc(todo.id).update({
              complete: !todo.complete,
            })
          }
          checked={todo.complete}
        />
      }
      title={todo.name}
      titleStyle={
        todo.complete && {
          textDecorationLine: "line-through",
        }
      }
      rightElement={
        <Button
          icon={
            <Icon
              name="delete"
              onPress={() => getTodosCollection().doc(todo.id).delete()}
            />
          }
          type="outline"
          raised
        />
      }
    />
  );
}
