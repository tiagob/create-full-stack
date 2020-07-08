// Adapated from
// https://github.com/pulumi/examples/blob/master/aws-ts-hello-fargate/index.ts

import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import { Cluster } from "@pulumi/awsx/ecs";
import * as pulumi from "@pulumi/pulumi";
import { Output } from "@pulumi/pulumi";
import fetch from "node-fetch";

import createCertificate from "./createCertificate";
import { getDomainAndSubdomain } from "./utils";

export default async function createFargate(
  stackConfig: pulumi.Config,
  connectionString: Output<string>,
  cluster: Cluster,
  name: string,
  subDomain: string
) {
  const targetDomain = stackConfig.require("targetDomain");
  const hostname = `${subDomain}.${targetDomain}`;
  const graphqlUrl = `https://${hostname}/v1/graphql`;

  // const { certificateArn } = createCertificate(hostname);
  // Step 2: Define the Networking for our service.
  // const listener = new awsx.lb.NetworkLoadBalancer(`lb-${name}`)
  //   .createTargetGroup("group", { port: 8080, protocol: "TCP" })
  //   .createListener("listener", {
  //     port: 443,
  //     protocol: "TLS",
  //     certificateArn,
  //   });
  const listener = new awsx.lb.ApplicationLoadBalancer("net-lb", {
    external: true,
  }).createListener("web", { port: 80, external: true });

  // Step 3: Build and publish a Docker image to a private ECR registry.
  const img = awsx.ecs.Image.fromPath(name, "../../hasura");

  // Fetch HASURA_GRAPHQL_JWT_SECRET. Use API call from https://hasura.io/jwt-config/
  // TODO: Get auth0Url from CLI
  const auth0Url = "https://create-full-stack.auth0.com";
  const response = await fetch(
    `https://cors-anywhere.herokuapp.com/${auth0Url}/pem`,
    {
      headers: { origin: "https://hasura.io" },
    }
  );
  const hasuraGraphqlJwtSecret = JSON.stringify({
    type: "RS512",
    key: response.body,
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
            { name: "HASURA_GRAPHQL_DATABASE_URL", value: connectionString },
            // Enable downloading plugins which are not present.
            // https://github.com/hasura/graphql-engine/issues/4651#issuecomment-623414531
            { name: "HASURA_GRAPHQL_CLI_ENVIRONMENT", value: "default" },
            // TODO: Value from config
            { name: "HASURA_GRAPHQL_ADMIN_SECRET", value: "myadminsecretkey" },
            {
              name: "HASURA_GRAPHQL_JWT_SECRET",
              value: hasuraGraphqlJwtSecret,
            },
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
    name: subDomain,
    records: [listener.endpoint.hostname],
    ttl: 5,
    type: "CNAME",
    zoneId: hostedZoneId,
  });

  return { graphqlUrl };
}
