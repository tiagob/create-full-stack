import { ApolloProvider } from "@apollo/react-hooks";
import { makeStyles } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import About from "./containers/About";
import SignIn from "./containers/SignIn";
import Todos from "./containers/Todos";
import apolloClient from "./utils/apolloClient";

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
    <ApolloProvider client={apolloClient}>
      <Router>
        <div className={classes.root}>
          <Header />
          <Switch>
            <PrivateRoute exact path="/" component={Todos} />
            <Route path="/sign-in" component={SignIn} />
            <Route path="/about" component={About} />
          </Switch>
        </div>
      </Router>
    </ApolloProvider>
  );
}
