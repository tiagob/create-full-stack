// @remove-file-web
import * as pulumi from "@pulumi/pulumi";
import AWS from "aws-sdk";
import { PutObjectOutput } from "aws-sdk/clients/s3";
import { SpawnSyncOptions } from "child_process";
import spawn from "cross-spawn";

// Build web and upload to S3. This is handled as a dynamic provider because these steps are
// interlinked.
// Dependencies are:
// 1. Auth0 resource creation to get the Auth0 client id
// 2. Build web with the Auth0 client id in the environment
// 3. Upload files to s3
// This process fails if the files are aws.s3.BucketObject resources because they're not known
// during the planning stage. A resource difference between planning and apply stages isn't allowed.

// Dynamically import some modules that use native code to prevent error:
// PromiseRejectionHandledWarning: Promise rejection was handled asynchronously
// Function code:
// function () { [native code] }
// https://www.pulumi.com/docs/tutorials/aws/serializing-functions/#capturing-modules-in-a-javascript-function

export interface SyncWebResourceInputs {
  auth0Audience: pulumi.Input<string | undefined>;
  auth0Domain: pulumi.Input<string>;
  webPath: pulumi.Input<string>;
  graphqlUrl: pulumi.Input<string>;
  clientId: pulumi.Input<string>;
  bucketName: pulumi.Input<string>;
}

interface SyncWebInputs {
  auth0Audience?: string;
  auth0Domain: string;
  webPath: string;
  graphqlUrl: string;
  clientId: string;
  bucketName: string;
}

interface ObjectOutput extends PutObjectOutput {
  Key: string;
}

interface SyncWebOutputs {
  bucketName: string;
  objectOutputs: ObjectOutput[];
}

function runYarn(
  cwd: string,
  args: string[] = [],
  options: SpawnSyncOptions = {}
) {
  const command = "yarnpkg";
  const argsWithCwd = ["--cwd", cwd, ...args];
  const proc = spawn.sync(command, argsWithCwd, options);
  if (proc.status !== 0) {
    console.error(`\`${command} ${argsWithCwd.join(" ")}\` failed`);
  }
  return proc.output;
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
  const {
    graphqlUrl,
    auth0Audience,
    auth0Domain,
    clientId,
    webPath,
    bucketName,
  } = inputs;

  runYarn(webPath, ["build"], {
    env: {
      ...process.env,
      REACT_APP_GRAPHQL_URL: graphqlUrl,
      REACT_APP_AUTH0_AUDIENCE: auth0Audience,
      REACT_APP_AUTH0_DOMAIN: auth0Domain,
      REACT_APP_AUTH0_CLIENT_ID: clientId,
    },
  });
  const pathToBuild = `${webPath}/build`;
  const webContentsRootPath = path.join(process.cwd(), pathToBuild);
  console.log("Syncing contents from local disk at", webContentsRootPath);
  const objectOutputs: ObjectOutput[] = [];
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
      (err, data) => {
        if (err) {
          console.log(err);
        } else {
          objectOutputs.push({ Key: relativeFilePath, ...data });
          console.log(
            `Successfully uploaded ${relativeFilePath} to ${bucketName}`
          );
        }
      }
    );
  });
  const hash = await hashElement(pathToBuild);
  return {
    id: hash.hash,
    outs: { objectOutputs, bucketName },
  };
}

const syncWebProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: SyncWebInputs) {
    return syncWeb(inputs);
  },

  async update(_, __, news: SyncWebInputs) {
    const { outs } = await syncWeb(news);
    return { outs };
  },

  async delete(_, props: SyncWebOutputs) {
    const s3 = new AWS.S3();

    console.log("Deleting contents from s3 bucket", props.bucketName);
    s3.deleteObjects(
      {
        Bucket: props.bucketName,
        Delete: {
          Objects: props.objectOutputs.map((obj) => ({
            Key: obj.Key,
            VersionId: obj.VersionId,
          })),
        },
      },
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`Successfully deleted web files in ${props.bucketName}`);
        }
      }
    );
  },
};

export class SyncWeb extends pulumi.dynamic.Resource {
  public readonly bucketName!: pulumi.Output<string>;

  public readonly objectOutputs!: pulumi.Output<ObjectOutput[]>;

  constructor(
    name: string,
    props: SyncWebResourceInputs,
    opts?: pulumi.CustomResourceOptions
  ) {
    super(
      syncWebProvider,
      name,
      { bucketName: undefined, objectOutputs: undefined, ...props },
      opts
    );
  }
}
