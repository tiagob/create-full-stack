import * as pulumi from "@pulumi/pulumi";
import AWS from "aws-sdk";

// Invalidating Cloudfront cache for static hosting on S3.
// Follows suggestion in Pulumi issue:
// https://github.com/pulumi/pulumi-aws/issues/916

export interface InvalidateCloudfrontResourceInputs {
  distributionId: pulumi.Input<string>;
  paths: pulumi.Input<string[]>;
}

interface InvalidateCloudfrontInputs {
  distributionId: string;
  paths: string[];
}

function invalidateCloudfront(inputs: InvalidateCloudfrontInputs) {
  const params = {
    DistributionId: inputs.distributionId,
    InvalidationBatch: {
      CallerReference: "pulumi",
      Paths: {
        Quantity: inputs.paths.length,
        Items: [...inputs.paths],
      },
    },
  };
  const cloudfront = new AWS.CloudFront();
  cloudfront.createInvalidation(params, (err) => {
    if (err) console.log(err, err.stack);
  });
}

const invalidateCloudfrontProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: InvalidateCloudfrontInputs) {
    invalidateCloudfront(inputs);
    return { id: inputs.distributionId };
  },

  async update(_, __, news: InvalidateCloudfrontInputs) {
    invalidateCloudfront(news);
    return {};
  },
};

export class InvalidateCloudfront extends pulumi.dynamic.Resource {
  constructor(
    name: string,
    props: InvalidateCloudfrontResourceInputs,
    opts?: pulumi.CustomResourceOptions
  ) {
    super(invalidateCloudfrontProvider, name, props, opts);
  }
}
