import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import { Cluster } from "@pulumi/awsx/ecs";
import * as pulumi from "@pulumi/pulumi";
import fs from "fs";

import { getDomainAndSubdomain } from "../utils";
import Certificate from "./certificate";

export interface FargateArgs {
  domain: string;
  webUrl: string;
  connectionString: pulumi.Output<string>;
  cluster: Cluster;
  graphqlUrl: string;
  auth0Domain: string;
}

export default class Fargate extends pulumi.ComponentResource {
  constructor(name: string, args: FargateArgs, opts?: pulumi.ResourceOptions) {
    const {
      domain,
      webUrl,
      connectionString,
      cluster,
      graphqlUrl,
      auth0Domain,
    } = args;
    super("aws:Fargate", name, args, opts);
    const domainParts = getDomainAndSubdomain(domain);

    fs.writeFileSync(
      "../server/.env",
      `AUTH0_AUDIENCE=${graphqlUrl}\nAUTH0_DOMAIN=${auth0Domain}\n`
    );

    const certificate = new Certificate(
      `${name}-certificate`,
      {
        domain,
      },
      { parent: this }
    );
    const listener = new awsx.lb.NetworkLoadBalancer(
      // There's a 32 character limit on names so abbreviate to "nlb".
      `${name}-nlb`,
      {},
      { parent: this }
    )
      .createTargetGroup(
        `${name}-target-group`,
        { port: 8080, protocol: "TCP" },
        { parent: this }
      )
      .createListener(
        `${name}-listener`,
        {
          port: 443,
          protocol: "TLS",
          certificateArn: certificate.arn,
        },
        { parent: this }
      );

    // Build and publish a Docker image to a private ECR registry.
    const img = awsx.ecs.Image.fromDockerBuild(`${name}-image`, {
      context: "../..",
      dockerfile: "../server/Dockerfile",
    });

    // Create a Fargate service task that can scale out.
    new awsx.ecs.FargateService(
      `${name}-fargate-service`,
      {
        cluster,
        taskDefinitionArgs: {
          container: {
            image: img,
            portMappings: [listener],
            environment: [
              { name: "DATABASE_URL", value: connectionString },
              { name: "CORS_ORIGIN", value: webUrl },
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
        parent: this,
      }
    );

    const hostedZoneId = aws.route53
      .getZone({ name: domainParts.parentDomain }, { async: true })
      .then((zone) => zone.zoneId);
    new aws.route53.Record(
      `${name}-record`,
      {
        name: domainParts.subdomain,
        records: [listener.endpoint.hostname],
        ttl: 5,
        type: "CNAME",
        zoneId: hostedZoneId,
      },
      { parent: this }
    );
  }
}
