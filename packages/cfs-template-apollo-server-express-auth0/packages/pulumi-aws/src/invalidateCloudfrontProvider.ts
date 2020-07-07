import * as pulumi from "@pulumi/pulumi";
import * as AWS from "aws-sdk";

export interface InvalidateCloudfrontResourceInputs {
  distributionId: pulumi.Input<string>;
  paths: pulumi.Input<string[]>;
}

interface InvalidateCloudfrontInputs {
  distributionId: string;
  paths: string[];
}

// https://github.com/pulumi/pulumi-aws/issues/916
// https://www.pulumi.com/docs/intro/concepts/programming-model/#dynamicproviders
// https://docs.aws.amazon.com/cli/latest/reference/cloudfront/create-invalidation.html
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#createInvalidation-property
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
    args: InvalidateCloudfrontResourceInputs,
    opts?: pulumi.CustomResourceOptions
  ) {
    super(invalidateCloudfrontProvider, name, args, opts);
  }
}
