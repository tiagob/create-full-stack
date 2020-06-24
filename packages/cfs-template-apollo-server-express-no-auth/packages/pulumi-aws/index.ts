import * as pulumi from "@pulumi/pulumi";

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

export const {
  contentBucketUri,
  contentBucketWebsiteEndpoint,
  cloudFrontDomain,
  targetDomainEndpoint,
} = createStaticWebsite(config, graphqlUrl);
