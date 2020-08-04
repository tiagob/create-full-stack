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
  CloudPlatform,
  cloudPlatforms,
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
  );

program.exitOverride();
try {
  program.parse(process.argv);
} catch (error) {
  console.log();
  if (error.code === "commander.missingArgument") {
    console.error("Please specify the project directory:");
    console.log(
      `  ${chalk.cyan(program.name())} ${chalk.green("<project-directory>")}`
    );
    console.log();
    console.log("For example:");
    console.log(
      `  ${chalk.cyan(program.name())} ${chalk.green("my-full-stack")}`
    );
    console.log();
    console.log(
      `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
    );
  }
  process.exit(1);
}

async function run() {
  const projectPath = path.resolve(projectName);
  const appName = path.basename(projectPath);
  checkAppName(appName);
  if (!isSafeToCreateProjectIn(projectPath, projectName)) {
    process.exit(1);
  }

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
  const cloudPlatformAnswer = await inquirer.prompt({
    type: "list",
    choices: cloudPlatforms,
    name: "cloudPlatform",
    message:
      "Which cloud platform? (Requires Pulumi CLI, https://www.pulumi.com/)",
    default: CloudPlatform.none,
  });
  const { cloudPlatform } = cloudPlatformAnswer;
  if (cloudPlatform !== CloudPlatform.none) {
    // Error as soon as possible if pulumi and aws aren't installed.
    checkPulumiAndAws();
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
  let hasGithubActions = false;
  if (cloudPlatform !== CloudPlatform.none) {
    const hasGithubActionsAnswer = await inquirer.prompt({
      type: "confirm",
      name: "hasGithubActions",
      message: "Include GitHub Actions CI/CD?",
    });
    hasGithubActions = hasGithubActionsAnswer.hasGithubActions;
  }

  fs.ensureDirSync(projectName);
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
    appName,
    projectPath,
    backend,
    auth,
    template,
    cloudPlatform,
    hasMobile,
    hasWeb,
    hasGithubActions,
  });

  console.log(`Installing packages using yarnpkg...`);
  console.log();
  // Also, uninstalls the template
  runYarn(projectName);

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

  console.log("Formatting files...");
  console.log();
  runYarn(projectName, ["prettier"]);
  // Running eslint requires that common is built so imports resolve
  runYarn(projectName, ["lint"]);

  if (tryGitInit(projectName)) {
    console.log();
    console.log("Initialized a git repository.");
    console.log();
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
  console.log(
    `Follow steps on ${cdpath}/README.md#setup to complete the configuration`
  );
  // TODO: Automate manual setup steps
  // console.log("We suggest that you begin by typing:");
  // console.log();
  // console.log(chalk.cyan("  cd"), cdpath);
  // console.log(`  ${chalk.cyan("yarn start")}`);
  console.log();
  console.log("Happy hacking!");
}

run();
