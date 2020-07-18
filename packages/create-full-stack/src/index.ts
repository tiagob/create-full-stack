#!/usr/bin/env node

import chalk from "chalk";
import commander from "commander";
import fs from "fs-extra";
import inquirer from "inquirer";
import path from "path";

import packageJson from "../package.json";
import {
  Auth,
  auths,
  Backend,
  backends,
  getTemplateTypeKey,
  nodeBackends,
  TemplateToTypes,
  templateToTypes,
  typesToTemplate,
} from "./constants";
import copyTemplate from "./copyTemplate";
import {
  checkAppName,
  isSafeToCreateProjectIn,
  shouldUseYarn,
  tryGitInit,
} from "./createReactAppUtils";
import { checkPulumiAndAws, runYarn } from "./utils";

let projectName = "";

interface Program extends commander.Command {
  template?: string;
  web?: boolean;
  mobile?: boolean;
}

const program: Program = new commander.Command(packageJson.name)
  .version(packageJson.version)
  .arguments("<project-directory>")
  .usage(`${chalk.green("<project-directory>")} [options]`)
  .action((name) => {
    projectName = name;
  })
  .option(
    "-t, --template <template>",
    "specify a template for the created project"
  )
  .parse(process.argv);

async function run() {
  // Which template should be used?
  let { template } = program;
  let backend: Backend = Backend.hasura;
  let auth: Auth = Auth.none;
  if (!template || !(template in templateToTypes)) {
    const backendAnswer = await inquirer.prompt({
      type: "list",
      choices: backends,
      name: "backend",
      message: "Which backend?",
      default: Backend.hasura,
    });
    backend = backendAnswer.backend;
    const authAnswer = await inquirer.prompt({
      type: "list",
      choices: auths,
      name: "auth",
      message: "Which auth method?",
      default: Auth.none,
    });
    auth = authAnswer.auth;
    template =
      typesToTemplate[
        getTemplateTypeKey({
          backend,
          auth,
        })
      ];
  } else {
    const templateTypes = templateToTypes[template as keyof TemplateToTypes];
    backend = templateTypes.backend;
    auth = templateTypes.auth;
  }
  // What packages should be included/ignored in the template?
  const hasPulumiAwsAnswer = await inquirer.prompt({
    type: "confirm",
    name: "hasPulumiAws",
    message:
      "Include Pulumi infrastructure as code (IAC) for AWS deployment? This requires the Pulumi and AWS CLIs.",
  });
  const { hasPulumiAws } = hasPulumiAwsAnswer;
  let hasGithubActions = false;
  if (hasPulumiAws) {
    // Error as soon as possible if pulumi and aws aren't installed.
    checkPulumiAndAws();
    const hasGithubActionsAnswer = await inquirer.prompt({
      type: "confirm",
      name: "hasGithubActions",
      message: "Include GitHub Actions CI/CD?",
    });
    hasGithubActions = hasGithubActionsAnswer.hasGithubActions;
  }
  const hasWebAnswer = await inquirer.prompt({
    type: "confirm",
    name: "hasWeb",
    message: "Include a React website?",
  });
  const { hasWeb } = hasWebAnswer;
  const hasMobileAnswer = await inquirer.prompt({
    type: "confirm",
    name: "hasMobile",
    message: "Include a React Native iOS and Android app?",
  });
  const { hasMobile } = hasMobileAnswer;

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

  await copyTemplate({
    projectPath,
    backend,
    auth,
    template,
    hasMobile,
    hasWeb,
    hasPulumiAws,
    hasGithubActions,
  });

  console.log(`Installing packages using yarnpkg...`);
  console.log();
  // Also, uninstalls the template
  runYarn(projectName);

  console.log("Formatting files...");
  console.log();
  runYarn(projectName, ["prettier"]);
  runYarn(projectName, ["lint"]);

  if (tryGitInit(projectName)) {
    console.log();
    console.log("Initialized a git repository.");
    console.log();
  }
  // TODO: Generate local development initialization script ex. install postgres, sync-db, buildNodeServer etc.
  if (nodeBackends.has(backend)) {
    console.log("Building the node server...");
    console.log();
    runYarn(path.join(projectName, "packages/server"), ["build"]);
  }
  if (hasMobile || hasWeb) {
    console.log("Building common...");
    console.log();
    runYarn(path.join(projectName, "packages/common"), ["build"]);
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

run();
