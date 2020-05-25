import {
  Checkbox,
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";

import { getTodosCollection } from "../utils/firebase";
import { TodoType } from "../utils/types";

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
  return (
    <ListItem
      key={todo.id}
      role={undefined}
      dense
      button
      onClick={() =>
        getTodosCollection().doc(todo.id).update({
          complete: !todo.complete,
        })
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
          onClick={() => getTodosCollection().doc(todo.id).delete()}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
