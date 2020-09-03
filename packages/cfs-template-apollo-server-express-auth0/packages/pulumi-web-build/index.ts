import * as pulumi from "@pulumi/pulumi";
import { buildWeb } from "cfs-pulumi";

const webPath = "../web";

const stack = pulumi.getStack();
const config = new pulumi.Config();
const auth0Stack = new pulumi.StackReference(
  `${config.require("organization")}/cfs-auth0/${stack}`
);
const serverStack = new pulumi.StackReference(
  `${config.require("organization")}/cfs-server/${stack}`
);

// Can't be included in pulumi-web because pulumi-web must know all the files in advance
buildWeb(webPath, {
  REACT_APP_GRAPHQL_URL: serverStack.getOutput("graphqlUrl"),
  REACT_APP_AUTH0_CLIENT_ID: auth0Stack.getOutput("webClientId"),
  REACT_APP_AUTH0_AUDIENCE: auth0Stack.getOutput("audience"),
  REACT_APP_AUTH0_DOMAIN: auth0Stack.getOutput("domain"),
});
