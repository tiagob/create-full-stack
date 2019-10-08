import React, { useState } from "react";
import { TextField } from "@material-ui/core";
import {
  CreateTodoComponent,
  TodosQuery,
  TodosDocument,
  TodosQueryVariables
} from "../generated/graphql";

export default function CreateTodo() {
  const [name, setName] = useState("");

  return (
    <CreateTodoComponent
      update={(cache, { data }) => {
        if (!data || !data.insert_todos) {
          return;
        }
        const createTodo = data.insert_todos.returning;
        const query = cache.readQuery<TodosQuery, TodosQueryVariables>({
          query: TodosDocument
        });
        if (query) {
          const { todos } = query;
          cache.writeQuery<TodosQuery, TodosQueryVariables>({
            query: TodosDocument,
            data: { todos: todos.concat(createTodo) }
          });
        }
      }}
    >
      {createTodo => (
        <TextField
          id="outlined-full-width"
          label="Todo"
          placeholder="What needs to be done?"
          fullWidth
          variant="outlined"
          value={name}
          onChange={event => setName(event.target.value)}
          onKeyPress={event => {
            if (event.key === "Enter") {
              createTodo({ variables: { name } }).then(() => setName(""));
            }
          }}
        />
      )}
    </CreateTodoComponent>
  );
}
