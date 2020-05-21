import { Button, makeStyles } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";

import firebase, { provider } from "../utils/firebase";

const useStyles = makeStyles({
  root: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default function SignIn() {
  const classes = useStyles();
  const history = useHistory();
  return (
    <div className={classes.root}>
      <Button
        variant="contained"
        color="primary"
        onClick={async () => {
          const result = await firebase.auth().signInWithPopup(provider);
          if (result.credential) {
            history.push("/");
          }
        }}
      >
        Sign in with Google
      </Button>
    </div>
  );
}
