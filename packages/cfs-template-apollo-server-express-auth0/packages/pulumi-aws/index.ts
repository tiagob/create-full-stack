import * as pulumi from "@pulumi/pulumi";
// @remove-mobile-begin
import fs from "fs";
// @remove-mobile-end
import path from "path";

import Auth0 from "./src/components/auth0";
import Certificate from "./src/components/certificate";
import Fargate from "./src/components/fargate";
import Rds from "./src/components/rds";
// @remove-web-begin
import StaticWebsite from "./src/components/staticWebsite";
// @remove-web-end

const serverPath = "../server";
// @remove-web-begin
const webPath = "../web";
// @remove-web-end
// @remove-mobile-begin
const mobilePath = "../mobile";
// @remove-mobile-end

const config = new pulumi.Config();
const domain = config.require("domain");
const serverDomain = `${path.basename(serverPath)}.${domain}`;
export const graphqlUrl = `https://${serverDomain}/graphql`;
// @remove-web-begin
export const webUrl = `https://${domain}`;
// @remove-web-end
const auth0Domain = config.require("auth0Domain");

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
new Fargate(path.basename(serverPath), {
  certificate: subdomainCertificate,
  domain: serverDomain,
  connectionString,
  cluster,
  imagePath: serverPath,
  graphqlUrl,
  auth0Domain,
  // @remove-web-begin
  webUrl,
  // @remove-web-end
});

// @remove-mobile-begin
const auth0MobileCallback = config.require("auth0MobileCallback");
// @remove-mobile-end
const auth0 = new Auth0("auth0", {
  resourceServerName: path.basename(serverPath),
  // @remove-web-begin
  webClientName: path.basename(webPath),
  webUrl,
  // @remove-web-end
  // @remove-mobile-begin
  mobileClientName: path.basename(mobilePath),
  auth0MobileCallback,
  // @remove-mobile-end
});

// @remove-web-begin
new StaticWebsite(path.basename(webPath), {
  certificate: domainCertificate,
  domain,
  graphqlUrl,
  auth0Domain,
  webClientId: auth0.webClientId,
  webPath,
});
// @remove-web-end

// @remove-mobile-begin
auth0.mobileClientId.apply((clientId) => {
  fs.writeFileSync(
    `${mobilePath}/.env`,
    // Broken up for readability.
    `${[
      `GRAPHQL_URL=${graphqlUrl}`,
      `AUTH0_AUDIENCE=${graphqlUrl}`,
      `AUTH0_DOMAIN=${auth0Domain}`,
      "# AUTH0_CLIENT_ID can be publicly shared (checked into git)",
      "# https://community.auth0.com/t/client-id-vs-secret/9558/2",
      `AUTH0_CLIENT_ID=${clientId}`,
    ].join("\n")}\n`
  );
});
// @remove-mobile-end
