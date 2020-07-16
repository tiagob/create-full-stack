import * as pulumi from "@pulumi/pulumi";
import fetch from "node-fetch";

export interface HasuraGraphqlJwtSecretResourceInputs {
  auth0Domain: pulumi.Input<string>;
}

interface HasuraGraphqlJwtSecretInputs {
  auth0Domain: string;
}

interface HasuraGraphqlJwtSecretOutputs {
  value: string;
}

async function hasuraGraphqlJwtSecret(
  inputs: HasuraGraphqlJwtSecretInputs
): Promise<HasuraGraphqlJwtSecretOutputs> {
  const response = await fetch(
    `https://cors-anywhere.herokuapp.com/https://${inputs.auth0Domain}/pem`,
    {
      headers: { origin: "https://hasura.io" },
    }
  );
  return {
    value: JSON.stringify({
      type: "RS512",
      key: response.body,
    }),
  };
}

const hasuraGraphqlJwtSecretProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: HasuraGraphqlJwtSecretInputs) {
    const outs = await hasuraGraphqlJwtSecret(inputs);
    return { id: inputs.auth0Domain, outs };
  },

  async update(_, __, news: HasuraGraphqlJwtSecretInputs) {
    const outs = await hasuraGraphqlJwtSecret(news);
    return { outs };
  },
};

export class HasuraGraphqlJwtSecret extends pulumi.dynamic.Resource {
  public readonly value!: pulumi.Output<string>;

  constructor(
    name: string,
    props: HasuraGraphqlJwtSecretResourceInputs,
    opts?: pulumi.CustomResourceOptions
  ) {
    super(
      hasuraGraphqlJwtSecretProvider,
      name,
      { value: undefined, ...props },
      opts
    );
  }
}
