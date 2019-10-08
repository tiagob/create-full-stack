import React from "react";
import {
  Todo as TodoType,
  UpdateTodoComponent,
  TodosQuery,
  TodosQueryVariables,
  TodosDocument,
  DestroyTodoComponent
} from "../generated/graphql";
import {
  Left,
  Text,
  Right,
  ListItem,
  Button,
  Icon,
  CheckBox
} from "native-base";
import { useUpdateTodoMutation, useDestroyTodoMutation } from "common";

interface Props {
  todo: TodoType;
}

export default function Todo({ todo }: Props) {
  const [updateTodo] = useUpdateTodoMutation();
  const [destroyTodo] = useDestroyTodoMutation();

  return (
    <ListItem>
      <Left>
        <CheckBox
          onPress={() =>
            updateTodo({
              variables: { id: todo.id, complete: !todo.complete }
            })
          }
          checked={todo.complete}
          style={{ marginRight: 40 }}
        />
        <Text
          style={
            todo.complete
              ? {
                  textDecorationLine: "line-through"
                }
              : undefined
          }
        >
          {todo.name}
        </Text>
      </Left>
      <Right>
        <Button onPress={() => destroyTodo({ variables: { id: todo.id } })}>
          <Icon active name="trash" />
        </Button>
      </Right>
    </ListItem>
  );
}
