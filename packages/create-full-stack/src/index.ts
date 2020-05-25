import { JSONSchemaForNPMPackageJsonFiles } from "@schemastore/package";
import chalk from "chalk";
import commander from "commander";
import spawn from "cross-spawn";
import fs from "fs-extra";
import yaml from "js-yaml";
import os from "os";
import path from "path";

import packageJson from "../package.json";
import appPackageJson from "../templates/package.json";
import vscodeSettingsJson from "../templates/vscode/settings.json";
import {
  checkAppName,
  isSafeToCreateProjectIn,
  shouldUseYarn,
  tryGitInit,
} from "./createReactAppUtils";

enum Backends {
  apolloServerExpress = "apollo-server-express",
  hasura = "hasura",
  firestore = "firestore",
}
const backends = Object.values(Backends);
const nodeBackends = new Set([Backends.apolloServerExpress]);
// TODO: Add auth0
const authChoiceToType = {
  firebase: "firebase-auth",
  "": "no-auth",
};
type AuthChoiceToType = typeof authChoiceToType;

let projectName = "";

interface Program extends commander.Command {
  backend?: Backends;
  web?: boolean;
  mobile?: boolean;
  auth?: keyof AuthChoiceToType;
}

const program: Program = new commander.Command(packageJson.name)
  .version(packageJson.version)
  .arguments("<project-directory>")
  .usage(`${chalk.green("<project-directory>")} [options]`)
  .action((name) => {
    projectName = name;
  })
  .option("-b, --backend <backend>", `backend type [${backends.join("|")}]`)
  .option("-w, --web", "include react website")
  .option("-m, --mobile", "include react-native mobile app")
  .option(
    "-a, --auth <auth>",
    `auth type [${Object.keys(authChoiceToType).join("|")}]`
  )
  .parse(process.argv);

const isNodeBackend = program.backend
  ? nodeBackends.has(program.backend)
  : false;
const hasFirebaseFunctions =
  program.backend === Backends.hasura && program.auth === "firebase";

// Don't include any local files. node_modules and yarn.lock will be different
// depending on what packages are included because yarn puts these at the root
// of the project
const excludeFiles = new Set(["node_modules", "build", "yarn.lock"]);
function filterCopySyncWithExcludeList(
  excludePathList: string[]
): (src: string) => boolean {
  return (src: string) => {
    const fileOrFolder = path.basename(src);
    const toExclude = new Set([...excludeFiles, ...excludePathList]);

    return !toExclude.has(fileOrFolder);
  };
}

function copySync(
  templatePath: string,
  appPath: string,
  silent = false,
  excludePathList: string[] = []
) {
  if (fs.existsSync(templatePath)) {
    fs.copySync(templatePath, appPath, {
      filter: filterCopySyncWithExcludeList(excludePathList),
    });
  } else if (!silent) {
    console.error(
      `Could not locate supplied template: ${chalk.green(templatePath)}`
    );
  }
}

const backendToGraphqlSchema = {
  [Backends.apolloServerExpress]: "packages/backend/src/graphql/schema.ts",
  [Backends.hasura]: "http://localhost:8080/v1/graphql",
};
type BackendToGraphqlSchema = typeof backendToGraphqlSchema;

function addApolloCodegen(backend: keyof BackendToGraphqlSchema) {
  const appPackage: JSONSchemaForNPMPackageJsonFiles = { ...appPackageJson };
  appPackage.devDependencies = Object.assign(appPackage.devDependencies || {}, {
    "@graphql-codegen/cli": "^1.14.0",
    "@graphql-codegen/typescript": "^1.14.0",
    "@graphql-codegen/typescript-operations": "^1.14.0",
    "@graphql-codegen/typescript-react-apollo": "^1.14.0",
    "@graphql-codegen/typescript-resolvers": "^1.14.0",
    graphql: "^14.2.1",
    "graphql-tag": "^2.0.0",
  });
  appPackage.scripts = Object.assign(appPackage.scripts || {}, {
    generate: "graphql-codegen --watch",
  });
  fs.writeFileSync(
    `${projectName}/package.json`,
    JSON.stringify(appPackage, undefined, 2) + os.EOL
  );

  fs.writeFileSync(
    `${projectName}/codegen.yml`,
    yaml.safeDump({
      schema: backendToGraphqlSchema[backend],
      generates: {
        ...(backend === Backends.apolloServerExpress && {
          "packages/backend/src/graphql/__generated__/index.ts": {
            plugins: ["typescript", "typescript-resolvers"],
            config: {
              useIndexSignature: true,
            },
          },
        }),
        ...(program.mobile && {
          "packages/mobile/src/graphql/__generated__/index.ts": {
            documents: "packages/mobile/src/graphql/*.graphql",
            plugins: [
              "typescript",
              "typescript-operations",
              "typescript-react-apollo",
            ],
            config: {
              withHOC: false,
              withComponent: false,
              withHooks: true,
            },
          },
        }),
        ...(program.web && {
          "packages/web/src/graphql/__generated__/index.ts": {
            documents: "packages/web/src/graphql/*.graphql",
            plugins: [
              "typescript",
              "typescript-operations",
              "typescript-react-apollo",
            ],
            config: {
              withHOC: false,
              withComponent: false,
              withHooks: true,
            },
          },
        }),
      },
    }) + os.EOL
  );
}

