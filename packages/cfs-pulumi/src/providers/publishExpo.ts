import { getDefaultTarget } from "@expo/config";
import { Project, UserManager } from "@expo/xdl";
import * as pulumi from "@pulumi/pulumi";
import equal from "fast-deep-equal";

import { InputEnv } from "../common";

// Dynamically import some modules that use native code to prevent error:
// PromiseRejectionHandledWarning: Promise rejection was handled asynchronously
// Function code:
// function () { [native code] }
// https://github.com/pulumi/pulumi-aws/issues/249#issuecomment-401563361
// https://www.pulumi.com/docs/tutorials/aws/serializing-functions/#capturing-modules-in-a-javascript-function

export interface PublishExpoResourceInputs {
  username: pulumi.Input<string>;
  password: pulumi.Input<string>;
  releaseChannel: pulumi.Input<string>;
  mobilePath: pulumi.Input<string>;
  env: InputEnv;
}

interface PublishExpoInputs {
  username: string;
  password: string;
  releaseChannel: string;
  mobilePath: string;
  env?: NodeJS.ProcessEnv;
}

interface PublishExpoOutputs {
  url: string;
  ids: string[];
  err?: string | undefined;
  hash: string;
  inputs: PublishExpoInputs;
}

async function publishExpo(
  inputs: PublishExpoInputs
): Promise<{ id: string; outs: PublishExpoOutputs }> {
  const folderHashModule = await import("folder-hash");
  const { hashElement } = folderHashModule;
  const { username, password, releaseChannel, mobilePath, env } = inputs;
  await UserManager.loginAsync("user-pass", {
    username,
    password,
  });
  const processEnv = Object.freeze({ ...process.env });
  process.env = { ...processEnv, ...env };
  const result = await Project.publishAsync(mobilePath, {
    releaseChannel,
    quiet: false,
    target: getDefaultTarget(mobilePath),
  });
  process.env = { ...processEnv };
  const { hash } = await hashElement(mobilePath);
  return {
    id: result.ids.join("|"),
    outs: { inputs, hash, ...result },
  };
}

const publishExpoProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: PublishExpoInputs) {
    return publishExpo(inputs);
  },

  async diff(_, outs: PublishExpoOutputs, news: PublishExpoInputs) {
    const folderHashModule = await import("folder-hash");
    const { hashElement } = folderHashModule;
    const { hash } = await hashElement(news.mobilePath);
    return { changes: !equal(outs.inputs, news) || outs.hash !== hash };
  },

  async update(_, __, news: PublishExpoInputs) {
    const { outs } = await publishExpo(news);
    return { outs };
  },
};

export class PublishExpo extends pulumi.dynamic.Resource {
  public readonly url!: pulumi.Output<string>;

  public readonly ids!: pulumi.Output<string[]>;

  public readonly err!: pulumi.Output<string | undefined>;

  public readonly hash!: pulumi.Output<string>;

  public readonly inputs!: pulumi.Output<PublishExpoInputs>;

  constructor(
    name: string,
    props: PublishExpoResourceInputs,
    opts?: pulumi.CustomResourceOptions
  ) {
    super(
      publishExpoProvider,
      name,
      {
        url: undefined,
        ids: undefined,
        err: undefined,
        hash: undefined,
        inputs: undefined,
        ...props,
      },
      opts
    );
  }
}
