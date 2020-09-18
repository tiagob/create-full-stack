import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import { Cluster } from "@pulumi/awsx/ecs";
import * as pulumi from "@pulumi/pulumi";
import { Output } from "@pulumi/pulumi";

import { Env } from "../common";
import { getDomainAndSubdomain } from "../utils";

export interface FargateArgs {
  /**
   * The ARN of the default SSL server certificate. Exactly one certificate is
   * required if the protocol is HTTPS.
   */
  certificateArn: Output<string> | string;
  /**
   * The domain name this fargate service should use.
   */
  domain: string;
  /**
   * The image id to use for the container. If this is provided then the image
   * with this idq will be pulled from Docker Hub. To provide customized image
   * retrieval, provide [imageProvide] which can do whatever custom work is
   * necessary. See [Image](https://www.pulumi.com/docs/reference/pkg/docker/image/)
   * for common ways to create an image from a local docker build.
   */
  image: awsx.ecs.Image;
  /**
   * An object containing environment variables to pass to this service.
   *
   * Ex.
   * ```ts
   * { DATABASE_URL: "postgres://postgres:postgrespassword@postgres:5432/postgres" }
   * ```
   */
  env: Env;
  /**
   * Overrides fields defined in this component's taskDefinitionArgs, the task
   * definition to create this Fargate service from.
   */
  taskDefinitionArgs?: awsx.ecs.FargateTaskDefinitionArgs;
  /**
   * Cluster this service will run in. If none is provided, the default for the
   * current aws account and region is used.
   */
  cluster?: Cluster;
}

export default class Fargate extends pulumi.ComponentResource {
  constructor(name: string, args: FargateArgs, opts?: pulumi.ResourceOptions) {
    const {
      certificateArn,
      domain,
      image,
      env,
      taskDefinitionArgs,
      cluster,
    } = args;
    super("aws:Fargate", name, args, opts);
    const domainParts = getDomainAndSubdomain(domain);

    const listener = new awsx.elasticloadbalancingv2.ApplicationLoadBalancer(
      // There's a 32 character limit on names so abbreviate to "alb".
      `${name}-alb`,
      {},
      { parent: this }
    )
      .createTargetGroup(
        `${name}-target-group`,
        { port: 8080 },
        { parent: this }
      )
      .createListener(
        `${name}-listener`,
        {
          port: 443,
          protocol: "HTTPS",
          certificateArn,
        },
        { parent: this }
      );

    const clusterOrDefault = cluster ?? awsx.ecs.Cluster.getDefault();

    // Create a Fargate service task that can scale out.
    new awsx.ecs.FargateService(
      `${name}-fargate-service`,
      {
        cluster: clusterOrDefault,
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
          ...taskDefinitionArgs,
        },
      },
      { parent: this }
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
