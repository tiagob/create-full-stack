import React, { useEffect, useState } from "react";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import Todos from "./containers/Todos";
import Header from "./components/Header";
import { Page } from "./constants";
import About from "./containers/About";
import PrivateRoute from "./components/PrivateRoute";
import SignIn from "./containers/SignIn";
import { client } from "./utils/apolloClient";

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
  let [accessToken, setAccessToken] = useState<string | null>(null);
  let [expiresIn, setExpiresIn] = useState<string | null>(null);
  const params = new URLSearchParams(document.location.hash.substring(1));
  accessToken = params.get("access_token") || accessToken;
  expiresIn = params.get("expires_in") || expiresIn;
  document.location.hash = "";
  useEffect(() => {
    setAccessToken(accessToken);
    setExpiresIn(expiresIn);
    let timeoutID: undefined | number;
    if (expiresIn) {
      timeoutID = (setTimeout(
        () => setAccessToken(null),
        // Seconds to milliseconds
        Number(expiresIn) * 1000
      ) as unknown) as number;
    }
    return () => clearTimeout(timeoutID);
  }, [accessToken, expiresIn]);
  return (
    <ApolloProvider client={client(accessToken)}>
      <Router>
        <div className={classes.root}>
          <Header />
          <PrivateRoute exact path="/" component={Todos} token={accessToken} />
          <Route path={`/${Page.signIn}`} component={SignIn} />
          <Route path={`/${Page.about}`} component={About} />
        </div>
      </Router>
    </ApolloProvider>
  );
}
