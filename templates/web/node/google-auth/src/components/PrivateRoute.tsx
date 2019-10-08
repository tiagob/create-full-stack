import React, { ComponentType } from "react";
import { Route, Redirect, RouteProps } from "react-router";
import { Page } from "../constants";

interface Props extends RouteProps {
  component: ComponentType<RouteProps>;
  token: string | null;
}

export default function PrivateRoute({
  component: Component,
  token,
  ...rest
}: Props) {
  return (
    <Route
      {...rest}
      render={props =>
        token ? (
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
