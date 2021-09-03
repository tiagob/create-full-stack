import { IconButton, InputAdornment, TextField } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { useCreateTodo } from "common";
import React, { useCallback, useState } from "react";

export default function CreateTodo() {
  const [name, setName] = useState("");
  const [createTodo, { loading }] = useCreateTodo();

  const onSubmit = useCallback(() => {
    createTodo({ variables: { name } });
    setName("");
  }, [name, setName, createTodo]);

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
          onSubmit();
        }
      }}
      disabled={loading}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton aria-label="add" onClick={onSubmit} disabled={loading}>
              <AddIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
