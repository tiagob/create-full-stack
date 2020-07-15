import * as aws from "@pulumi/aws";

import { getDomainAndSubdomain } from "./utils";

const tenMinutes = 60 * 10;

export default function createCertificate(domain: string) {
  /**
   * Provision a certificate (and related resources) if a certificateArn is _not_ provided via configuration.
   */
  const eastRegion = new aws.Provider(`${domain}-east`, {
    profile: aws.config.profile,
    region: "us-east-1", // Per AWS, ACM certificate must be in the us-east-1 region.
  });

  /**
   *  Create a DNS record to prove that we _own_ the domain we're requesting a certificate for.
   *  See https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-validate-dns.html for more info.
   */
  // TODO: only need one of these for the top level?
  const { parentDomain } = getDomainAndSubdomain(domain);
  const hostedZoneId = aws.route53
    .getZone({ name: parentDomain }, { async: true })
    .then((zone) => zone.zoneId);

  const certificate = new aws.acm.Certificate(
    `${domain}-certificate`,
    {
      domainName: domain,
      validationMethod: "DNS",
    },
    {
      provider: eastRegion,
      // There's a hidden limit for the number of certificates an AWS account can create.
      // Protect this resource so it doesn't get deleted on destroy. Otherwise, if you create
      // this 20 times you'll have to contact AWS to increase your limit.
      // https://github.com/aws/aws-cdk/issues/5889#issuecomment-599609939
      //
      //   aws:acm:Certificate:
      // error: Error requesting certificate: LimitExceededException: Error: you have reached your limit of 20 certificates in the last year.
      protect: true,
    }
  );

  const certificateValidationDomain = new aws.route53.Record(
    `${domain}-validation`,
    {
      name: certificate.domainValidationOptions[0].resourceRecordName,
      zoneId: hostedZoneId,
      type: certificate.domainValidationOptions[0].resourceRecordType,
      records: [certificate.domainValidationOptions[0].resourceRecordValue],
      ttl: tenMinutes,
    }
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
    `${domain}-certificateValidation`,
    {
      certificateArn: certificate.arn,
      validationRecordFqdns: [certificateValidationDomain.fqdn],
    },
    { provider: eastRegion }
  );

  return { certificateArn: certificateValidation.certificateArn };
}
