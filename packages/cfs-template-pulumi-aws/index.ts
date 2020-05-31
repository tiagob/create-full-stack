import * as pulumi from "@pulumi/pulumi";

import createFargate from "./src/createFargate";
import createStaticWebsite from "./src/createStaticWebsite";

const fargate = createFargate();
export const { url } = fargate;

// Load the Pulumi program configuration. These act as the "parameters" to the Pulumi program,
// so that different Pulumi Stacks can be brought up using the same code.

const stackConfig = new pulumi.Config("static-website");
const config = {
  // pathToWebsiteContents is a relativepath to the website's contents.
  pathToWebsiteContents: stackConfig.require("pathToWebsiteContents"),
  // targetDomain is the domain/host to serve content at.
  // targetDomain: stackConfig.require("targetDomain"),
  // (Optional) ACM certificate ARN for the target domain; must be in the us-east-1 region. If omitted, an ACM certificate will be created.
  // certificateArn: stackConfig.get("certificateArn"),
};
const staticWebsite = createStaticWebsite(config);

export const { contentBucketUri } = staticWebsite;
export const { contentBucketWebsiteEndpoint } = staticWebsite;
