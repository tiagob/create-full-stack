import { JSONSchemaForNPMPackageJsonFiles } from "@schemastore/package";
import chalk from "chalk";
import fs from "fs-extra";
import yaml from "js-yaml";
import os from "os";
import path from "path";
import sortPackageJson from "sort-package-json";

import { Auth, Backend, CloudPlatform } from "./constants";
import { runYarn } from "./utils";

// Don't include any local files. node_modules and yarn.lock will be different
// depending on what packages are included because yarn puts these at the root
// of the project
const excludeFiles = new Set(["node_modules", "build", "yarn.lock", "LICENSE"]);
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
  projectPath: string,
  silent = false,
  excludePathList: string[] = []
) {
  if (fs.existsSync(templatePath)) {
    fs.copySync(templatePath, projectPath, {
      filter: filterCopySyncWithExcludeList(excludePathList),
    });
  } else if (!silent) {
    console.error(
      `Could not locate supplied template: ${chalk.green(templatePath)}`
    );
  }
}

interface VSCodeLaunch {
  configurations: {
    type: string;
    request: string;
    name: string;
    url: string;
    webRoot: string;
    sourceMapPathOverrides: {
      [key: string]: string;
    };
  }[];
}

async function updateVSCodeLaunch({
  projectPath,
  hasWeb,
}: {
  projectPath: string;
  hasWeb: boolean;
}) {
  const { default: vscodeLaunch }: { default: VSCodeLaunch } = await import(
    path.join(projectPath, ".vscode/launch.json")
  );
  if (hasWeb) {
    vscodeLaunch.configurations.push({
      type: "chrome",
      request: "launch",
      name: "Chrome",
      url: "http://localhost:3000",
      // eslint-disable-next-line no-template-curly-in-string
      webRoot: "${workspaceFolder}/packages/web/src",
      sourceMapPathOverrides: {
        // eslint-disable-next-line no-template-curly-in-string
        "webpack:///packages/web/src/*": "${webRoot}/*",
      },
    });
  }
  fs.writeFileSync(
    path.join(projectPath, ".vscode/launch.json"),
    JSON.stringify(vscodeLaunch, undefined, 2) + os.EOL
  );
}

interface Command {
  name: string;
  command: string;
}

function getStartCommand(commands: Command[]) {
  return `concurrently -k -p "[{name}]" -c "grey.bold" -n "${commands
    .map((c) => c.name)
    .join(",")}" "${commands.map((c) => c.command).join('" "')}"`;
}

async function updatePackage({
  projectPath,
  backend,
  hasMobile,
  hasWeb,
}: {
  projectPath: string;
  backend: Backend;
  hasMobile: boolean;
  hasWeb: boolean;
}) {
  const appName = path.basename(projectPath);
  const {
    default: appPackage,
  }: { default: JSONSchemaForNPMPackageJsonFiles } = await import(
    path.join(projectPath, "package.json")
  );
  appPackage.name = appName;
  const commands: Command[] = [];
  commands.push({
    name: "Docker",
    command: "docker-compose up",
  });
  commands.push({
    name: "Generate",
    command: "yarn generate",
  });
  if (backend === Backend.apolloServerExpress) {
    commands.push({
      name: "Server",
      command: "yarn --cwd packages/server start",
    });
  }
  commands.push({
    name: "Build Common",
    command: "yarn --cwd packages/common watch",
  });
  if (hasMobile) {
    commands.push({
      name: "Mobile",
      command: "yarn --cwd packages/mobile start",
    });
  }
  if (hasWeb) {
    commands.push({
      name: "Web",
      command: "yarn --cwd packages/web start",
    });
  }
  appPackage.scripts = {
    ...appPackage.scripts,
    start: getStartCommand(commands),
  };
  fs.writeFileSync(
    path.join(projectPath, "package.json"),
    JSON.stringify(sortPackageJson(appPackage), undefined, 2) + os.EOL
  );
}

function toTitleCase(name: string) {
  return name
    .replace(
      /\w*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
    )
    .replace(/[^\dA-Za-z]+/g, " ");
}

async function updateAppJson(appName: string, projectPath: string) {
  const filePath = `${projectPath}/packages/mobile/app.json`;
  const { default: appJson } = await import(filePath);
  appJson.slug = appName;
  appJson.scheme = appName;
  appJson.name = toTitleCase(appName);
  fs.writeFileSync(filePath, JSON.stringify(appJson, undefined, 2));
}

interface PulumiProjectFile {
  name: string;
}

