import { ApolloClient, InMemoryCache } from "@apollo/client";
import Constants from "expo-constants";

const { manifest } = Constants;
const uri =
  manifest.debuggerHost && manifest.packagerOpts?.dev
    ? `http://${manifest.debuggerHost.split(`:`)[0].concat(`:8080`)}/v1/graphql`
    : process.env.GRAPHQL_URL;

export default new ApolloClient({
  uri,
  cache: new InMemoryCache(),
});
