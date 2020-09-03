import * as awsx from "@pulumi/awsx";
import * as pulumi from "@pulumi/pulumi";
import { Certificate, Fargate, Rds } from "cfs-pulumi";
import path from "path";

const serverPath = "../server";

const stack = pulumi.getStack();
const config = new pulumi.Config();
const auth0Stack = new pulumi.StackReference(
  `${config.require("organization")}/cfs-auth0/${stack}`
);
const serverDomain = `${path.basename(serverPath)}.${config.require("domain")}`;

export const graphqlUrl = `https://${serverDomain}/graphql`;

export const { arn: certificateArn } = new Certificate(
  "subdomain-certificate",
  {
    domain: config.require("domain"),
    subjectAlternativeNames: [`*.${config.require("domain")}`],
    // There's a hidden limit on the number of certificates an AWS account can create.
    // Protect this resource so it doesn't get deleted on destroy. Otherwise, if you create
    // this 20 times you'll have to contact AWS to increase your limit.
    // https://github.com/aws/aws-cdk/issues/5889#issuecomment-599609939
    protect: false,
  }
);

const { connectionString, cluster } = new Rds("server-db", {
  dbName: config.require("dbName"),
  dbUsername: config.require("dbUsername"),
  dbPassword: config.requireSecret("dbPassword"),
});

new Fargate(path.basename(serverPath), {
  certificateArn,
  domain: serverDomain,
  cluster,
  image: awsx.ecs.Image.fromDockerBuild("image", {
    context: "../..",
    dockerfile: `${serverPath}/Dockerfile`,
  }),
  env: {
    DATABASE_URL: connectionString,
    AUTH0_AUDIENCE: auth0Stack.getOutput("audience"),
    AUTH0_DOMAIN: auth0Stack.getOutput("domain"),
    CORS_ORIGIN: auth0Stack.getOutput("webUrl"),
  },
});
