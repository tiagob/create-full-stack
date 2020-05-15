import { createHttpLink } from "apollo-link-http";
import { ApolloClient, InMemoryCache } from "apollo-boost";
import { setContext } from "apollo-link-context";
import firebase from "../utils/firebase";

const uri = "http://localhost:4000/graphql";

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
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});
