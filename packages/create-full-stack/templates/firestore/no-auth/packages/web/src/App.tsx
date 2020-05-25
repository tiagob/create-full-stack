import { makeStyles } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Header from "./components/Header";
import About from "./containers/About";
import Todos from "./containers/Todos";

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: grey[200],
  },
});

export default function App() {
  const classes = useStyles();
  return (
    <Router>
      <div className={classes.root}>
        <Header />
        <Switch>
          <Route exact path="/" component={Todos} />
          <Route path="/about" component={About} />
        </Switch>
      </div>
    </Router>
  );
}
