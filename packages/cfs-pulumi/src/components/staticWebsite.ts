import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import fs from "fs";
import mime from "mime";
import path from "path";

import { InvalidateCloudfront } from "../providers/invalidateCloudfront";
import { getDomainAndSubdomain } from "../utils";

// Adapted from
// https://github.com/pulumi/examples/blob/master/aws-ts-static-website/index.ts

// Recursively crawl the provided directory, applying the provided function
// to every file it contains. Doesn't handle cycles from symlinks.
async function crawlDirectory(dir: string, f: (_: string) => void) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = `${dir}/${file}`;
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      crawlDirectory(filePath, f);
    }
    if (stat.isFile()) {
      f(filePath);
    }
  }
}

const tenMinutes = 60 * 10;

export interface StaticWebsiteArgs {
  certificateArn: pulumi.Output<string> | string;
  domain: string;
  webPath: string;
}

export default class StaticWebsite extends pulumi.ComponentResource {
  constructor(
    name: string,
    args: StaticWebsiteArgs,
    opts?: pulumi.ResourceOptions
  ) {
    const { certificateArn, domain, webPath } = args;
    super("aws:StaticWebsite", name, args, opts);

    const contentBucket = new aws.s3.Bucket(
      `${name}-content-bucket`,
      {
        bucket: domain,
        acl: "public-read",
        // Configure S3 to serve bucket contents as a website. This way S3 will automatically convert
        // requests for "foo/" to "foo/index.html".
        website: {
          indexDocument: "index.html",
          // Handle 404s with index.html since the web app is a SPA
          errorDocument: "index.html",
        },
        forceDestroy: true,
      },
      { parent: this }
    );

    const webContentsRootPath = path.join(process.cwd(), `${webPath}/build`);
    // Sync the contents of the source directory with the S3 bucket, which will in-turn show up
    // on the CDN.
    crawlDirectory(webContentsRootPath, (filePath: string) => {
      const relativeFilePath = filePath.replace(`${webContentsRootPath}/`, "");
      new aws.s3.BucketObject(
        relativeFilePath,
        {
          key: relativeFilePath,
          acl: "public-read",
          bucket: contentBucket,
          contentType: mime.getType(filePath) || undefined,
          source: new pulumi.asset.FileAsset(filePath),
        },
        {
          parent: contentBucket,
        }
      );
    });

    // Contains the CDN's request logs.
    const logsBucket = new aws.s3.Bucket(
      `${name}-logs-bucket`,
      {
        bucket: `${domain}-logs`,
        acl: "private",
        forceDestroy: true,
      },
      { parent: this }
    );

    // distributionArgs configures the CloudFront distribution. Relevant documentation:
    // https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html
    // https://www.terraform.io/docs/providers/aws/r/cloudfront_distribution.html
    const distributionArgs: aws.cloudfront.DistributionArgs = {
      enabled: true,
      // Alternate aliases the CloudFront distribution can be reached at, in addition to https://xxxx.cloudfront.net.
      // Required if you want to access the distribution via targetDomain as well.
      aliases: [domain],

      // We only specify one origin for this distribution, the S3 content bucket.
      origins: [
        {
          originId: contentBucket.arn,
          domainName: contentBucket.websiteEndpoint,
          customOriginConfig: {
            // Amazon S3 doesn't support HTTPS connections when using an S3 bucket configured as a website endpoint.
            // https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesOriginProtocolPolicy
            originProtocolPolicy: "http-only",
            httpPort: 80,
            httpsPort: 443,
            originSslProtocols: ["TLSv1.2"],
          },
        },
      ],

      defaultRootObject: "index.html",

      // A CloudFront distribution can configure different cache behaviors based on the request path.
      // Here we just specify a single, default cache behavior which is just read-only requests to S3.
      defaultCacheBehavior: {
        targetOriginId: contentBucket.arn,

        viewerProtocolPolicy: "redirect-to-https",
        allowedMethods: ["GET", "HEAD", "OPTIONS"],
        cachedMethods: ["GET", "HEAD", "OPTIONS"],

        forwardedValues: {
          cookies: { forward: "none" },
          queryString: false,
        },

        minTtl: 0,
        defaultTtl: tenMinutes,
        maxTtl: tenMinutes,
      },

      // "All" is the most broad distribution, and also the most expensive.
      // "100" is the least broad, and also the least expensive.
      priceClass: "PriceClass_100",

      // You can customize error responses. When CloudFront receives an error from the origin (e.g. S3 or some other
      // web service) it can return a different error code, and return the response for a different resource.
      customErrorResponses: [
        { errorCode: 404, responseCode: 404, responsePagePath: "/404.html" },
      ],

      restrictions: {
        geoRestriction: {
          restrictionType: "none",
        },
      },

      viewerCertificate: {
        acmCertificateArn: certificateArn, // Per AWS, ACM certificate must be in the us-east-1 region.
        sslSupportMethod: "sni-only",
      },

      loggingConfig: {
        bucket: logsBucket.bucketDomainName,
        includeCookies: false,
        prefix: `${domain}/`,
      },
    };

    const cdn = new aws.cloudfront.Distribution(
      `${name}-cdn`,
      distributionArgs,
      { parent: this }
    );
    // Invalidate the cache on update
    new InvalidateCloudfront(
      `${name}-invalidate-cloudfront`,
      {
        distributionId: cdn.id,
        paths: ["/*"],
      },
      { parent: this }
    );

    // Create a new Route53 DNS record pointing the domain to the CloudFront distribution.
    const domainParts = getDomainAndSubdomain(domain);
    const hostedZoneId = aws.route53
      .getZone({ name: domainParts.parentDomain }, { async: true })
      .then((zone) => zone.zoneId);
    new aws.route53.Record(
      `${name}-record`,
      {
        name: domainParts.subdomain,
        zoneId: hostedZoneId,
        type: "A",
        aliases: [
          {
            name: cdn.domainName,
            zoneId: cdn.hostedZoneId,
            evaluateTargetHealth: true,
          },
        ],
      },
      { parent: this }
    );
  }
}
