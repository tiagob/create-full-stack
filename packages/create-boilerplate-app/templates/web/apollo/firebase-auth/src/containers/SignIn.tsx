import React from "react";
import { makeStyles, Button } from "@material-ui/core";
import firebase, { provider } from "../utils/firebase";
import useReactRouter from "use-react-router";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default function SignIn() {
  const classes = useStyles();
  const { history } = useReactRouter();
  return (
    <div className={classes.root}>
      <Button
        variant="contained"
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
