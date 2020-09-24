import * as awsx from "@pulumi/awsx";
import * as pulumi from "@pulumi/pulumi";
import {
  Certificate,
  Fargate,
  Rds,
  // @remove-web-begin
  StaticWebsite,
  // @remove-web-end
} from "cfs-pulumi-aws";
// @remove-mobile-begin
import { PublishExpo } from "cfs-pulumi-expo";
// @remove-mobile-end
import path from "path";

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
// @remove-mobile-begin
const expoConfig = new pulumi.Config("expo");
// @remove-mobile-end

export const graphqlUrl = `https://${serverDomain}/graphql`;
// @remove-web-begin
export const webUrl = `https://${domain}`;
// @remove-web-end

const certificateArn = new Certificate("certificate", {
  domain,
  subjectAlternativeNames: [`*.${domain}`],
  // There's a hidden limit on the number of certificates an AWS account can create
  // and destroy, 20.
  // https://github.com/aws/aws-cdk/issues/5889#issuecomment-599609939
  protect: true,
}).arn;

const dbName = config.require("dbName");
const dbUsername = config.require("dbUsername");
const dbPassword = config.requireSecret("dbPassword");
const { connectionString } = new Rds("server-db", {
  dbName,
  dbUsername,
  dbPassword,
});
new Fargate(path.basename(serverPath), {
  certificateArn,
  domain: serverDomain,
  image: awsx.ecs.Image.fromDockerBuild("image", {
    context: "../..",
    dockerfile: `${serverPath}/Dockerfile`,
  }),
  env: {
    DATABASE_URL: connectionString,
    // @remove-web-begin
    CORS_ORIGIN: webUrl,
    // @remove-web-end
  },
});

// @remove-web-begin
new StaticWebsite(path.basename(webPath), {
  certificateArn,
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
