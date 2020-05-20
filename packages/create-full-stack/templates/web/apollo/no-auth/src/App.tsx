import { ApolloProvider } from "@apollo/react-hooks";
import { makeStyles } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import ApolloClient from "apollo-boost";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Header from "./components/Header";
import About from "./containers/About";
import Todos from "./containers/Todos";

export const client = new ApolloClient({
  uri: "http://localhost:4000",
});

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
    <ApolloProvider client={client}>
      <Router>
        <div className={classes.root}>
          <Header />
          <Switch>
            <Route exact path="/" component={Todos} />
            <Route path="/about" component={About} />
          </Switch>
        </div>
      </Router>
    </ApolloProvider>
  );
}
