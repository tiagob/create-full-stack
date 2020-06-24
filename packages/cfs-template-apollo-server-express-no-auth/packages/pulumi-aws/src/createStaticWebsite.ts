// Adapted from
// https://github.com/pulumi/examples/blob/master/aws-ts-static-website/index.ts

import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as spawn from "cross-spawn";
import * as fs from "fs";
import * as mime from "mime";
import * as path from "path";

import createCertificate from "./createCertificate";
import { InvalidateCloudfront } from "./invalidateCloudfrontProvider";
import { getDomainAndSubdomain } from "./utils";

// Creates a new Route53 DNS record pointing the domain to the CloudFront distribution.
function createAliasRecord(
  targetDomain: string,
  distribution: aws.cloudfront.Distribution
) {
  const domainParts = getDomainAndSubdomain(targetDomain);
  const hostedZoneId = aws.route53
    .getZone({ name: domainParts.parentDomain }, { async: true })
    .then((zone) => zone.zoneId);
  return new aws.route53.Record(targetDomain, {
    name: domainParts.subdomain,
    zoneId: hostedZoneId,
    type: "A",
    aliases: [
      {
        name: distribution.domainName,
        zoneId: distribution.hostedZoneId,
        evaluateTargetHealth: true,
      },
    ],
  });
}

function runYarn(cwd: string, args: string[] = []) {
  const command = "yarnpkg";
  const argsWithCwd = ["--cwd", cwd, ...args];
  const proc = spawn.sync(command, argsWithCwd, { stdio: "inherit" });
  if (proc.status !== 0) {
    console.error(`\`${command} ${argsWithCwd.join(" ")}\` failed`);
    process.exit(1);
  }
}

const tenMinutes = 60 * 10;
// pathToWebsiteContents is a relative path to the website's contents.
const pathToWebsiteContents = "../web/build";

export default function createStaticWebsite(
  stackConfig: pulumi.Config,
  graphqlUrl: string
) {
  // targetDomain is the domain/host to serve content at.
  const targetDomain = stackConfig.require("targetDomain");
  const { certificateArn } = createCertificate(targetDomain);
  fs.writeFileSync(
    "../web/.env.production.local",
    `REACT_APP_GRAPHQL_URL=${graphqlUrl}\n`
  );
  runYarn(pathToWebsiteContents, ["build"]);

  // contentBucket is the S3 bucket that the website's contents will be stored in.
  const contentBucket = new aws.s3.Bucket("contentBucket", {
    bucket: targetDomain,
    acl: "public-read",
    // Configure S3 to serve bucket contents as a website. This way S3 will automatically convert
    // requests for "foo/" to "foo/index.html".
    website: {
      indexDocument: "index.html",
      // Handle 404s with index.html since the web app is a SPA
      errorDocument: "index.html",
    },
  });

  // crawlDirectory recursive crawls the provided directory, applying the provided function
  // to every file it contains. Doesn't handle cycles from symlinks.
  function crawlDirectory(dir: string, f: (_: string) => void) {
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

  // Sync the contents of the source directory with the S3 bucket, which will in-turn show up on the CDN.
  const webContentsRootPath = path.join(process.cwd(), pathToWebsiteContents);
  console.log("Syncing contents from local disk at", webContentsRootPath);
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

  // logsBucket is an S3 bucket that will contain the CDN's request logs.
  const logsBucket = new aws.s3.Bucket("requestLogs", {
    bucket: `${targetDomain}-logs`,
    acl: "private",
    forceDestroy: true,
  });

  // distributionArgs configures the CloudFront distribution. Relevant documentation:
  // https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html
  // https://www.terraform.io/docs/providers/aws/r/cloudfront_distribution.html
  const distributionArgs: aws.cloudfront.DistributionArgs = {
    enabled: true,
    // Alternate aliases the CloudFront distribution can be reached at, in addition to https://xxxx.cloudfront.net.
    // Required if you want to access the distribution via targetDomain as well.
    aliases: [targetDomain],

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
      prefix: `${targetDomain}/`,
    },
  };

  const cdn = new aws.cloudfront.Distribution("cdn", distributionArgs);
  // Invalidate the cache on update
  new InvalidateCloudfront("invalidate-cloudfront", {
    distributionId: cdn.id,
    paths: ["/*"],
  });

  createAliasRecord(targetDomain, cdn);

  // Export properties from this stack. This prints them at the end of `pulumi up` and
  // makes them easier to access from the pulumi.com.
  return {
    contentBucketUri: pulumi.interpolate`s3://${contentBucket.bucket}`,
    contentBucketWebsiteEndpoint: contentBucket.websiteEndpoint,
    cloudFrontDomain: cdn.domainName,
    targetDomainEndpoint: `https://${targetDomain}/`,
  };
}
