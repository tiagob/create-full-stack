import chalk from "chalk";
import commander from "commander";
import fs from "fs-extra";
import path from "path";

import packageJson from "../package.json";
import { checkAppName, isSafeToCreateProjectIn } from "./createReactAppUtils";

const backends = ["apollo", "hasura", "firestore"];
// TODO: Add auth0
const auths = {
  firebase: "firebase-auth",
  google: "google-auth",
  "": "no-auth"
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

function copySync(templatePath: string, appPath: string, silent = false): void {
  fs.ensureDirSync(templatePath);
  if (fs.existsSync(templatePath)) {
    fs.copySync(templatePath, appPath);
  } else if (!silent) {
    console.error(
      `Could not locate supplied template: ${chalk.green(templatePath)}`
    );
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

  console.log(`Creating a new full-stack app in ${chalk.green(root)}.`);
  console.log();

  // TODO: Cleanup typing
  const auth = auths[(program.auth || "") as "firebase" | "google" | ""];
  copySync(
    `./templates/backend/${program.backend}/${auth}`,
    `${projectName}/backend`
  );

  if (program.web || program.mobile) {
    copySync(
      `./templates/common/${program.backend}`,
      `${projectName}/common`,
      true
    );
  }

  if (program.web) {
    copySync(
      `./templates/web/${program.backend}/${auth}`,
      `${projectName}/web`
    );
  }

  if (program.mobile) {
    copySync(
      `./templates/mobile/${program.backend}/${auth}`,
      `${projectName}/mobile`
    );
  }
}

if (projectName && program.backend) {
  run();
} else {
  program.outputHelp();
}
