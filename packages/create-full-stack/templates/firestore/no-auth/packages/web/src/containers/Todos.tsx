import { List, makeStyles, Paper } from "@material-ui/core";
import React, { useEffect, useState } from "react";

import CreateTodo from "../components/CreateTodo";
import Todo from "../components/Todo";
import { getTodosCollection } from "../utils/firebase";
import { TodoType } from "../utils/types";

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    margin: spacing(3),
    padding: spacing(1),
    width: "80%",
  },
}));

export default function Todos() {
  const classes = useStyles();

  const [todos, setTodos] = useState<TodoType[]>([]);
  useEffect(() => {
    const unsubscribe = getTodosCollection().onSnapshot((querySnapshot) => {
      const firestoreTodos: TodoType[] = [];
      querySnapshot.forEach((doc) => {
        firestoreTodos.push({ id: doc.id, ...(doc.data() as TodoType) });
      });
      setTodos(firestoreTodos);
    });
    return unsubscribe;
  }, []);

  return (
    <Paper className={classes.root}>
      <CreateTodo />
      <List>
        {todos.map((todo) => (
          <Todo todo={todo} key={todo.id} />
        ))}
      </List>
    </Paper>
  );
}
