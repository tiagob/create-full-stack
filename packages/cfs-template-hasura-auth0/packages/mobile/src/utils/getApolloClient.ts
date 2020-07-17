import { ApolloClient, InMemoryCache } from "apollo-boost";
import { setContext } from "apollo-link-context";
import { createHttpLink } from "apollo-link-http";
import Constants from "expo-constants";

const { manifest } = Constants;
const uri =
  manifest.debuggerHost && manifest.packagerOpts?.dev
    ? `http://${manifest.debuggerHost.split(`:`)[0].concat(`:8080`)}/v1/graphql`
    : manifest.extra.graphqlUrl;

const httpLink = createHttpLink({ uri });

export default function getApolloClient(token: string | undefined) {
  const authLink = setContext(async (_, { headers }) => {
    // get the authentication token from local storage if it exists
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
