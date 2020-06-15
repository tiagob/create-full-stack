import React, { Component, useEffect } from "react";
import { Route, RouteComponentProps, RouteProps } from "react-router-dom";

import { useAuth0 } from "../utils/reactAuth0Spa";

const PrivateRoute = ({ component, path, ...rest }: RouteProps) => {
  const {
    token,
    loading,
    isAuthenticated,
    loginWithRedirect,
    getTokenSilently,
  } = useAuth0();

  useEffect(() => {
    const fn = async () => {
      if (loading || isAuthenticated) {
        return;
      }

      await loginWithRedirect?.({
        redirect_uri: "",
        appState: { targetUrl: path },
      });
    };
    fn();
  }, [loading, isAuthenticated, loginWithRedirect, path, getTokenSilently]);

  // Wait for the token to render
  if (!token) {
    // eslint-disable-next-line unicorn/no-null
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
