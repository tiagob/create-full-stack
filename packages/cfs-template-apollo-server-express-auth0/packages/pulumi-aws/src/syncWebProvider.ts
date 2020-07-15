import * as pulumi from "@pulumi/pulumi";
import * as AWS from "aws-sdk";
import { PutObjectOutput } from "aws-sdk/clients/s3";
import * as spawn from "cross-spawn";
// Dynamically import some modules that use native code to prevent error:
// PromiseRejectionHandledWarning: Promise rejection was handled asynchronously
// Function code:
// function () { [native code] }
// https://www.pulumi.com/docs/tutorials/aws/serializing-functions/#capturing-modules-in-a-javascript-function

export interface SyncWebResourceInputs {
  pathToWebsiteContents: pulumi.Input<string>;
  graphqlUrl: pulumi.Input<string>;
  clientId: pulumi.Input<string>;
  bucketName: pulumi.Input<string>;
}

interface SyncWebInputs {
  pathToWebsiteContents: string;
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

function runYarn(cwd: string, args: string[] = []) {
  const command = "yarnpkg";
  const argsWithCwd = ["--cwd", cwd, ...args];
  const proc = spawn.sync(command, argsWithCwd, { stdio: "inherit" });
  if (proc.status !== 0) {
    console.error(`\`${command} ${argsWithCwd.join(" ")}\` failed`);
    process.exit(1);
  }
  return proc.output;
}

// crawlDirectory recursive crawls the provided directory, applying the provided function
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

// https://github.com/pulumi/pulumi-aws/issues/916
// https://www.pulumi.com/docs/intro/concepts/programming-model/#dynamicproviders
async function syncWeb(inputs: SyncWebInputs) {
  const fsModule = await import("fs");
  const fs = fsModule.default;
  const folderHashModule = await import("folder-hash");
  const { hashElement } = folderHashModule;
  const pathModule = await import("path");
  const path = pathModule.default;
  const mimeModule = await import("mime");
  const mime = mimeModule.default;
  const s3 = new AWS.S3();

  // TODO: Set REACT_APP_AUTH0_DOMAIN from CLI
  // TODO: Same API for production and development?
  fs.writeFileSync(
    "../web/.env.local",
    `REACT_APP_AUTH0_AUDIENCE=${inputs.graphqlUrl}\nREACT_APP_AUTH0_DOMAIN=create-full-stack.auth0.com\nREACT_APP_AUTH0_CLIENT_ID=${inputs.clientId}\n`
  );
  runYarn(inputs.pathToWebsiteContents, ["build"]);
  const pathToBuild = `${inputs.pathToWebsiteContents}/build`;
  const webContentsRootPath = path.join(process.cwd(), pathToBuild);
  console.log("Syncing contents from local disk at", webContentsRootPath);
  const objectOutputs: ObjectOutput[] = [];
  crawlDirectory(webContentsRootPath, (filePath: string) => {
    const relativeFilePath = filePath.replace(`${webContentsRootPath}/`, "");
    s3.putObject(
      {
        Bucket: inputs.bucketName,
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
            `Successfully uploaded ${relativeFilePath} to ${inputs.bucketName}`
          );
        }
      }
    );
  });
  const hash = await hashElement(pathToBuild);
  return {
    id: hash.hash,
    outs: { objectOutputs, bucketName: inputs.bucketName },
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

  // TODO: Delete isn't getting called
  async delete(_, props: SyncWebOutputs) {
    const s3 = new AWS.S3();

    console.log("Deleting contents from s3 bucket", props.bucketName);
    s3.deleteObjects(
      {
        Bucket: props.bucketName,
        Delete: {
          Objects: props.objectOutputs.map((obj) => ({ Key: obj.Key })),
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
  constructor(
    name: string,
    args: SyncWebResourceInputs,
    opts?: pulumi.CustomResourceOptions
  ) {
    super(syncWebProvider, name, args, opts);
  }
}
