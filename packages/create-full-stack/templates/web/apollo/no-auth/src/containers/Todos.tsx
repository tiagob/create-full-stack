import React from "react";
import { List, Paper, Theme, makeStyles } from "@material-ui/core";
import Todo from "../components/Todo";
import CreateTodo from "../components/CreateTodo";
import { useTodosQuery } from "common";

const useStyles = makeStyles(({ spacing }: Theme) => ({
  root: {
    padding: spacing(1),
    width: "80%"
  }
}));

export default function Todos() {
  const classes = useStyles();
  const { data } = useTodosQuery();
  return (
    <Paper className={classes.root}>
      <CreateTodo />
      <List>
        {(data && data.todos ? data.todos : []).map((todo, index) => (
          <Todo todo={todo} key={index} />
        ))}
      </List>
    </Paper>
  );
}
