import ApolloClient from "apollo-boost";
import Constants from "expo-constants";

const { manifest } = Constants;
const uri = `http://${manifest.debuggerHost
  .split(`:`)
  .shift()
  .concat(`:4000`)}`;

export const client = new ApolloClient({
  uri
});
