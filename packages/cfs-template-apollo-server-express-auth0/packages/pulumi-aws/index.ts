import * as pulumi from "@pulumi/pulumi";
import * as fs from "fs";

import createAuth0 from "./src/createAuth0";
import createFargate from "./src/createFargate";
import createRds from "./src/createRds";
import createStaticWebsite from "./src/createStaticWebsite";

// Import our Pulumi configuration.
const config = new pulumi.Config();

const { connectionString, cluster } = createRds(config);
export const { graphqlUrl } = createFargate(
  config,
  connectionString,
  cluster,
  "apollo-server-express",
  "apollo-server-express"
);

export const webUrl = `https://${config.require("targetDomain")}`;
const { webClient, mobileClient } = createAuth0(webUrl, graphqlUrl);

export const {
  contentBucketUri,
  contentBucketWebsiteEndpoint,
  cloudFrontDomain,
} = createStaticWebsite(config, graphqlUrl, webClient);

// TODO: Set REACT_APP_AUTH0_DOMAIN from CLI
// TODO: Same API for production and development?
mobileClient.clientId.apply((clientId) => {
  fs.writeFileSync(
    "../mobile/.env",
    `AUTH0_AUDIENCE=${graphqlUrl}\nAUTH0_DOMAIN=create-full-stack.auth0.com\nAUTH0_CLIENT_ID=${clientId}\n`
  );
});
