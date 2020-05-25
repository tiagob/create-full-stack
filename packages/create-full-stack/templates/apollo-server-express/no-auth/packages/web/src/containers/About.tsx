import { Button, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles({
  root: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default function About() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Button
        href="https://github.com/tiagob/create-full-stack"
        variant="contained"
        color="primary"
        target="_blank"
      >
        GO TO GITHUB
      </Button>
    </div>
  );
}
