#!/usr/bin/env node

import chalk from "chalk";
import { execSync } from "child_process";
import commander from "commander";
import fs from "fs-extra";
import inquirer from "inquirer";
import isOnline from "is-online";
import open from "open";
import path from "path";
import semver from "semver";

import packageJson from "../package.json";
import {
  Auth,
  authChoices,
  auths,
  Backend,
  backends,
  Cicd,
  cicds,
  Cloud,
  cloudPlatformChoices,
  cloudPlatforms,
  Mobile,
  mobileStacks,
  nodeBackends,
  Web,
  webStacks,
} from "./constants";
import copyTemplate from "./copyTemplate";
import {
  checkAppName,
  isSafeToCreateProjectIn,
  shouldUseYarn,
  tryGitInit,
} from "./createReactAppUtils";
import { runYarn } from "./utils";

let projectName: string | undefined;

interface Program extends commander.Command {
  backend?: string;
  authentication?: string;
  cloud?: string;
  web?: string;
  mobile?: string;
  cicd?: string;
}

const program: Program = new commander.Command(packageJson.name)
  .version(packageJson.version)
  .arguments("[project-directory]")
  .usage(`${chalk.green("[project-directory]")} [options]`)
  .action((name) => {
    projectName = name;
  })
  .option(
    "-b, --backend <backend>",
    `specify a backend for the project [${backends.join("|")}]`
  )
  .option(
    "-a, --authentication <authentication>",
    `specify authentication for the project [${auths.join("|")}]`
  )
  .option(
    "-c, --cloud <cloud>",
    `specify a cloud platform for the project [${cloudPlatforms.join("|")}]`
  )
  .option(
    "-w, --web <cloud>",
    `specify a web stack for the project [${webStacks.join("|")}]`
  )
  .option(
    "-m, --mobile <mobile>",
    `specify a mobile stack for the project [${mobileStacks.join("|")}]`
  )
  .option(
    "-d, --cicd <cicd>",
    `specify a CI/CD for the project [${cicds.join("|")}]`
  );
program.parse(process.argv);

function resolveHome(filepath: string) {
  if (filepath[0] === "~" && process.env.HOME) {
    return path.join(process.env.HOME, filepath.slice(1));
  }
  return filepath;
}

async function optionOrPropmt<T>(options: {
  choices: (T | { name: string; value: T })[];
  programValue: T | string | undefined;
  message: string;
  default: string;
}): Promise<T> {
  const { choices, programValue, message } = options;
  if (
    programValue &&
    choices.find(
      (val) =>
        val === programValue ||
        (typeof val === "object" &&
          (val as { name: string; value: T }).value === programValue)
    ) !== undefined
  ) {
    return programValue as T;
  }
  const answer = await inquirer.prompt({
    type: "list",
    choices,
    name: "value",
    message,
    // default can't be destructured
    default: options.default,
  });
  return answer.value;
}

async function run() {
  // Inquirer prompt can run into the create-full-stack installation.
  console.log();

  if (process.platform === "win32") {
    console.error("Sorry, Windows isn't currently supported.");
    console.log();
    console.log(
      "If you'd like this feature, please +1 https://github.com/tiagob/create-full-stack/issues/146. In the meantime try using WSL (https://docs.microsoft.com/en-us/windows/wsl/)."
    );
    console.log();
    process.exit(1);
  }

  if (!projectName) {
    const projectNameAnswer = await inquirer.prompt({
      name: "value",
      message: "What would you like to name your project?",
      default: "my-full-stack",
    });
    projectName = resolveHome(projectNameAnswer.value as string);
  }
  const projectPath = path.resolve(projectName);
  const appName = path.basename(projectPath);
  checkAppName(appName);
  if (!isSafeToCreateProjectIn(projectPath, projectName)) {
    process.exit(1);
  }
  const latest = execSync("yarn info create-full-stack")
    .toString()
    .match(/latest: '(.*?)'/)?.[1];
  if (latest && semver.lt(packageJson.version, latest)) {
    console.log();
    console.error(
      chalk.red(
        `You are running \`create-full-stack\` ${packageJson.version}, which is behind the latest release (${latest}).\n\n` +
          `Run \`yarn create full-stack <project-directory>\` to ensure you're using the latest version`
      )
    );
    console.log();
    process.exit(1);
  }
  // Yarn is required for Yarn workspaces (monorepo support)
  if (!shouldUseYarn()) {
    console.log();
    console.error(
      chalk.red(
        "Create Full Stack requires Yarn.\nPlease install Yarn. https://classic.yarnpkg.com/en/docs/install"
      )
    );
    console.log();
    process.exit(1);
  }

  // Which template should be used?
  const backend = await optionOrPropmt({
    choices: backends,
    programValue: program.backend,
    message: `Which backend? ${chalk.grey(
      "(https://create-full-stack.com/docs/backend)"
    )}`,
    default: Backend.hasura,
  });
  const auth = await optionOrPropmt({
    choices: authChoices,
    programValue: program.authentication,
    message: `Which auth method? ${chalk.grey(
      "(https://create-full-stack.com/docs/auth)"
    )}`,
    default: Auth.none,
  });
  // What packages should be included/ignored in the template?
  const cloud = await optionOrPropmt({
    choices: cloudPlatformChoices,
    programValue: program.cloud,
    message: `Which cloud platform? ${chalk.grey(
      "(https://create-full-stack.com/docs/cloud)"
    )}`,
    default: Cloud.none,
  });
  const web = await optionOrPropmt({
    choices: webStacks,
    programValue: program.web,
    message: `Which web stack? ${chalk.grey(
      "(https://create-full-stack.com/docs/web)"
    )}`,
    default: Web.none,
  });
  const mobile = await optionOrPropmt({
    choices: mobileStacks,
    programValue: program.mobile,
    message: `Which mobile stack? ${chalk.grey(
      "(https://create-full-stack.com/docs/mobile)"
    )}`,
    default: Mobile.none,
  });
  const cicd = await optionOrPropmt({
    choices: cicds,
    programValue: program.cicd,
    message: `Include GitHub Actions CI/CD? ${chalk.grey(
      "(~5m of setup) (https://create-full-stack.com/docs/cicd)"
    )}`,
    default: Cicd.none,
  });

  fs.ensureDirSync(projectName);
  console.log();
  console.log(`Creating a new full-stack app in ${chalk.green(projectPath)}.`);
  console.log();

  if (!(await isOnline())) {
    console.log(chalk.yellow("You appear to be offline."));
    console.log();
  }

  await copyTemplate({
    appName,
    projectPath,
    backend,
    auth,
    cloud,
    mobile,
    web,
    cicd,
  });

  console.log(`Installing packages using yarn...`);
  console.log();
  // This also, uninstalls the template
  try {
    runYarn(projectName);
  } catch (error) {
    console.log();
    console.log(
      "First install attempt failed. Likely https://github.com/yarnpkg/yarn/issues/2629. Trying again."
    );
    console.log();
    runYarn(projectName);
  }

  console.log("Building common...");
  console.log();
  runYarn(path.join(projectName, "packages/common"), ["build"]);
  if (nodeBackends.has(backend)) {
    console.log("Building the node server...");
    console.log();
    runYarn(path.join(projectName, "packages/server"), ["build"]);
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

  console.clear();
  console.log(`Success! Created ${appName} at ${projectName}`);
  console.log();
  console.log("Complete the steps on development.html to get started.");
  open(`${projectName}/development.html`);
  console.log();
  console.log("Happy hacking!");
}

run();
