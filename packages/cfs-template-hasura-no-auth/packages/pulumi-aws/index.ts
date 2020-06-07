import * as pulumi from "@pulumi/pulumi";

import createFargate from "./src/createFargate";
import createRds from "./src/createRds";
import createStaticWebsite from "./src/createStaticWebsite";

// Import our Pulumi configuration.
const config = new pulumi.Config();

const { connectionString, cluster } = createRds(config);
const fargate = createFargate(config, connectionString, cluster);
export const { graphqlUrl } = fargate;

export const {
  contentBucketUri,
  contentBucketWebsiteEndpoint,
  cloudFrontDomain,
  targetDomainEndpoint,
} = createStaticWebsite(config, graphqlUrl);
