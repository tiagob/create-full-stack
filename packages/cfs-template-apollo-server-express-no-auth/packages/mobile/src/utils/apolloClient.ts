import ApolloClient from "apollo-boost";
import Constants from "expo-constants";

const { manifest } = Constants;
const uri =
  manifest.debuggerHost && manifest.debuggerHost.includes(":")
    ? `http://${manifest.debuggerHost.split(`:`)[0].concat(`:4000`)}/graphql`
    : undefined;

export default new ApolloClient({
  uri,
});