function updatePulumiProjectFile(appName: string, projectPath: string) {
  const filePath = `${projectPath}/packages/pulumi-aws/Pulumi.yaml`;
  const pulumiProjectFile = yaml.safeLoad(fs.readFileSync(filePath, "utf8"));
  if (typeof pulumiProjectFile !== "object") {
    return;
  }
  (pulumiProjectFile as PulumiProjectFile).name = appName;
  fs.writeFileSync(filePath, yaml.safeDump(pulumiProjectFile));
}

function recursiveFileFunc(
  dir: string,
  func: (dir: string, file: string) => void
) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      recursiveFileFunc(path.join(dir, file), func);
    } else {
      func(dir, file);
    }
  }
}

const fileExtToComment = {
  "\\.(ts|tsx)$": "//",
  "\\.(yml|yaml)$": "#",
};

// Adapted from CRA's on-eject
// https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/scripts/eject.js#L155-L164
function removeInFile(file: string, keys: string[]) {
  const fileExtTuple = Object.entries(fileExtToComment).find(([ext]) =>
    new RegExp(ext).test(file)
  );
  if (!fileExtTuple) {
    return;
  }
  const comment = fileExtTuple[1];
  let content = fs.readFileSync(file, "utf8");

  if (keys.length > 0) {
    if (
      content.match(new RegExp(`${comment} @remove-file-(${keys.join("|")})`))
    ) {
      fs.removeSync(file);
      return;
    }
    content = content.replace(
      new RegExp(
        `${comment} @remove-(${keys.join(
          "|"
        )})-begin([\\S\\s]*?)${comment} @remove-\\1-end\\n`,
        "gm"
      ),
      ""
    );
  }
  content = `${content
    .replace(new RegExp(`${comment} @remove-.*?\\n`, "gm"), "")
    .trim()}\n`;
  fs.writeFileSync(file, content);
}

function recursiveRemoveEmptyDir(dir: string) {
  let files = fs.readdirSync(dir);
  for (const file of files) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      recursiveRemoveEmptyDir(path.join(dir, file));
    }
  }

  // Files length can change after deletes so update this
  files = fs.readdirSync(dir);
  if (files.length === 0) {
    fs.removeSync(dir);
  }
}

export default async function copyTemplate(options: {
  appName: string;
  projectPath: string;
  backend: Backend;
  auth: Auth;
  template: string;
  cloudPlatform: CloudPlatform;
  hasMobile: boolean;
  hasWeb: boolean;
  hasGithubActions: boolean;
}) {
  const {
    appName,
    projectPath,
    template,
    cloudPlatform,
    hasMobile,
    hasWeb,
    hasGithubActions,
  } = options;

  const fullTemplate = `cfs-template-${template}`;

  runYarn(projectPath, ["add", fullTemplate]);
  const templatePath = path.dirname(
    require.resolve(path.join(fullTemplate, "package.json"), {
      paths: [projectPath],
    })
  );

  const excludeList = [];
  if (!hasMobile) {
    excludeList.push("mobile");
  }
  if (!hasWeb) {
    excludeList.push("web");
  }
  if (cloudPlatform !== CloudPlatform.aws) {
    excludeList.push("pulumi-aws");
  }
  copySync(templatePath, projectPath, false, excludeList);
  // ".gitignore" isn't included in "npm publish" so copy it over as gitignore
  // and rename (CRA does this)
  recursiveFileFunc(projectPath, (dir, file) => {
    if (/^gitignore$/.test(file)) {
      fs.renameSync(path.join(dir, file), path.join(dir, ".gitignore"));
    }
  });
  fs.renameSync(
    path.join(projectPath, "template.json"),
    path.join(projectPath, "package.json")
  );

  if (hasMobile) {
    updateAppJson(appName, projectPath);
  }
  if (cloudPlatform === CloudPlatform.aws) {
    updatePulumiProjectFile(appName, projectPath);
  }
  await updateVSCodeLaunch(options);
  await updatePackage(options);

  const removeBlockInFileKeys: string[] = [];
  if (!hasMobile) {
    removeBlockInFileKeys.push("mobile");
  }
  if (!hasWeb) {
    removeBlockInFileKeys.push("web");
  }
  if (!hasGithubActions) {
    removeBlockInFileKeys.push("github-actions");
  }
  recursiveFileFunc(projectPath, (dir, file) =>
    removeInFile(path.join(dir, file), removeBlockInFileKeys)
  );
  recursiveRemoveEmptyDir(projectPath);
}
