import { ApolloProvider } from "@apollo/client";
import { makeStyles } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import React from "react";
import { Route, Router, Switch } from "react-router-dom";

import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import About from "./containers/About";
import Todos from "./containers/Todos";
import getApolloClient from "./utils/getApolloClient";
import history from "./utils/history";
import { useAuth0 } from "./utils/reactAuth0Spa";

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
  const { token } = useAuth0();

  const apolloClient = getApolloClient(token);

  return (
    <ApolloProvider client={apolloClient}>
      <Router history={history}>
        <div className={classes.root}>
          <Header />
          <Switch>
            <PrivateRoute exact path="/" component={Todos} />
            <Route path="/about" component={About} />
          </Switch>
        </div>
      </Router>
    </ApolloProvider>
  );
}
