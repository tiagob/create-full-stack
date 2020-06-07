import { List, makeStyles, Paper } from "@material-ui/core";
import { useTodosQuery } from "common";
import React from "react";

import CreateTodo from "../components/CreateTodo";
import Todo from "../components/Todo";

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    margin: spacing(3),
    padding: spacing(1),
    width: "80%",
  },
}));

export default function Todos() {
  const classes = useStyles();
  const { data } = useTodosQuery();
  return (
    <Paper className={classes.root}>
      <CreateTodo />
      <List>
        {(data?.todos ? data.todos : []).map((todo) => (
          <Todo todo={todo} key={todo.id} />
        ))}
      </List>
    </Paper>
  );
}
