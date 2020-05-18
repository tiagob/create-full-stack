import chalk from "chalk";
import commander from "commander";
import spawn from "cross-spawn";
import fs from "fs-extra";
import path from "path";

import packageJson from "../package.json";
import {
  checkAppName,
  isSafeToCreateProjectIn,
  shouldUseYarn,
  tryGitInit,
} from "./createReactAppUtils";

const backends = ["apollo", "hasura", "firestore"];
const nodeBackends = new Set(["apollo"]);
// TODO: Add auth0
const auths = {
  firebase: "firebase-auth",
  google: "google-auth",
  "": "no-auth",
};

let projectName = "";

interface Program extends commander.Command {
  backend?: string;
  web?: boolean;
  mobile?: boolean;
  auth?: string;
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
  .option("-a, --auth <auth>", `auth type [${Object.keys(auths).join("|")}]`)
  .parse(process.argv);

// Don't include any local files. node_modules and yarn.lock will be different
// depending on what packages are included because yarn puts these at the root
// of the project
const excludeFiles = new Set(["node_modules", "build", "yarn.lock"]);
function filterCopySync(src: string): boolean {
  const fileOrFolder = path.basename(src);
  return !excludeFiles.has(fileOrFolder);
}

function copySync(templatePath: string, appPath: string, silent = false): void {
  fs.ensureDirSync(templatePath);
  if (fs.existsSync(templatePath)) {
    fs.copySync(templatePath, appPath, { filter: filterCopySync });
  } else if (!silent) {
    console.error(
      `Could not locate supplied template: ${chalk.green(templatePath)}`
    );
  }
}

function copyTemplate(): void {
  // Copy root package.json for Yarn workspaces
  fs.copySync("./templates/package.json", `${projectName}/package.json`);
  fs.copySync("./templates/gitignore", `${projectName}/.gitignore`);

  // TODO: Cleanup typing
  const auth = auths[(program.auth || "") as "firebase" | "google" | ""];
  copySync(
    `./templates/backend/${program.backend}/${auth}`,
    nodeBackends.has(program.backend || "")
      ? `${projectName}/packages/backend`
      : `${projectName}/${program.backend}`
  );

  if (program.web || program.mobile) {
    copySync(
      `./templates/common/${program.backend}`,
      `${projectName}/packages/common`,
      true
    );
  }

  if (program.web) {
    copySync(
      `./templates/web/${program.backend}/${auth}`,
      `${projectName}/packages/web`
    );
  }

  if (program.mobile) {
    copySync(
      `./templates/mobile/${program.backend}/${auth}`,
      `${projectName}/packages/mobile`
    );
  }
}

function installDependencies(): void {
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

function run(): void {
  // Validation
  // TODO: Add Cloud Run for hasura handlers (event triggers or actions, crons?)
  if (!backends.includes(program.backend || "")) {
    console.error(
      `Specified backend-type not valid. Must be one of [${backends.join("|")}]`
    );
    process.exit(1);
  }
  if (program.auth && !(program.auth in auths)) {
    console.error(
      `Specified auth-type not valid. Must be one of [${Object.keys(auths).join(
        "|"
      )}]`
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

  copyTemplate();

  installDependencies();

  if (tryGitInit(projectName)) {
    console.log();
    console.log("Initialized a git repository.");
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
