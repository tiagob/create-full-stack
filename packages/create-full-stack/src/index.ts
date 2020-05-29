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
import { buildNodeServer, installDependencies, runPrettier } from "./utils";

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

  const auth = authChoiceToType[(program.auth || "") as keyof AuthChoiceToType];
  await copyTemplate(
    root,
    program.backend,
    auth,
    Boolean(program.mobile),
    Boolean(program.web)
  );

  installDependencies(projectName);
  runPrettier(projectName);

  if (tryGitInit(projectName)) {
    console.log();
    console.log("Initialized a git repository.");
  }
  // TODO: Generate local development initialization script ex. install postgres, sync-db, buildNodeServer etc.
  if (isNodeBackend) {
    buildNodeServer(projectName);
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
