import * as pulumi from "@pulumi/pulumi";
import path from "path";

import Auth0 from "./src/components/auth0";
import Certificate from "./src/components/certificate";
import Fargate from "./src/components/fargate";
import Rds from "./src/components/rds";
// @remove-web-begin
import StaticWebsite from "./src/components/staticWebsite";
// @remove-web-end
// @remove-mobile-begin
import { PublishExpo } from "./src/providers/publishExpo";
// @remove-mobile-end
import { setDevelopmentEnv } from "./src/utils";

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
  webClientName: path.basename(webPath),
  webUrl,
  // @remove-web-end
  // @remove-mobile-begin
  mobileClientName: path.basename(mobilePath),
  expoUsername: expoConfig.require("username"),
  // @remove-mobile-end
});

if (isDevelopment) {
  setDevelopmentEnv(
    auth0,
    auth0Domain,
    serverPath,
    // @remove-web-begin
    graphqlUrl,
    webPath,
    // @remove-web-end
    // @remove-mobile-begin
    mobilePath
    // @remove-mobile-end
  );
} else {
  const domain = config.require("domain");
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
    auth0Audience: auth0.audience,
    auth0Domain,
    // @remove-web-begin
    webUrl,
    // @remove-web-end
  });

  // @remove-web-begin
  new StaticWebsite(path.basename(webPath), {
    certificate: domainCertificate,
    domain,
    graphqlUrl,
    auth0Audience: auth0.audience,
    auth0Domain,
    webClientId: auth0.webClientId,
    webPath,
  });
  // @remove-web-end
}

// @remove-mobile-begin
export const expoProjectUrl = isDevelopment
  ? undefined
  : new PublishExpo("publish-expo", {
      username: expoConfig.require("username"),
      password: expoConfig.requireSecret("password"),
      releaseChannel: pulumi.getStack(),
      projectDir: mobilePath,
      env: {
        GRAPHQL_URL: graphqlUrl,
        AUTH0_AUDIENCE: auth0.audience,
        AUTH0_DOMAIN: auth0Domain,
        AUTH0_CLIENT_ID: auth0.mobileClientId,
      },
    }).url;
// @remove-mobile-end
