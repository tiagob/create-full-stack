// @remove-file-mobile
import { getDefaultTarget } from "@expo/config";
import { Project, UserManager } from "@expo/xdl";
import * as pulumi from "@pulumi/pulumi";
import isEqual from "lodash.isequal";

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
  projectDir: pulumi.Input<string>;
  env: pulumi.Input<{
    [key: string]: string | pulumi.Input<string | undefined>;
  }>;
}

interface PublishExpoInputs {
  username: string;
  password: string;
  releaseChannel: string;
  projectDir: string;
  env: {
    [key: string]: string | undefined;
  };
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
  const { username, password, releaseChannel, projectDir, env } = inputs;
  await UserManager.loginAsync("user-pass", {
    username,
    password,
  });
  const processEnv = Object.freeze({ ...process.env });
  process.env = { ...process.env, ...env };
  const result = await Project.publishAsync(projectDir, {
    releaseChannel,
    quiet: false,
    target: getDefaultTarget(projectDir),
  });
  process.env = { ...processEnv };
  const hash = await hashElement(projectDir);
  return {
    id: result.ids.join("|"),
    outs: { inputs, hash: hash.hash, ...result },
  };
}

const publishExpoProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: PublishExpoInputs) {
    return publishExpo(inputs);
  },

  async update(_, __, news: PublishExpoInputs) {
    const { outs } = await publishExpo(news);
    return { outs };
  },

  async diff(_, outs: PublishExpoOutputs, news: PublishExpoInputs) {
    const folderHashModule = await import("folder-hash");
    const { hashElement } = folderHashModule;
    const hash = await hashElement(news.projectDir);
    return { changes: !isEqual(outs.inputs, news) || outs.hash !== hash.hash };
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
