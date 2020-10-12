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
  // Wait for hasura to come up by pinging the health check handler
  // https://hasura.io/docs/1.0/graphql/core/api-reference/health.html
  const waitOnHasura =
    backend === Backend.hasura
      ? "wait-on http-get://localhost:8080/healthz && "
      : "";
  if (!appPackage.devDependencies) {
    appPackage.devDependencies = {};
  }
  appPackage.devDependencies["wait-on"] = "^5.2.0";
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
      // Wait for Hasura to come up otherwise it can't generate the schema
      // and doesn't retry.
      command: `${waitOnHasura}yarn generate --watch`,
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
      // Wait for "Generate" and "Build Common" commands to run otherwise web
      // compilation fails and doesn't recover.
      // Don't open the browser because it doesn't work right away and needs to
      // be refreshed when run in concurrently.
      command: `${waitOnHasura}BROWSER=none yarn --cwd packages/web start`,
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

/**
 * Remove "cfs-pulumi-expo" package if the generated project doesn't include mobile
 */
async function updatePulumiAwsPackage({
  projectPath,
  hasMobile,
}: {
  projectPath: string;
  hasMobile: boolean;
}) {
  if (hasMobile) {
    return;
  }
  const pulumiAwsPackagePath = path.join(
    projectPath,
    "packages/pulumi-aws/package.json"
  );
  const {
    default: pulumiAwsPackage,
  }: { default: JSONSchemaForNPMPackageJsonFiles } = await import(
    pulumiAwsPackagePath
  );
  if (pulumiAwsPackage.dependencies) {
    delete pulumiAwsPackage.dependencies["cfs-pulumi-expo"];
  }
  fs.writeFileSync(
    pulumiAwsPackagePath,
    JSON.stringify(sortPackageJson(pulumiAwsPackage), undefined, 2) + os.EOL
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
  appJson.expo.slug = appName;
  appJson.expo.scheme = appName;
  appJson.expo.name = toTitleCase(appName);
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

function replaceStepNumbers(mdSetup: string) {
  let stepNumber = 0;
  const incrementStepNumbers = () => {
    stepNumber += 1;
    return stepNumber.toString();
  };
  return mdSetup.replace(/{STEP_NUMBER}/g, incrementStepNumbers);
}

function generateSetupMdAndHtml(
  mdFile: string,
  htmlFile: string,
  appName: string,
  hasProductionMd: boolean
) {
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

  let mdContent = fs.readFileSync(mdFile, "utf8");
  mdContent = replaceStepNumbers(mdContent);
  mdContent = mdContent.replace(/{APP_NAME}/g, appName);
  // Copy to replace links to related docs (ex. DEVELOPMENT.md, production.html)
  // with the corresponding file extension
  const htmlContent = mdContent.slice();

  fs.writeFileSync(
    mdFile,
    mdContent
      .replace(/{PRODUCTION_FILENAME}/g, "PRODUCTION.md")
      .replace(/{DEVELOPMENT_FILENAME}/g, "DEVELOPMENT.md")
  );
  fs.writeFileSync(
    htmlFile,
    // Add CSS and padding. Using React feels too heavy for something this simple
    `
<html>
  <head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" integrity="sha384-HSMxcRTRxnN+Bdg0JdbxYKrThecOKuH5zCYotlSAcp1+c8xmyTe9GYg1l9a69psu" crossorigin="anonymous" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.2.0/build/styles/default.min.css">
  </head>
  <body>
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="collapse navbar-collapse">
          <ul class="nav navbar-nav">
            <li class="${
              htmlFile.endsWith("readme.html") ? "active" : ""
            }"><a href="readme.html">Readme</a></li>
            <li class="${
              htmlFile.endsWith("development.html") ? "active" : ""
            }"><a href="development.html">Development</a></li>
            ${
              hasProductionMd
                ? `<li class="${
                    htmlFile.endsWith("production.html") ? "active" : ""
                  }"><a href="production.html">Production</a></li>`
                : ""
            }
          </ul>
        </div>
      </div>
    </nav>
    <div style="margin: 0 40px 40px 40px;">
      ${md.render(
        htmlContent
          .replace(/{PRODUCTION_FILENAME}/g, "production.html")
          .replace(/{DEVELOPMENT_FILENAME}/g, "development.html")
      )}
    </div>
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
    runYarn(projectPath, ["add", fullTemplate]);
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
  fs.renameSync(
    path.join(projectPath, "template.DEVELOPMENT.md"),
    path.join(projectPath, "DEVELOPMENT.md")
  );
  if (cloudPlatform !== CloudPlatform.none) {
    fs.renameSync(
      path.join(projectPath, "template.PRODUCTION.md"),
      path.join(projectPath, "PRODUCTION.md")
    );
  } else {
    fs.removeSync(path.join(projectPath, "template.PRODUCTION.md"));
  }

  if (hasMobile) {
    updateAppJson(appName, projectPath);
  }
  if (cloudPlatform === CloudPlatform.aws) {
    updatePulumiProjectFile(appName, projectPath);
    await updatePulumiAwsPackage(options);
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

  // Generate html after code blocks have been removed
  const hasProductionMd = fs.existsSync(
    path.join(projectPath, "PRODUCTION.md")
  );
  generateSetupMdAndHtml(
    path.join(projectPath, "README.md"),
    path.join(projectPath, "readme.html"),
    appName,
    hasProductionMd
  );
  generateSetupMdAndHtml(
    path.join(projectPath, "DEVELOPMENT.md"),
    path.join(projectPath, "development.html"),
    appName,
    hasProductionMd
  );
  if (hasProductionMd) {
    generateSetupMdAndHtml(
      path.join(projectPath, "PRODUCTION.md"),
      path.join(projectPath, "production.html"),
      appName,
      hasProductionMd
    );
  }
}
