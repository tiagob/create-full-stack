import "./index.css";

import { Auth0Provider } from "@auth0/auth0-react";
import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
