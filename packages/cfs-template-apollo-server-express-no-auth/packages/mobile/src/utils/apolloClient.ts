import ApolloClient from "apollo-boost";
import Constants from "expo-constants";

const { manifest } = Constants;
const uri =
  manifest.debuggerHost && manifest.packagerOpts?.dev
    ? `http://${manifest.debuggerHost.split(`:`)[0].concat(`:8080`)}/graphql`
    : process.env.GRAPHQL_URL;

export default new ApolloClient({
  uri,
});
