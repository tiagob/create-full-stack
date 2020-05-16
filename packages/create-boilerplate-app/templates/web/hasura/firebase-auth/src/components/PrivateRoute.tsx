import React, { ComponentType } from "react";
import { Route, Redirect, RouteProps } from "react-router";
import firebase from "../utils/firebase";
import { Page } from "../constants";

interface Props extends RouteProps {
  component: ComponentType<RouteProps>;
}

export default function PrivateRoute({ component: Component, ...rest }: Props) {
  return (
    <Route
      {...rest}
      render={props =>
        firebase.auth().currentUser ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: `/${Page.signIn}`,
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}
