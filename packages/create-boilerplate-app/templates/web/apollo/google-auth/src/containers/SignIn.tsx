import React from "react";
import { makeStyles, Button } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  }
});

const redirectUri = "http://localhost:3000";
// Google's OAuth 2.0 endpoint for requesting an access token
const oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";
// Parameters to pass to OAuth 2.0 endpoint.
const oauth2Params = {
  client_id: process.env.REACT_APP_OAUTH2_CLIENT_ID as string,
  redirect_uri: redirectUri,
  response_type: "token",
  scope: "email",
  include_granted_scopes: "true",
  state: "pass-through value"
};

export default function SignIn() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Button
        variant="contained"
        onClick={async () => {
          const params = new URLSearchParams("");
          for (const [key, value] of Object.entries(oauth2Params)) {
            params.append(key, value);
          }
          window.location.assign(`${oauth2Endpoint}?${params.toString()}`);
        }}
      >
        Sign In with Google
      </Button>
    </div>
  );
}
