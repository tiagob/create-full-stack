import { createHttpLink } from "apollo-link-http";
import { ApolloClient, InMemoryCache } from "apollo-boost";
import { setContext } from "apollo-link-context";

const uri = "http://localhost:4000/graphql";

const httpLink = createHttpLink({ uri });

const authLink = (token: string | null) =>
  setContext((_, { headers }) => {
    if (!token) {
      return headers;
    }
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ""
      }
    };
  });

export const client = (token: string | null) =>
  new ApolloClient({
    link: authLink(token).concat(httpLink),
    cache: new InMemoryCache()
  });
