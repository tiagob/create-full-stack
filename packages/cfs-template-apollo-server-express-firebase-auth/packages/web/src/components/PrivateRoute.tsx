import React, { ComponentType } from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";

import firebase from "../utils/firebase";

interface Props extends RouteProps {
  component: ComponentType<RouteProps>;
}

export default function PrivateRoute({ component: Component, ...rest }: Props) {
  return (
    <Route
      {...rest}
      render={(props) =>
        firebase.auth().currentUser ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/sign-in",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
}
