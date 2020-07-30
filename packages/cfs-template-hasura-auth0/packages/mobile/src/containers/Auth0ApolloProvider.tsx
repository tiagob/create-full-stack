import { ApolloProvider } from "@apollo/react-hooks";
import React, { ReactNode } from "react";

import getApolloClient from "../utils/getApolloClient";
import { useAuth0 } from "../utils/reactNativeAuth0";

interface Props {
  children: ReactNode;
}

export default function Auth0ApolloProvider({ children }: Props) {
  const { token } = useAuth0();
  const apolloClient = getApolloClient(token);

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
