import * as pulumi from "@pulumi/pulumi";
import * as spawn from "cross-spawn";

export interface BuildWebResourceInputs {
  pathToWebsiteContents: pulumi.Input<string>;
  graphqlUrl: pulumi.Input<string>;
  clientId: pulumi.Input<string>;
}

interface BuildWebInputs {
  pathToWebsiteContents: string;
  graphqlUrl: string;
  clientId: string;
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

// https://github.com/pulumi/pulumi-aws/issues/916
// https://www.pulumi.com/docs/intro/concepts/programming-model/#dynamicproviders
async function buildWeb(inputs: BuildWebInputs) {
  const fsModule = await import("fs");
  const fs = fsModule.default;
  const folderHashModule = await import("folder-hash");
  const { hashElement } = folderHashModule;
  // TODO: Set REACT_APP_AUTH0_DOMAIN from CLI
  // TODO: Same API for production and development?
  fs.writeFileSync(
    "../web/.env.local",
    `REACT_APP_AUTH0_AUDIENCE=${inputs.graphqlUrl}\nREACT_APP_AUTH0_DOMAIN=create-full-stack.auth0.com\nREACT_APP_AUTH0_CLIENT_ID=${inputs.clientId}\n`
  );
  runYarn(inputs.pathToWebsiteContents, ["build"]);
  return hashElement(inputs.pathToWebsiteContents);
}

const buildWebProvider: pulumi.dynamic.ResourceProvider = {
  async create(inputs: BuildWebInputs) {
    const hash = await buildWeb(inputs);
    return { id: hash.hash };
  },

  async update(_, __, news: BuildWebInputs) {
    buildWeb(news);
    return {};
  },
};

export class BuildWeb extends pulumi.dynamic.Resource {
  constructor(
    name: string,
    args: BuildWebResourceInputs,
    opts?: pulumi.CustomResourceOptions
  ) {
    super(buildWebProvider, name, args, opts);
  }
}
