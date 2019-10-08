import React, { useEffect, useState } from "react";
import { List, Paper, Theme, makeStyles } from "@material-ui/core";
import Todo from "../components/Todo";
import CreateTodo from "../components/CreateTodo";
import { getTodosCollection } from "../utils/firebase";
import { TodoType } from "../constants";

const useStyles = makeStyles(({ spacing }: Theme) => ({
  root: {
    padding: spacing(1),
    width: "80%"
  }
}));

export default function Todos() {
  const classes = useStyles();

  const [todos, setTodos] = useState<TodoType[]>([]);
  useEffect(() => {
    const unsubscribe = getTodosCollection().onSnapshot(querySnapshot => {
      const firestoreTodos: TodoType[] = [];
      querySnapshot.forEach(doc => {
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
        {todos.map((todo, index) => (
          <Todo todo={todo} key={index} />
        ))}
      </List>
    </Paper>
  );
}
