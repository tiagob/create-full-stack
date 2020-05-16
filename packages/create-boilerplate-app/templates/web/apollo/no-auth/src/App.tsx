import React from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo-hooks";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import Todos from "./containers/Todos";
import Header from "./components/Header";
import { Page } from "./constants";
import About from "./containers/About";

export const client = new ApolloClient({
  uri: "http://localhost:4000"
});

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: grey[200]
  }
});

export default function App() {
  const classes = useStyles();
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className={classes.root}>
          <Header />
          <Route exact path="/" component={Todos} />
          <Route path={`/${Page.about}`} component={About} />
        </div>
      </Router>
    </ApolloProvider>
  );
}
