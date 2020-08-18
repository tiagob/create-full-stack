import * as pulumi from "@pulumi/pulumi";
import path from "path";

import Certificate from "./src/components/certificate";
import Fargate from "./src/components/fargate";
import Rds from "./src/components/rds";
// @remove-web-begin
import StaticWebsite from "./src/components/staticWebsite";
// @remove-web-end
// @remove-mobile-begin
import { PublishExpo } from "./src/providers/publishExpo";
// @remove-mobile-end

const serverPath = "../../hasura";
// @remove-web-begin
const webPath = "../web";
// @remove-web-end
// @remove-mobile-begin
const mobilePath = "../mobile";
// @remove-mobile-end

const config = new pulumi.Config();
const domain = config.require("domain");
const serverDomain = `${path.basename(serverPath)}.${domain}`;

export const graphqlUrl = `https://${serverDomain}/v1/graphql`;
// @remove-web-begin
export const webUrl = `https://${domain}`;
// @remove-web-end

// Create a wildcard certificate so it can be re-used.
// https://docs.aws.amazon.com/acm/latest/userguide/acm-certificate.html
// There's a hidden limit on the number of certificates an AWS account can create.
// https://github.com/aws/aws-cdk/issues/5889#issuecomment-599609939
const subdomainCertificate = new Certificate("subdomain-certificate", {
  domain: `*.${domain}`,
});
// @remove-web-begin
const domainCertificate = new Certificate("domain-certificate", {
  domain,
});
// @remove-web-end

const dbName = config.require("dbName");
const dbUsername = config.require("dbUsername");
const dbPassword = config.requireSecret("dbPassword");
const { connectionString, cluster } = new Rds("server-db", {
  dbName,
  dbUsername,
  dbPassword,
});
const hasuraGraphqlAdminSecret = config.requireSecret(
  "hasuraGraphqlAdminSecret"
);
new Fargate(path.basename(serverPath), {
  certificate: subdomainCertificate,
  domain: serverDomain,
  connectionString,
  cluster,
  hasuraGraphqlAdminSecret,
  imagePath: serverPath,
});

// @remove-web-begin
new StaticWebsite(path.basename(webPath), {
  certificate: domainCertificate,
  domain,
  graphqlUrl,
  webPath,
});
// @remove-web-end

// @remove-mobile-begin
const expoConfig = new pulumi.Config("expo");
export const { url: expoProjectUrl } = new PublishExpo("publish-expo", {
  username: expoConfig.require("username"),
  password: expoConfig.requireSecret("password"),
  releaseChannel: pulumi.getStack(),
  projectDir: mobilePath,
  env: { GRAPHQL_URL: graphqlUrl },
});
// @remove-mobile-end
