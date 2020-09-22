import { JSONSchemaForNPMPackageJsonFiles } from "@schemastore/package";
import chalk from "chalk";
import fs from "fs-extra";
import hljs from "highlight.js";
import yaml from "js-yaml";
import markdownIt from "markdown-it";
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

function templateCopySync(
  templatePath: string,
  projectPath: string,
  excludePathList: string[] = []
) {
  if (fs.existsSync(templatePath)) {
    fs.copySync(templatePath, projectPath, {
      filter: filterCopySyncWithExcludeList(excludePathList),
    });
  } else {
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

function getConcurrentlyScript(commands: Command[], args: string[] = []) {
  return `concurrently ${
    args.length > 0 ? `${args.join(" ")} ` : ""
  }-p "[{name}]" -c "grey.bold" -n "${commands
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
  // Cannot include "graphql-codegen" because that requires Hasura running (when
  // Hasura is selected as the BE). The build command is used in CI/CD for setup.
  // GitHub actions cannot run Hasura.
  const buildCommands = ["yarn --cwd packages/common build"];
  const startCommands: Command[] = [
    {
      name: "Docker",
      command: "docker-compose up",
    },
    {
      name: "Generate",
      command: "yarn generate --watch",
    },
    {
      name: "Build Common",
      command: "yarn --cwd packages/common watch",
    },
  ];
  const testCommands: Command[] = [];
  if (backend === Backend.apolloServerExpress) {
    buildCommands.push("yarn --cwd packages/server build");
    startCommands.push({
      name: "Server",
      command: "yarn --cwd packages/server start",
    });
    testCommands.push({
      name: "Server",
      command: "yarn --cwd packages/server test --ci --watchAll=false",
    });
  }
  if (hasMobile) {
    startCommands.push({
      name: "Mobile",
      // --non-interactive included to print out the DevTools url
      // "Expo DevTools is running at http://localhost:19002"
      command: "yarn --cwd packages/mobile start --non-interactive",
    });
    testCommands.push({
      name: "Mobile",
      command: "yarn --cwd packages/mobile test --ci --watchAll=false",
    });
  }
  if (hasWeb) {
    buildCommands.push("yarn --cwd packages/web build");
    startCommands.push({
      name: "Web",
      // Don't open the browser because it doesn't work right away and needs to
      // be refreshed when run in concurrently
      command: "BROWSER=none yarn --cwd packages/web start",
    });
    testCommands.push({
      name: "Web",
      command: "yarn --cwd packages/web test --ci --watchAll=false",
    });
  }
  appPackage.scripts = {
    ...appPackage.scripts,
    build: buildCommands.join(" && "),
    // Run `docker-compose up --no-start` first to create the docker images
    // before starting the dependent platforms
    start: `docker-compose up --no-start && ${getConcurrentlyScript(
      startCommands
    )}`,
    test:
      testCommands.length > 0
        ? getConcurrentlyScript(testCommands)
        : "echo No tests.",
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
  "\\.md$": "<!--",
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
        ` *${comment} @remove-(${keys.join(
          "|"
        )})-begin[\\S\\s]*?${comment} @remove-\\1-end.*?\\n`,
        "gm"
      ),
      ""
    );
  }
  content = `${content
    .replace(new RegExp(` *${comment} @remove-.*?\\n`, "gm"), "")
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

function generateSetupHtml(projectPath: string) {
  const md = markdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight(str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value;
        } catch (error) {
          // Pass through
        }
      }

      return ""; // Use external default escaping
    },
  });
  fs.writeFileSync(
    path.join(projectPath, "setup.html"),
    // Add CSS and padding. Using React feels too heavy for something this simple
    `
<html>
  <head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/bootstrap/3.2.0/css/bootstrap.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.2.0/build/styles/default.min.css">
  </head>
  <body style="padding: 40px;">
    ${md.render(fs.readFileSync(path.join(projectPath, "README.md"), "utf8"))}
  </body>
</html>
`
  );
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
  if (!hasGithubActions) {
    excludeList.push(".github", ".pulumi");
  }

  // Use a local template if in this create-full-stack yarn workspace
  let templatePath: string;
  let packageTemplatePath: string | undefined;
  try {
    packageTemplatePath = require.resolve(
      path.join(fullTemplate, "package.json")
    );
  } catch (error) {
    if (error.code !== "MODULE_NOT_FOUND") {
      throw error;
    }
  }
  if (packageTemplatePath) {
    templatePath = path.dirname(packageTemplatePath);
  } else {
    try {
      runYarn(projectPath, ["add", fullTemplate]);
    } catch (error) {
      console.error(
        `An error occurred running \`yarn add ${fullTemplate}\`:`,
        error.code,
        error
      );
      if (error.code === "ENOENT") {
        // Re-run yarn install if it throws an "ENOENT" error
        // It's likely https://github.com/tiagob/create-full-stack/issues/123
        // Unfortunately, this is a long existing issue with yarn
        // https://github.com/yarnpkg/yarn/issues/4563
        // https://github.com/yarnpkg/yarn/issues/2629
        runYarn(projectPath, ["add", fullTemplate]);
      } else {
        throw error;
      }
    }
    templatePath = path.dirname(
      require.resolve(path.join(fullTemplate, "package.json"), {
        paths: [projectPath],
      })
    );
  }
  templateCopySync(templatePath, projectPath, excludeList);

  // ".gitignore" isn't included in "npm publish" so copy it over as gitignore
  // and rename (CRA does this)
  recursiveFileFunc(projectPath, (dir, file) => {
    if (/^gitignore$/.test(file)) {
      fs.renameSync(path.join(dir, file), path.join(dir, ".gitignore"));
    }
  });
  fs.renameSync(
    path.join(projectPath, "template.package.json"),
    path.join(projectPath, "package.json")
  );
  fs.renameSync(
    path.join(projectPath, "template.README.md"),
    path.join(projectPath, "README.md")
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
  if (cloudPlatform !== CloudPlatform.aws) {
    removeBlockInFileKeys.push("pulumi-aws");
  } else {
    removeBlockInFileKeys.push("manual-config");
  }
  if (!hasGithubActions) {
    removeBlockInFileKeys.push("github-actions");
  }
  if (process.platform !== "darwin") {
    removeBlockInFileKeys.push("mac");
  }
  recursiveFileFunc(projectPath, (dir, file) =>
    removeInFile(path.join(dir, file), removeBlockInFileKeys)
  );
  recursiveRemoveEmptyDir(projectPath);

  // Generate setup.html after code blocks have been removed from the README.md
  generateSetupHtml(projectPath);
}
