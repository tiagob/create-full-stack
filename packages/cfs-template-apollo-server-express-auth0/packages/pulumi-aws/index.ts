import * as pulumi from "@pulumi/pulumi";
import fs from "fs";

import Auth0 from "./src/components/auth0";
import Certificate from "./src/components/certificate";
import Fargate from "./src/components/fargate";
import Rds from "./src/components/rds";
// @remove-web-begin
import StaticWebsite from "./src/components/staticWebsite";
// @remove-web-end

const config = new pulumi.Config();
const domain = config.require("targetDomain");
const serverDomain = `api.${domain}`;
export const graphqlUrl = `https://${serverDomain}/graphql`;
// @remove-web-begin
export const webUrl = `https://${domain}`;
// @remove-web-end
const auth0Domain = config.require("auth0Domain");

const serverCertificate = new Certificate("server-certificate", {
  domain,
});
// @remove-web-begin
const webCertificate = new Certificate("web-certificate", {
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
new Fargate("server", {
  certificate: serverCertificate,
  domain: serverDomain,
  webUrl,
  connectionString,
  cluster,
  graphqlUrl,
  auth0Domain,
});

// @remove-mobile-begin
const auth0MobileCallback = config.require("auth0MobileCallback");
// @remove-mobile-end
const { webClientId, mobileClientId } = new Auth0("auth0", {
  // @remove-web-begin
  webUrl,
  // @remove-web-end
  graphqlUrl,
  // @remove-mobile-begin
  auth0MobileCallback,
  // @remove-mobile-end
});

// @remove-web-begin
new StaticWebsite("web", {
  certificate: webCertificate,
  domain,
  graphqlUrl,
  auth0Domain,
  webClientId,
});
// @remove-web-end

// @remove-mobile-begin
mobileClientId.apply((clientId) => {
  fs.writeFileSync(
    "../mobile/.env",
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
