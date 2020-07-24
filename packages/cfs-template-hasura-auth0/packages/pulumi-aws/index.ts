import * as pulumi from "@pulumi/pulumi";
// @remove-mobile-begin
import spawn from "cross-spawn";
// @remove-mobile-end
import path from "path";

// @remove-mobile-begin
import mobileConfig from "../mobile/app.json";
// @remove-mobile-end
import Auth0 from "./src/components/auth0";
import Certificate from "./src/components/certificate";
import Fargate from "./src/components/fargate";
import Rds from "./src/components/rds";
// @remove-web-begin
import StaticWebsite from "./src/components/staticWebsite";
// @remove-web-end

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
export const graphqlUrl = `https://${serverDomain}/v1/graphql`;
// @remove-web-begin
export const webUrl = `https://${domain}`;
// @remove-web-end
const auth0Domain = new pulumi.Config("auth0").require("domain");

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

// @remove-mobile-begin
const expoUsername = spawn
  .sync("expo", ["whoami"], { encoding: "utf8" })
  .stdout.trim();
// @remove-mobile-end
const auth0 = new Auth0("auth0", {
  resourceServerName: path.basename(serverPath),
  // @remove-web-begin
  webClientName: path.basename(webPath),
  webUrl,
  // @remove-web-end
  // @remove-mobile-begin
  mobileClientName: path.basename(mobilePath),
  expoUsername,
  // @remove-mobile-end
});

const dbName = config.require("dbName");
const dbUsername = config.require("dbUsername");
const dbPassword = config.requireSecret("dbPassword");
const { connectionString, cluster } = new Rds("server-db", {
  dbName,
  dbUsername,
  dbPassword,
});
const hasuraGraphqlAdminSecret = config.requireSecret(
  "hasuraGraphqlAdminSecret"
);
new Fargate(path.basename(serverPath), {
  certificate: subdomainCertificate,
  domain: serverDomain,
  connectionString,
  cluster,
  graphqlUrl,
  auth0Domain,
  hasuraGraphqlAdminSecret,
  imagePath: serverPath,
  auth0Audience: auth0.audience,
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

// @remove-mobile-begin
pulumi
  .all([auth0.audience, auth0.mobileClientId])
  .apply(([audience, clientId]) => {
    // Publish mobile app on Expo
    // https://docs.expo.io/workflow/publishing/
    spawn.sync("expo", ["publish", "--release-channel", pulumi.getStack()], {
      cwd: mobilePath,
      env: {
        ...process.env,
        GRAPHQL_URL: graphqlUrl,
        AUTH0_AUDIENCE: audience,
        AUTH0_DOMAIN: auth0Domain,
        AUTH0_CLIENT_ID: clientId,
      },
    });
  });
export const expoProjectPage = `https://expo.io/@${expoUsername}/${
  mobileConfig.slug
}?release-channel=${pulumi.getStack()}`;
// @remove-mobile-end
