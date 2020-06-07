// Adapated from
// https://github.com/pulumi/examples/blob/master/aws-ts-hello-fargate/index.ts

import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import { Cluster } from "@pulumi/awsx/ecs";
import * as pulumi from "@pulumi/pulumi";
import { Output } from "@pulumi/pulumi";

import createCertificate from "./createCertificate";
import { getDomainAndSubdomain } from "./utils";

const subDomain = "hasura";

export default function createFargate(
  stackConfig: pulumi.Config,
  connectionString: Output<string>,
  cluster: Cluster
) {
  const targetDomain = stackConfig.require("targetDomain");
  const hostname = `${subDomain}.${targetDomain}`;
  const { certificateArn } = createCertificate(hostname);
  // Step 2: Define the Networking for our service.
  const listener = new awsx.lb.NetworkLoadBalancer("lb")
    .createTargetGroup("group", { port: 8080, protocol: "TCP" })
    .createListener("listener", {
      port: 443,
      protocol: "TLS",
      certificateArn,
    });

  // Step 3: Build and publish a Docker image to a private ECR registry.
  const imageName = "graphql-engine";
  const img = awsx.ecs.Image.fromPath(imageName, "../../hasura");

  // Step 4: Create a Fargate service task that can scale out.
  new awsx.ecs.FargateService(
    "app-svc",
    {
      cluster,
      taskDefinitionArgs: {
        container: {
          image: img,
          portMappings: [listener],
          environment: [
            { name: "HASURA_GRAPHQL_DATABASE_URL", value: connectionString },
            // Enable downloading plugins which are not present.
            // https://github.com/hasura/graphql-engine/issues/4651#issuecomment-623414531
            { name: "HASURA_GRAPHQL_CLI_ENVIRONMENT", value: "default" },
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
  new aws.route53.Record("hasura-record", {
    name: subDomain,
    records: [listener.endpoint.hostname],
    ttl: 5,
    type: "CNAME",
    zoneId: hostedZoneId,
  });

  const graphqlUrl = `https://${hostname}/v1/graphql`;
  return { graphqlUrl };
}
