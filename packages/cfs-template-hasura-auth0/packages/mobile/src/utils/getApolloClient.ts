import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import Constants from "expo-constants";

const { manifest } = Constants;
const uri =
  manifest.debuggerHost && manifest.packagerOpts?.dev
    ? `http://${manifest.debuggerHost.split(`:`)[0]}:8080/v1/graphql`
    : process.env.GRAPHQL_URL;

const httpLink = createHttpLink({ uri });

export default function getApolloClient(accessToken: string | undefined) {
  const authLink = setContext(async (_, { headers }) => {
    if (!accessToken) {
      return { headers };
    }
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${accessToken}`,
      },
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
}
