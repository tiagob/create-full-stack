import * as auth0 from "@pulumi/auth0";
import * as awsx from "@pulumi/awsx";
import * as pulumi from "@pulumi/pulumi";
// @remove-mobile-begin
import { Output } from "@pulumi/pulumi";
// @remove-mobile-end
import { Auth0 } from "cfs-pulumi-auth0";
import {
  Certificate,
  Fargate,
  overrideEnvVars,
  Rds,
  // @remove-web-begin
  StaticWebsite,
  // @remove-web-end
} from "cfs-pulumi-aws";
// @remove-mobile-begin
import { PublishExpo } from "cfs-pulumi-expo";
// @remove-mobile-end
import fs from "fs";
import path from "path";

// @remove-mobile-begin
import mobileConfig from "../mobile/app.json";
// @remove-mobile-end

const serverPath = "../../hasura";
// @remove-web-begin
const webPath = "../web";
// @remove-web-end
// @remove-mobile-begin
const mobilePath = "../mobile";
// @remove-mobile-end

const stack = pulumi.getStack();
const isDevelopment = stack === "development";
const config = new pulumi.Config();
const serverDomain = isDevelopment
  ? "localhost:8080"
  : `${path.basename(serverPath)}.${config.require("domain")}`;
const auth0Domain = new pulumi.Config("auth0").require("domain");
// @remove-mobile-begin
const expoConfig = new pulumi.Config("expo");
// eslint-disable-next-line import/no-mutable-exports
let expoProjectUrl: Output<string> | undefined;
// @remove-mobile-end

export const graphqlUrl = `${
  isDevelopment ? "http" : "https"
}://${serverDomain}/v1/graphql`;
// @remove-web-begin
export const webUrl = isDevelopment
  ? "http://localhost:3000"
  : `https://${config.require("domain")}`;
// @remove-web-end

const {
  audience: auth0Audience,
  webClientId: auth0WebClientId,
  mobileClientId: auth0MobileClientId,
} = new Auth0("auth0", {
  resourceServerName: path.basename(serverPath),
  // @remove-web-begin
  web: {
    clientName: path.basename(webPath),
    url: webUrl,
  },
  // @remove-web-end
  // @remove-mobile-begin
  mobile: {
    clientName: path.basename(mobilePath),
    expoUsername: expoConfig.require("username"),
    slug: mobileConfig.expo.slug,
  },
  // @remove-mobile-end
});

new auth0.Rule("rule", {
  name: "hasuraAccessToken",
  enabled: true,
  script: fs.readFileSync("./auth0-rules/hasuraAccessToken.js", "utf8"),
});

if (isDevelopment) {
  overrideEnvVars(`${serverPath}/.env.development`, {
    HASURA_GRAPHQL_JWT_SECRET: pulumi.interpolate`{"jwk_url":"https://${auth0Domain}/.well-known/jwks.json","audience":"${auth0Audience}"}`,
  });
  // @remove-web-begin
  overrideEnvVars(`${webPath}/.env.development`, {
    REACT_APP_GRAPHQL_URL: graphqlUrl,
    REACT_APP_AUTH0_CLIENT_ID: auth0WebClientId,
    REACT_APP_AUTH0_AUDIENCE: auth0Audience,
    REACT_APP_AUTH0_DOMAIN: auth0Domain,
  });
  // @remove-web-end
  // @remove-mobile-begin
  overrideEnvVars(`${mobilePath}/.env.development`, {
    AUTH0_CLIENT_ID: auth0MobileClientId,
    AUTH0_AUDIENCE: auth0Audience,
    AUTH0_DOMAIN: auth0Domain,
  });
  // @remove-mobile-end
} else {
  // `domain` is only required for the production stack
  const domain = config.require("domain");
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
    image: awsx.ecs.Image.fromPath("image", serverPath),
    env: {
      HASURA_GRAPHQL_DATABASE_URL: connectionString,
      // Enable downloading plugins which are not present.
      // https://github.com/hasura/graphql-engine/issues/4651#issuecomment-623414531
      HASURA_GRAPHQL_CLI_ENVIRONMENT: "default",
      HASURA_GRAPHQL_ADMIN_SECRET: config.requireSecret(
        "hasuraGraphqlAdminSecret"
      ),
      HASURA_GRAPHQL_JWT_SECRET: pulumi.interpolate`{"jwk_url":"https://${auth0Domain}/.well-known/jwks.json","audience":"${auth0Audience}"}`,
      // @remove-web-begin
      HASURA_GRAPHQL_CORS_DOMAIN: webUrl,
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
      REACT_APP_AUTH0_AUDIENCE: auth0Audience,
      REACT_APP_AUTH0_DOMAIN: auth0Domain,
      REACT_APP_AUTH0_CLIENT_ID: auth0WebClientId,
    },
  });
  // @remove-web-end

  // @remove-mobile-begin
  expoProjectUrl = new PublishExpo("publish-expo", {
    username: expoConfig.require("username"),
    password: expoConfig.requireSecret("password"),
    releaseChannel: pulumi.getStack(),
    mobilePath,
    env: {
      GRAPHQL_URL: graphqlUrl,
      AUTH0_AUDIENCE: auth0Audience,
      AUTH0_DOMAIN: auth0Domain,
      AUTH0_CLIENT_ID: auth0MobileClientId,
    },
  }).url;
  // @remove-mobile-end
}

// @remove-mobile-begin
export { expoProjectUrl };
// @remove-mobile-end
