import * as pulumi from "@pulumi/pulumi";

import Fargate from "./src/components/fargate";
import Rds from "./src/components/rds";
import StaticWebsite from "./src/components/staticWebsite";

const config = new pulumi.Config();
const domain = config.require("targetDomain");
const serverDomain = `api.${domain}`;
export const graphqlUrl = `https://${serverDomain}/v1/graphql`;
export const webUrl = `https://${domain}`;

const dbName = config.require("dbName");
const dbUsername = config.require("dbUsername");
const dbPassword = config.requireSecret("dbPassword");
const { connectionString, cluster } = new Rds("server-db", {
  dbName,
  dbUsername,
  dbPassword,
});
new Fargate("server", {
  domain: serverDomain,
  connectionString,
  cluster,
});

new StaticWebsite("web", { domain, graphqlUrl });
