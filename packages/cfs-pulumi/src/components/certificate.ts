import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

import { getDomainAndSubdomain } from "../utils";

const tenMinutes = 60 * 10;

export interface CertificateArgs {
  domain: string;
}

export default class Certificate extends pulumi.ComponentResource {
  arn: pulumi.Output<string>;

  constructor(
    name: string,
    args: CertificateArgs,
    opts?: pulumi.ResourceOptions
  ) {
    const { domain } = args;
    super("aws:Certificate", name, args, opts);
    /**
     * Provision a certificate (and related resources) if a certificateArn is _not_ provided via configuration.
     */
    const eastRegion = new aws.Provider(
      `${name}-provider`,
      {
        profile: aws.config.profile,
        region: "us-east-1", // Per AWS, ACM certificate must be in the us-east-1 region.
      },
      { parent: this }
    );

    /**
     *  Create a DNS record to prove that we _own_ the domain we're requesting a certificate for.
     *  See https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-validate-dns.html for more info.
     */
    const { parentDomain } = getDomainAndSubdomain(domain);
    const hostedZoneId = aws.route53
      .getZone({ name: parentDomain }, { async: true })
      .then((zone) => zone.zoneId);

    const certificate = new aws.acm.Certificate(
      `${name}-certificate`,
      {
        domainName: domain,
        validationMethod: "DNS",
      },
      {
        parent: this,
        provider: eastRegion,
        // There's a hidden limit on the number of certificates an AWS account can create.
        // Protect this resource so it doesn't get deleted on destroy. Otherwise, if you create
        // this 20 times you'll have to contact AWS to increase your limit.
        // https://github.com/aws/aws-cdk/issues/5889#issuecomment-599609939
        protect: true,
      }
    );

    const certificateValidationDomain = new aws.route53.Record(
      `${name}-record`,
      {
        name: certificate.domainValidationOptions[0].resourceRecordName,
        zoneId: hostedZoneId,
        type: certificate.domainValidationOptions[0].resourceRecordType,
        records: [certificate.domainValidationOptions[0].resourceRecordValue],
        ttl: tenMinutes,
      },
      { parent: this }
    );

    /**
     * This is a _special_ resource that waits for ACM to complete validation via the DNS record
     * checking for a status of "ISSUED" on the certificate itself. No actual resources are
     * created (or updated or deleted).
     *
     * See https://www.terraform.io/docs/providers/aws/r/acm_certificate_validation.html for slightly more detail
     * and https://github.com/terraform-providers/terraform-provider-aws/blob/master/aws/resource_aws_acm_certificate_validation.go
     * for the actual implementation.
     */
    const certificateValidation = new aws.acm.CertificateValidation(
      `${name}-certificate-validation`,
      {
        certificateArn: certificate.arn,
        validationRecordFqdns: [certificateValidationDomain.fqdn],
      },
      { provider: eastRegion, parent: this }
    );
    this.arn = certificateValidation.certificateArn;

    this.registerOutputs({
      arn: this.arn,
    });
  }
}
