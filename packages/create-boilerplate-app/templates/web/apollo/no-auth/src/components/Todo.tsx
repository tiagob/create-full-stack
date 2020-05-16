import React from "react";
import {
  ListItem,
  Checkbox,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { Todo as TodoType } from "common";
import { makeStyles } from "@material-ui/styles";
import { useUpdateTodoMutation, useDestroyTodoMutation } from "common";

const useStyles = makeStyles({
  complete: {
    textDecoration: "line-through"
  }
});

interface Props {
  todo: TodoType;
}

export default function Todo({ todo }: Props) {
  const classes = useStyles();
  const [updateTodo] = useUpdateTodoMutation();
  const [destroyTodo] = useDestroyTodoMutation();

  return (
    <ListItem
      key={todo.id}
      role={undefined}
      dense
      button
      onClick={() =>
        updateTodo({ variables: { id: todo.id, complete: !todo.complete } })
      }
    >
      <Checkbox checked={todo.complete} tabIndex={-1} disableRipple />
      <ListItemText
        primary={todo.name}
        classes={todo.complete ? { primary: classes.complete } : undefined}
      />
      <ListItemSecondaryAction>
        <IconButton
          aria-label="Delete"
          onClick={() => destroyTodo({ variables: { id: todo.id } })}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
