import "./index.css";

import { RedirectLoginResult } from "@auth0/auth0-spa-js";
import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import * as serviceWorker from "./serviceWorker";
import history from "./utils/history";
import { Auth0Provider } from "./utils/reactAuth0Spa";

interface AppState extends RedirectLoginResult {
  targetUrl?: string;
}

// A function that routes the user to the right place
// after login
const onRedirectCallback = (appState: AppState) => {
  history.push(
    appState?.targetUrl ? appState.targetUrl : window.location.pathname
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN!}
      client_id={process.env.REACT_APP_AUTH0_CLIENT_ID!}
      redirect_uri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
      audience={process.env.REACT_APP_AUTH0_AUDIENCE}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
  document.querySelector("#root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
