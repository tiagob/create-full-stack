import { ApolloClient, InMemoryCache } from "apollo-boost";
import { setContext } from "apollo-link-context";
import { createHttpLink } from "apollo-link-http";

const uri = "http://localhost:8080/v1/graphql";

const httpLink = createHttpLink({ uri });

export default function getApolloClient(token: string | undefined) {
  const authLink = setContext(async (_, { headers }) => {
    if (!token) {
      return { headers };
    }
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
}
