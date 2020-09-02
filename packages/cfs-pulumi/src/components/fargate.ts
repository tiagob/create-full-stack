import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import { Cluster } from "@pulumi/awsx/ecs";
import * as pulumi from "@pulumi/pulumi";

import { Env } from "../common";
import { getDomainAndSubdomain } from "../utils";

export interface FargateArgs {
  certificateArn: pulumi.Output<string> | string;
  domain: string;
  cluster: Cluster;
  image: awsx.ecs.Image;
  env: Env;
}

export default class Fargate extends pulumi.ComponentResource {
  constructor(name: string, args: FargateArgs, opts?: pulumi.ResourceOptions) {
    const { certificateArn, domain, cluster, image, env } = args;
    super("aws:Fargate", name, args, opts);
    const domainParts = getDomainAndSubdomain(domain);

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
          certificateArn,
        },
        { parent: this }
      );

    // Create a Fargate service task that can scale out.
    new awsx.ecs.FargateService(
      `${name}-fargate-service`,
      {
        cluster,
        taskDefinitionArgs: {
          container: {
            image,
            portMappings: [listener],
            environment:
              env &&
              Object.entries(env).map(([n, v]) => {
                let value: string | pulumi.Output<string> = "";
                if (typeof v === "string") {
                  value = v;
                } else if (typeof v === "object") {
                  value = v.apply((a) => a ?? "");
                }
                return {
                  name: n,
                  value,
                };
              }),
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
