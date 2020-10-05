import { useAuth0 } from "@auth0/auth0-react";
import React, { Component, useEffect } from "react";
import { Route, RouteComponentProps, RouteProps } from "react-router-dom";

const PrivateRoute = ({ component, path, ...rest }: RouteProps) => {
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    const fn = async () => {
      if (isLoading || isAuthenticated) {
        return;
      }

      await loginWithRedirect?.({
        redirect_uri: "",
        appState: { targetUrl: path },
      });
    };
    fn();
  }, [isLoading, isAuthenticated, loginWithRedirect, path]);

  // Wait for the token to render
  if (isLoading || !isAuthenticated) {
    return null;
  }

  if (component) {
    return <Route path={path} component={component} {...rest} />;
  }

  return (
    <Route
      path={path}
      render={(props: RouteComponentProps) => <Component {...props} />}
      {...rest}
    />
  );
};

export default PrivateRoute;
