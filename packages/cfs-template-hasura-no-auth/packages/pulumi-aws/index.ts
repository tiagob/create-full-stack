import * as awsx from "@pulumi/awsx";
import * as pulumi from "@pulumi/pulumi";
import {
  Certificate,
  Fargate,
  // @remove-mobile-begin
  PublishExpo,
  // @remove-mobile-end
  Rds,
  // @remove-web-begin
  StaticWebsite,
  // @remove-web-end
} from "cfs-pulumi";
import path from "path";

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
// @remove-mobile-begin
const expoConfig = new pulumi.Config("expo");
// @remove-mobile-end

export const graphqlUrl = `https://${serverDomain}/v1/graphql`;
// @remove-web-begin
export const webUrl = `https://${domain}`;
// @remove-web-end

const certificate = new Certificate("certificate", {
  domain,
  subjectAlternativeNames: [`*.${domain}`],
  // There's a hidden limit on the number of certificates an AWS account can create
  // and destroy, 20.
  // https://github.com/aws/aws-cdk/issues/5889#issuecomment-599609939
  protect: true,
});

const dbName = config.require("dbName");
const dbUsername = config.require("dbUsername");
const dbPassword = config.requireSecret("dbPassword");
const { connectionString, cluster } = new Rds("server-db", {
  dbName,
  dbUsername,
  dbPassword,
});
new Fargate(path.basename(serverPath), {
  certificate,
  domain: serverDomain,
  cluster,
  image: awsx.ecs.Image.fromPath("image", serverPath),
  env: {
    HASURA_GRAPHQL_DATABASE_URL: connectionString,
    // Enable downloading plugins which are not present.
    // https://github.com/hasura/graphql-engine/issues/4651#issuecomment-623414531
    HASURA_GRAPHQL_CLI_ENVIRONMENT: "default",
    HASURA_GRAPHQL_ADMIN_SECRET: config.requireSecret(
      "hasuraGraphqlAdminSecret"
    ),
    HASURA_GRAPHQL_UNAUTHORIZED_ROLE: "anonymous",
  },
});

// @remove-web-begin
new StaticWebsite(path.basename(webPath), {
  certificate,
  domain,
  webPath,
  env: {
    REACT_APP_GRAPHQL_URL: graphqlUrl,
  },
});
// @remove-web-end

// @remove-mobile-begin
export const expoProjectUrl = new PublishExpo("publish-expo", {
  username: expoConfig.require("username"),
  password: expoConfig.requireSecret("password"),
  releaseChannel: pulumi.getStack(),
  mobilePath,
  env: {
    GRAPHQL_URL: graphqlUrl,
  },
}).url;
// @remove-mobile-end
