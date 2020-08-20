import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { makeStyles } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import About from "./containers/About";
import Todos from "./containers/Todos";

export const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URL,
  cache: new InMemoryCache(),
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <ApolloProvider client={client}>
      <Router>
        <div className={classes.root}>
          <Header openDrawer={() => setIsDrawerOpen(true)} />
          <Sidebar
            isDrawerOpen={isDrawerOpen}
            closeDrawer={() => setIsDrawerOpen(false)}
          />
          <Switch>
            <Route exact path="/" component={Todos} />
            <Route path="/about" component={About} />
          </Switch>
        </div>
      </Router>
    </ApolloProvider>
  );
}
