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
import path from "path";

// @remove-mobile-begin
import mobileConfig from "../mobile/app.json";
// @remove-mobile-end

const serverPath = "../server";
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
}://${serverDomain}/graphql`;
// @remove-web-begin
export const webUrl = isDevelopment
  ? "http://localhost:3000"
  : `https://${config.require("domain")}`;
// @remove-web-end

const auth0 = new Auth0("auth0", {
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

if (isDevelopment) {
  overrideEnvVars(`${serverPath}/.env.development`, {
    AUTH0_AUDIENCE: auth0.audience,
    AUTH0_DOMAIN: auth0Domain,
  });
  // @remove-web-begin
  overrideEnvVars(`${webPath}/.env.development`, {
    REACT_APP_GRAPHQL_URL: graphqlUrl,
    REACT_APP_AUTH0_CLIENT_ID: auth0.webClientId,
    REACT_APP_AUTH0_AUDIENCE: auth0.audience,
    REACT_APP_AUTH0_DOMAIN: auth0Domain,
  });
  // @remove-web-end
  // @remove-mobile-begin
  overrideEnvVars(`${mobilePath}/.env.development`, {
    AUTH0_CLIENT_ID: auth0.mobileClientId,
    AUTH0_AUDIENCE: auth0.audience,
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
    image: awsx.ecs.Image.fromDockerBuild("image", {
      context: "../..",
      dockerfile: `${serverPath}/Dockerfile`,
    }),
    env: {
      DATABASE_URL: connectionString,
      AUTH0_AUDIENCE: auth0.audience,
      AUTH0_DOMAIN: auth0Domain,
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
      REACT_APP_AUTH0_AUDIENCE: auth0.audience,
      REACT_APP_AUTH0_DOMAIN: auth0Domain,
      REACT_APP_AUTH0_CLIENT_ID: auth0.webClientId,
    },
  });

  // @remove-mobile-begin
  expoProjectUrl = new PublishExpo("publish-expo", {
    username: expoConfig.require("username"),
    password: expoConfig.requireSecret("password"),
    releaseChannel: pulumi.getStack(),
    mobilePath,
    env: {
      GRAPHQL_URL: graphqlUrl,
      AUTH0_AUDIENCE: auth0.audience,
      AUTH0_DOMAIN: auth0Domain,
      AUTH0_CLIENT_ID: auth0.mobileClientId,
    },
  }).url;
  // @remove-mobile-end
}

// @remove-mobile-begin
export { expoProjectUrl };
// @remove-mobile-end
