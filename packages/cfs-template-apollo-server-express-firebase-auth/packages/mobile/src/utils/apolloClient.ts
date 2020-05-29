import { ApolloClient, InMemoryCache } from "apollo-boost";
import { setContext } from "apollo-link-context";
import { createHttpLink } from "apollo-link-http";
import Constants from "expo-constants";

import firebase from "./firebase";

const { manifest } = Constants;
const uri =
  manifest.debuggerHost && manifest.debuggerHost.includes(":")
    ? `http://${manifest.debuggerHost.split(`:`)[0].concat(`:4000`)}/graphql`
    : undefined;

const httpLink = createHttpLink({ uri });

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const user = firebase.auth().currentUser;
  if (!user) {
    return headers;
  }
  const token = await user.getIdToken();
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export default new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
