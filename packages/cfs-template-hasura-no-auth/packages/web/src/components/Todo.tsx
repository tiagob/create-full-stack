import {
  Checkbox,
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  Todos as TodoType,
  useDeleteTodo,
  useUpdateTodoMutation,
} from "common";
import React from "react";

const useStyles = makeStyles({
  complete: {
    textDecoration: "line-through",
  },
});

interface Props {
  todo: TodoType;
}

export default function Todo({ todo }: Props) {
  const classes = useStyles();
  const [updateTodo] = useUpdateTodoMutation();
  const [deleteTodo] = useDeleteTodo();

  return (
    <ListItem
      key={todo.id}
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
          onClick={() => deleteTodo({ variables: { id: todo.id } })}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
