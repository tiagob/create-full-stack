import { ApolloProvider } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import { makeStyles } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import About from "./containers/About";
import Todos from "./containers/Todos";
import getApolloClient from "./utils/getApolloClient";

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
  const { getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState<string | undefined>();

  useEffect(() => {
    (async () => {
      setToken(await getAccessTokenSilently());
    })();
  }, [getAccessTokenSilently]);

  const apolloClient = getApolloClient(token);

  return (
    <ApolloProvider client={apolloClient}>
      <Router>
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
