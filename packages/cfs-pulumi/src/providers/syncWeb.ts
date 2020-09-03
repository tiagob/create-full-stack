import * as pulumi from "@pulumi/pulumi";
import AWS from "aws-sdk";
import spawn from "cross-spawn";
import equal from "fast-deep-equal";

import { InputEnv } from "../common";

// Build web and upload to S3. This is handled as a dynamic provider because these steps are
// interlinked.
// Dependencies are:
// 1. Auth0 resource creation to get the Auth0 client id
// 2. Build web with the Auth0 client id in the environment
// 3. Upload files to s3
// This process fails if the files are aws.s3.BucketObject resources because they're not known
// during the planning stage. A resource difference between planning and apply stages isn't allowed.
// https://pulumi-community.slack.com/archives/C84L4E3N1/p1598152863077100

// Dynamically import some modules that use native code to prevent error:
// PromiseRejectionHandledWarning: Promise rejection was handled asynchronously
// Function code:
// function () { [native code] }
// https://github.com/pulumi/pulumi-aws/issues/249#issuecomment-401563361
// https://www.pulumi.com/docs/tutorials/aws/serializing-functions/#capturing-modules-in-a-javascript-function

export interface SyncWebResourceInputs {
  bucketName: pulumi.Input<string>;
  webPath: pulumi.Input<string>;
  env: InputEnv;
}

interface SyncWebInputs {
  bucketName: string;
  webPath: string;
  env?: NodeJS.ProcessEnv;
}

interface Keys {
  Key: string;
}

interface SyncWebOutputs {
  bucketName: string;
  keys: Keys[];
  hash: string;
  inputs: SyncWebInputs;
}

function buildWeb(webPath: string, env: NodeJS.ProcessEnv = {}) {
  // Yarn doesn't have a programmatic api https://github.com/yarnpkg/yarn/issues/906
  // spawn.sync doesn't know how to resolve modules in a pulumi serialized function
  // https://www.pulumi.com/docs/tutorials/aws/serializing-functions/#serializing-javascript-functions
  const command = require.resolve("yarn/bin/yarn");
  const args = ["--cwd", webPath, "build"];
  const proc = spawn.sync(command, args, { env });
  if (proc.status !== 0) {
    console.error(`\`${command} ${args.join(" ")}\` failed`);
  }
}

// Recursively crawl the provided directory, applying the provided function
// to every file it contains. Doesn't handle cycles from symlinks.
async function crawlDirectory(dir: string, f: (_: string) => void) {
  const fsModule = await import("fs");
  const fs = fsModule.default;
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

async function syncWeb(
  inputs: SyncWebInputs
): Promise<{ id: string; outs: SyncWebOutputs }> {
  const fsModule = await import("fs");
  const fs = fsModule.default;
  const folderHashModule = await import("folder-hash");
  const { hashElement } = folderHashModule;
  const pathModule = await import("path");
  const path = pathModule.default;
  const mimeModule = await import("mime");
  const mime = mimeModule.default;
  const s3 = new AWS.S3();
  const { bucketName, webPath, env } = inputs;

  buildWeb(webPath, env);
  const pathToBuild = `${webPath}/build`;
  const webContentsRootPath = path.join(process.cwd(), pathToBuild);
  const keys: Keys[] = [];
  crawlDirectory(webContentsRootPath, (filePath: string) => {
    const relativeFilePath = filePath.replace(`${webContentsRootPath}/`, "");
    s3.putObject(
      {
        Bucket: bucketName,
        Key: relativeFilePath,
        Body: fs.readFileSync(filePath),
        ACL: "public-read",
        ContentType: mime.getType(filePath) || undefined,
      },
      (err) => {
        if (err) {
          console.error(err);
        }
      }
    );
    keys.push({ Key: relativeFilePath });
  });
  const { hash } = await hashElement(webPath);
  return {
    id: bucketName,
    outs: { keys, bucketName, hash, inputs },
  };
}

const syncWebProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: SyncWebInputs) {
    return syncWeb(inputs);
  },

  async diff(_, outs: SyncWebOutputs, news: SyncWebInputs) {
    const folderHashModule = await import("folder-hash");
    const { hashElement } = folderHashModule;
    const { hash } = await hashElement(news.webPath);
    return { changes: !equal(outs.inputs, news) || outs.hash !== hash };
  },

  async update(_, __, news: SyncWebInputs) {
    const { outs } = await syncWeb(news);
    return { outs };
  },

  async delete(_, props: SyncWebOutputs) {
    if (props.keys.length === 0) {
      return;
    }

    const s3 = new AWS.S3();
    s3.deleteObjects(
      {
        Bucket: props.bucketName,
        Delete: {
          Objects: props.keys,
        },
      },
      (err) => {
        if (err) {
          console.error(err);
        }
      }
    );
  },
};

export class SyncWeb extends pulumi.dynamic.Resource {
  public readonly bucketName!: pulumi.Output<string>;

  public readonly keys!: pulumi.Output<Keys[]>;

  constructor(
    name: string,
    props: SyncWebResourceInputs,
    opts?: pulumi.CustomResourceOptions
  ) {
    // bucketName is in SyncWebResourceInputs (props) so doesn't need to be included again
    super(syncWebProvider, name, { keys: undefined, ...props }, opts);
  }
}
