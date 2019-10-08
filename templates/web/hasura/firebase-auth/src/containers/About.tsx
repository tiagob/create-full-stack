import React from "react";
import Typography from "@material-ui/core/Typography";
import { Link, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default function About() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography variant="h6" gutterBottom>
        github
      </Typography>
      <Link
        href="https://github.com/tiagob/ts-react-apollo-node"
        target="_blank"
      >
        https://github.com/tiagob/ts-react-apollo-node
      </Link>
    </div>
  );
}
