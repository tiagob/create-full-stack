import * as pulumi from "@pulumi/pulumi";
import fs from "fs";

import Certificate from "./src/components/certificate";
import Fargate from "./src/components/fargate";
import Rds from "./src/components/rds";
// @remove-web-begin
import StaticWebsite from "./src/components/staticWebsite";
// @remove-web-end

const config = new pulumi.Config();
const domain = config.require("targetDomain");
const serverDomain = `api.${domain}`;
export const graphqlUrl = `https://${serverDomain}/v1/graphql`;
// @remove-web-begin
export const webUrl = `https://${domain}`;
// @remove-web-end

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
  connectionString,
  cluster,
});

// @remove-web-begin
new StaticWebsite("web", {
  certificate: webCertificate,
  domain,
  graphqlUrl,
});
// @remove-web-end

// @remove-mobile-begin
fs.writeFileSync("../mobile/.env", `GRAPHQL_URL=${graphqlUrl}\n`);
// @remove-mobile-end
