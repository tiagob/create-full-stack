import { TextField } from "@material-ui/core";
import { useCreateTodo } from "common";
import React, { useState } from "react";

export default function CreateTodo() {
  const [name, setName] = useState("");
  const [createTodo] = useCreateTodo();

  return (
    <TextField
      id="outlined-full-width"
      label="Todo"
      placeholder="What needs to be done?"
      fullWidth
      variant="outlined"
      value={name}
      onChange={(event) => setName(event.target.value)}
      onKeyPress={async (event) => {
        if (event.key === "Enter") {
          await createTodo({ variables: { name } });
          setName("");
        }
      }}
    />
  );
}
