// Adapated from
// https://github.com/pulumi/examples/blob/master/aws-ts-hello-fargate/index.ts

import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import { Cluster } from "@pulumi/awsx/ecs";
import * as pulumi from "@pulumi/pulumi";
import { Output } from "@pulumi/pulumi";
import * as fs from "fs";

import createCertificate from "./createCertificate";
import { getDomainAndSubdomain } from "./utils";

export default function createFargate(
  stackConfig: pulumi.Config,
  connectionString: Output<string>,
  cluster: Cluster,
  name: string,
  subDomain: string
) {
  const targetDomain = stackConfig.require("targetDomain");
  const hostname = `${subDomain}.${targetDomain}`;
  const graphqlUrl = `https://${hostname}/graphql`;
  // TODO: Set REACT_APP_AUTH0_DOMAIN from CLI
  // TODO: Same API for production and development?
  fs.writeFileSync(
    "../server/.env",
    `AUTH0_AUDIENCE=${graphqlUrl}\nAUTH0_DOMAIN=create-full-stack.auth0.com\n`
  );

  const { certificateArn } = createCertificate(hostname);
  // Step 2: Define the Networking for our service.
  const listener = new awsx.lb.NetworkLoadBalancer(`lb-${name}`)
    .createTargetGroup("group", { port: 8080, protocol: "TCP" })
    .createListener("listener", {
      port: 443,
      protocol: "TLS",
      certificateArn,
    });

  // Step 3: Build and publish a Docker image to a private ECR registry.
  const img = awsx.ecs.Image.fromDockerBuild(name, {
    context: "../..",
    dockerfile: "../server/Dockerfile",
  });

  // Step 4: Create a Fargate service task that can scale out.
  new awsx.ecs.FargateService(
    `fargate-${name}`,
    {
      cluster,
      taskDefinitionArgs: {
        container: {
          image: img,
          portMappings: [listener],
          environment: [
            { name: "DATABASE_URL", value: connectionString },
            { name: "CORS_ORIGIN", value: `https://${targetDomain}` },
          ],
        },
      },
    },
    {
      customTimeouts: {
        create: "20m",
        update: "20m",
        delete: "20m",
      },
    }
  );

  const domainParts = getDomainAndSubdomain(
    stackConfig.require("targetDomain")
  );
  const hostedZoneId = aws.route53
    .getZone({ name: domainParts.parentDomain }, { async: true })
    .then((zone) => zone.zoneId);
  new aws.route53.Record(`record-${name}`, {
    name,
    records: [listener.endpoint.hostname],
    ttl: 5,
    type: "CNAME",
    zoneId: hostedZoneId,
  });

  return { graphqlUrl };
}
