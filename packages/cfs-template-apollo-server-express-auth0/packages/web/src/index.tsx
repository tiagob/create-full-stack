import "./index.css";

import { Auth0Provider } from "@auth0/auth0-react";
import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import * as serviceWorker from "./serviceWorker";

if (!process.env.REACT_APP_AUTH0_CLIENT_ID) {
  throw new Error(
    "`REACT_APP_AUTH0_CLIENT_ID` is required. See development.html or DEVELOPMENT.md. Changes to `.env` files requires a restart."
  );
}
if (!process.env.REACT_APP_AUTH0_DOMAIN) {
  throw new Error(
    "`REACT_APP_AUTH0_DOMAIN` is required. See development.html or DEVELOPMENT.md. Changes to `.env` files requires a restart."
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      redirectUri={window.location.origin}
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
