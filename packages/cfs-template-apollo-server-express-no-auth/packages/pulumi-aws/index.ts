import * as pulumi from "@pulumi/pulumi";
import fs from "fs";

import Certificate from "./src/components/certificate";
import Fargate from "./src/components/fargate";
import Rds from "./src/components/rds";
import StaticWebsite from "./src/components/staticWebsite";

const config = new pulumi.Config();
const domain = config.require("targetDomain");
const serverDomain = `api.${domain}`;
export const graphqlUrl = `https://${serverDomain}/graphql`;
export const webUrl = `https://${domain}`;

const serverCertificate = new Certificate("server-certificate", {
  domain,
});
const webCertificate = new Certificate("web-certificate", {
  domain,
});

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
});

new StaticWebsite("web", {
  certificate: webCertificate,
  domain,
  graphqlUrl,
});

fs.writeFileSync("../mobile/.env", `GRAPHQL_URL=${graphqlUrl}\n`);
