import React from "react";
import { Button, CheckBox, Icon, ListItem } from "react-native-elements";

import { Todo as TodoType } from "../graphql/__generated__";
import useDestroyTodo from "../graphql/useDestroyTodo";
import useUpdateTodo from "../graphql/useUpdateTodo";

interface Props {
  todo: TodoType;
}

export default function Todo({ todo }: Props) {
  const [updateTodo] = useUpdateTodo();
  const [destroyTodo] = useDestroyTodo();

  return (
    <ListItem
      leftElement={
        <CheckBox
          onPress={() =>
            updateTodo({
              variables: { id: todo.id, complete: !todo.complete },
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
              onPress={() => destroyTodo({ variables: { id: todo.id } })}
            />
          }
          type="outline"
          raised
        />
      }
    />
  );
}