// "eslint.workingDirectories" is defined in the base settings.json as never[]
// Override the type definition to allow this script to push to it
type VSCodeSettingsJson = typeof vscodeSettingsJson;
interface VSCodeSettings
  extends Omit<VSCodeSettingsJson, "eslint.workingDirectories"> {
  "eslint.workingDirectories": {
    directory: string;
    changeProcessCWD: boolean;
  }[];
}

function addVSCodeSettings() {
  const vscodeSettings: VSCodeSettings = { ...vscodeSettingsJson };
  if (isNodeBackend) {
    vscodeSettings["eslint.workingDirectories"].push({
      directory: "packages/backend",
      changeProcessCWD: true,
    });
  }
  if (hasFirebaseFunctions) {
    vscodeSettings["eslint.workingDirectories"].push({
      directory: "packages/firebase-functions",
      changeProcessCWD: true,
    });
  }
  if (program.mobile) {
    vscodeSettings["eslint.workingDirectories"].push({
      directory: "packages/mobile",
      changeProcessCWD: true,
    });
  }
  if (program.web) {
    vscodeSettings["eslint.workingDirectories"].push({
      directory: "packages/web",
      changeProcessCWD: true,
    });
  }
  fs.ensureDirSync(`${projectName}/.vscode`);
  fs.writeFileSync(
    `${projectName}/.vscode/settings.json`,
    JSON.stringify(vscodeSettings, undefined, 2) + os.EOL
  );
  // TODO: Add launch.json
  // https://github.com/tiagob/todo-starter/blob/master/.vscode/launch.json
}

async function copyTemplate() {
  fs.copySync("./templates/gitignore", `${projectName}/.gitignore`);
  if (hasFirebaseFunctions) {
    fs.appendFileSync(
      `${projectName}/.gitignore`,
      "\n# firebase\nfirebase-debug.log\n"
    );
  }
  // Copy root package.json for Yarn workspaces
  // TODO: Set package name to the project name
  fs.copySync("./templates/package.json", `${projectName}/package.json`);
  if (
    program.backend === Backends.apolloServerExpress ||
    program.backend === Backends.hasura
  ) {
    addApolloCodegen(program.backend);
  }
  addVSCodeSettings();

  const auth = authChoiceToType[(program.auth || "") as keyof AuthChoiceToType];
  const excludeList = [];
  if (!program.web) {
    excludeList.push("web");
  }
  if (!program.mobile) {
    excludeList.push("mobile");
  }
  copySync(
    `./templates/${program.backend}/${auth}`,
    projectName,
    false,
    excludeList
  );
}

function installDependencies() {
  const command = "yarnpkg";
  const args = ["--cwd", projectName];
  console.log(`Installing packages using ${command}...`);
  console.log();

  const proc = spawn.sync(command, args, { stdio: "inherit" });
  if (proc.status !== 0) {
    console.error(`\`${command} ${args.join(" ")}\` failed`);
    process.exit(1);
  }
}

function buildNodeServer() {
  const command = "yarnpkg";
  const args = ["--cwd", `${projectName}/packages/server`, "build"];
  console.log(`Building the node server...`);
  console.log();

  const proc = spawn.sync(command, args, { stdio: "inherit" });
  if (proc.status !== 0) {
    console.error(`\`${command} ${args.join(" ")}\` failed`);
    process.exit(1);
  }
}

async function run() {
  // Validation
  if (!program.backend || !backends.includes(program.backend)) {
    console.error(
      `Specified backend-type not valid. Must be one of [${backends.join("|")}]`
    );
    process.exit(1);
  }
  if (program.auth && !(program.auth in authChoiceToType)) {
    console.error(
      `Specified auth-type not valid. Must be one of [${Object.keys(
        authChoiceToType
      ).join("|")}]`
    );
    process.exit(1);
  }

  const root = path.resolve(projectName);
  const appName = path.basename(root);

  checkAppName(appName);
  fs.ensureDirSync(projectName);
  if (!isSafeToCreateProjectIn(root, projectName)) {
    process.exit(1);
  }
  console.log();
  // Yarn is required for Yarn workspaces (monorepo support)
  if (!shouldUseYarn()) {
    console.error(
      chalk.red(
        "Create Full Stack requires Yarn.\nPlease install Yarn. https://classic.yarnpkg.com/en/docs/install"
      )
    );
    process.exit(1);
  }
  console.log(`Creating a new full-stack app in ${chalk.green(root)}.`);
  console.log();

  await copyTemplate();

  installDependencies();

  if (tryGitInit(projectName)) {
    console.log();
    console.log("Initialized a git repository.");
  }
  // TODO: Generate local development initialization script ex. install postgres, sync-db, buildNodeServer etc.
  if (isNodeBackend) {
    buildNodeServer();
  }
  console.log();
  console.log(`Success! Created ${appName} at ${projectName}`);
  console.log();
  console.log("Happy hacking!");
}

if (projectName && program.backend) {
  run();
} else {
  program.outputHelp();
}
