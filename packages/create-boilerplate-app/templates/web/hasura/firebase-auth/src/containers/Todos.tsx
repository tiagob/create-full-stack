import React from "react";
import { List, Paper, Theme, makeStyles } from "@material-ui/core";
import Todo from "../components/Todo";
import { TodosComponent } from "../generated/graphql";
import CreateTodo from "../components/CreateTodo";

const useStyles = makeStyles(({ spacing }: Theme) => ({
  root: {
    padding: spacing(1),
    width: "80%"
  }
}));

export default function Todos() {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <CreateTodo />
      <TodosComponent>
        {({ data }) => (
          <List>
            {(data && data.todos ? data.todos : []).map((todo, index) => (
              <Todo todo={todo} key={index} />
            ))}
          </List>
        )}
      </TodosComponent>
    </Paper>
  );
}
