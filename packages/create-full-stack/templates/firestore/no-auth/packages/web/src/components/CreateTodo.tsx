import { TextField } from "@material-ui/core";
import React, { useState } from "react";

import { getTodosCollection } from "../utils/firebase";

export default function CreateTodo() {
  const [name, setName] = useState("");

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
          await getTodosCollection().doc().set({
            name,
            complete: false,
          });
          setName("");
        }
      }}
    />
  );
}
