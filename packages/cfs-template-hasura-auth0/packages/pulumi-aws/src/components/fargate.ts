import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import { Cluster } from "@pulumi/awsx/ecs";
import * as pulumi from "@pulumi/pulumi";

import { getDomainAndSubdomain } from "../utils";
import Certificate from "./certificate";

export interface FargateArgs {
  certificate: Certificate;
  domain: string;
  connectionString: pulumi.Output<string>;
  cluster: Cluster;
  graphqlUrl: string;
  auth0Domain: string;
  hasuraGraphqlAdminSecret: pulumi.Output<string>;
  imagePath: string;
  auth0Audience: pulumi.Output<string | undefined>;
}

export default class Fargate extends pulumi.ComponentResource {
  constructor(name: string, args: FargateArgs, opts?: pulumi.ResourceOptions) {
    const {
      certificate,
      domain,
      connectionString,
      cluster,
      auth0Domain,
      hasuraGraphqlAdminSecret,
      imagePath,
      auth0Audience,
    } = args;
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
          certificateArn: certificate.arn,
        },
        { parent: this }
      );

    // Build and publish a Docker image to a private ECR registry.
    const img = awsx.ecs.Image.fromPath(`${name}-image`, imagePath);

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
              { name: "HASURA_GRAPHQL_DATABASE_URL", value: connectionString },
              // Enable downloading plugins which are not present.
              // https://github.com/hasura/graphql-engine/issues/4651#issuecomment-623414531
              { name: "HASURA_GRAPHQL_CLI_ENVIRONMENT", value: "default" },
              {
                name: "HASURA_GRAPHQL_ADMIN_SECRET",
                value: hasuraGraphqlAdminSecret,
              },
              {
                name: "HASURA_GRAPHQL_JWT_SECRET",
                value: pulumi.interpolate`{"jwk_url":"https://${auth0Domain}/.well-known/jwks.json","audience":"${auth0Audience}"}`,
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
