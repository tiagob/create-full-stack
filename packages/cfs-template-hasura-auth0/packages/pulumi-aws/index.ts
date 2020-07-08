import * as pulumi from "@pulumi/pulumi";
import * as fs from "fs";

import createAuth0 from "./src/createAuth0";
import createFargate from "./src/createFargate";
import createRds from "./src/createRds";
import createStaticWebsite from "./src/createStaticWebsite";

// Import our Pulumi configuration.
const config = new pulumi.Config();

async function run() {
  const { connectionString, cluster } = createRds(config);
  const { graphqlUrl } = await createFargate(
    config,
    connectionString,
    cluster,
    "hasura",
    "hasura"
  );

  const webUrl = `http://${config.require("targetDomain")}`;
  const { webClient, mobileClient } = createAuth0(webUrl, graphqlUrl);

  const {
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

  return {
    graphqlUrl,
    webUrl,
    contentBucketUri,
    contentBucketWebsiteEndpoint,
    cloudFrontDomain,
  };
}

// Export pattern from
// https://github.com/pulumi/pulumi/issues/2910#issuecomment-511932533
const runResult = run();
export const graphqlUrl = runResult.then((r) => r.graphqlUrl);
export const webUrl = runResult.then((r) => r.webUrl);
export const contentBucketUri = runResult.then((r) => r.contentBucketUri);
export const contentBucketWebsiteEndpoint = runResult.then(
  (r) => r.contentBucketWebsiteEndpoint
);
export const cloudFrontDomain = runResult.then((r) => r.cloudFrontDomain);
