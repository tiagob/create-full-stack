import React from "react";
import {
  ListItem,
  Checkbox,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  Todos,
  UpdateTodoComponent,
  TodosQuery,
  TodosQueryVariables,
  TodosDocument,
  DestroyTodoComponent
} from "../generated/graphql";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  complete: {
    textDecoration: "line-through"
  }
});

interface Props {
  todo: Todos;
}

export default function Todo({ todo }: Props) {
  const classes = useStyles();
  return (
    <UpdateTodoComponent
      update={(cache, { data }) => {
        if (!data || !data.update_todos) {
          return;
        }
        const updateTodo = data.update_todos.returning[0];
        const query = cache.readQuery<TodosQuery, TodosQueryVariables>({
          query: TodosDocument
        });
        if (query) {
          const { todos } = query;
          cache.writeQuery<TodosQuery, TodosQueryVariables>({
            query: TodosDocument,
            data: {
              todos: todos.map(todo =>
                todo.id === updateTodo.id ? updateTodo : todo
              )
            }
          });
        }
      }}
    >
      {updateTodo => (
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
            <DestroyTodoComponent
              update={(cache, { data }) => {
                if (!data || !data.delete_todos) {
                  return;
                }
                const destroyTodo = data.delete_todos.returning[0];
                const query = cache.readQuery<TodosQuery, TodosQueryVariables>({
                  query: TodosDocument
                });
                if (query) {
                  const { todos } = query;
                  cache.writeQuery<TodosQuery, TodosQueryVariables>({
                    query: TodosDocument,
                    data: {
                      todos: todos.filter(todo => todo.id !== destroyTodo.id)
                    }
                  });
                }
              }}
            >
              {destroyTodo => (
                <IconButton
                  aria-label="Delete"
                  onClick={() => destroyTodo({ variables: { id: todo.id } })}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </DestroyTodoComponent>
          </ListItemSecondaryAction>
        </ListItem>
      )}
    </UpdateTodoComponent>
  );
}
