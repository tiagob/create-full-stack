#!/usr/bin/env node

import chalk from "chalk";
import commander from "commander";
import fs from "fs-extra";
import path from "path";

import packageJson from "../package.json";
import {
  AuthChoiceToType,
  authChoiceToType,
  Backend,
  backends,
  nodeBackends,
} from "./constants";
import copyTemplate from "./copyTemplate";
import {
  checkAppName,
  isSafeToCreateProjectIn,
  shouldUseYarn,
  tryGitInit,
} from "./createReactAppUtils";
import { runYarn } from "./utils";

let projectName = "";

interface Program extends commander.Command {
  backend?: Backend;
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

  const projectPath = path.resolve(projectName);
  const appName = path.basename(projectPath);

  checkAppName(appName);
  fs.ensureDirSync(projectName);
  if (!isSafeToCreateProjectIn(projectPath, projectName)) {
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
  console.log(`Creating a new full-stack app in ${chalk.green(projectPath)}.`);
  console.log();

  const auth = authChoiceToType[(program.auth || "") as keyof AuthChoiceToType];
  await copyTemplate({
    projectPath,
    backend: program.backend,
    auth,
    hasMobile: Boolean(program.mobile),
    hasWeb: Boolean(program.web),
  });

  console.log(`Installing packages using yarnpkg...`);
  console.log();
  // Also, uninstalls the template
  runYarn(projectName);

  runYarn(projectName, ["prettier"]);

  if (tryGitInit(projectName)) {
    console.log();
    console.log("Initialized a git repository.");
  }
  // TODO: Generate local development initialization script ex. install postgres, sync-db, buildNodeServer etc.
  if (isNodeBackend) {
    console.log(`Building the node server...`);
    console.log();
    runYarn(path.join(projectName, "packages/server"), ["build"]);
  }

  // Display the most elegant way to cd.
  // This needs to handle an undefined originalDirectory for
  // backward compatibility with old global-cli's.
  const originalDirectory = process.cwd();
  let cdpath;
  if (
    originalDirectory &&
    path.join(originalDirectory, appName) === projectPath
  ) {
    cdpath = appName;
  } else {
    cdpath = projectPath;
  }
  console.log();
  console.log(`Success! Created ${appName} at ${projectName}`);
  console.log();
  console.log("We suggest that you begin by typing:");
  console.log();
  console.log(chalk.cyan("  cd"), cdpath);
  console.log(`  ${chalk.cyan("yarn watch")}`);
  console.log();
  console.log("Happy hacking!");
}

if (projectName && program.backend) {
  run();
} else {
  program.outputHelp();
}
