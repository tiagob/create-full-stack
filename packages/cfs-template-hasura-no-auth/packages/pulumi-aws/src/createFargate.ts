// Adapated from
// https://github.com/pulumi/examples/blob/master/aws-ts-hello-fargate/index.ts

import * as awsx from "@pulumi/awsx";
import { Cluster } from "@pulumi/awsx/ecs";
import * as pulumi from "@pulumi/pulumi";
import { Output } from "@pulumi/pulumi";

export default function createFargate(
  connectionString: Output<string>,
  cluster: Cluster
) {
  // Step 2: Define the Networking for our service.
  const alb = new awsx.lb.ApplicationLoadBalancer("alb", {
    external: true,
    securityGroups: cluster.securityGroups,
  });
  const listener = alb.createListener("web", { port: 8080, external: true });

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

  const url = pulumi.interpolate`http://${listener.endpoint.hostname}:${listener.endpoint.port}`;
  return { url };
}
