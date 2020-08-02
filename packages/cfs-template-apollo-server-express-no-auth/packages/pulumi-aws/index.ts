import * as pulumi from "@pulumi/pulumi";
// @remove-mobile-begin
import spawn from "cross-spawn";
// @remove-mobile-end
import path from "path";

// @remove-mobile-begin
import mobileConfig from "../mobile/app.json";
// @remove-mobile-end
import Certificate from "./src/components/certificate";
import Fargate from "./src/components/fargate";
import Rds from "./src/components/rds";
// @remove-web-begin
import StaticWebsite from "./src/components/staticWebsite";
// @remove-web-end
// @remove-mobile-begin
import { publishExpo } from "./src/utils";
// @remove-mobile-end

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
export const expoUsername = spawn
  .sync("expo", ["whoami"], { encoding: "utf8" })
  .stdout.trim();
export const expoProjectPage = `https://expo.io/@${expoUsername}/${
  mobileConfig.slug
}?release-channel=${pulumi.getStack()}`;
// @remove-mobile-end
export const graphqlUrl = `https://${serverDomain}/graphql`;
// @remove-web-begin
export const webUrl = `https://${domain}`;
// @remove-web-end

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
  // @remove-web-begin
  webUrl,
  // @remove-web-end
});

// @remove-web-begin
new StaticWebsite(path.basename(webPath), {
  certificate: domainCertificate,
  domain,
  graphqlUrl,
  webPath,
});
// @remove-web-end

// @remove-mobile-begin
publishExpo(graphqlUrl, mobilePath);
// @remove-mobile-end
