import { JSONSchemaForNPMPackageJsonFiles } from "@schemastore/package";
import chalk from "chalk";
import fs from "fs-extra";
import yaml from "js-yaml";
import os from "os";
import path from "path";
import sortPackageJson from "sort-package-json";

import { Auth, Backend } from "./constants";
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

const templateToGraphqlSchema = {
  [Backend.apolloServerExpress]: {
    [Auth.none]: "packages/server/src/graphql/schema.ts",
    [Auth.auth0]: "packages/server/src/graphql/schema.ts",
  },
  [Backend.hasura]: {
    [Auth.none]: "http://localhost:8080/v1/graphql",
    [Auth.auth0]: [
      {
        "http://localhost:8080/v1/graphql": {
          headers: { "x-hasura-admin-secret": "myadminsecretkey" },
        },
      },
    ],
  },
};

function addApolloCodegen({
  projectPath,
  backend,
  auth,
  hasMobile,
  hasWeb,
}: {
  projectPath: string;
  backend: Backend;
  auth: Auth;
  hasMobile: boolean;
  hasWeb: boolean;
}) {
  fs.writeFileSync(
    `${projectPath}/codegen.yml`,
    yaml.safeDump({
      schema: templateToGraphqlSchema[backend][auth],
      hooks: {
        afterOneFileWrite: ["prettier --write", "eslint --fix"],
      },
      generates: {
        ...(backend === Backend.apolloServerExpress && {
          "packages/server/src/graphql/__generated__/index.ts": {
            plugins: ["typescript", "typescript-resolvers"],
            config: {
              useIndexSignature: true,
              namingConvention: {
                typeNames: "pascal-case#pascalCase",
                transformUnderscore: true,
              },
            },
          },
        }),
        ...((hasMobile || hasWeb) && {
          "packages/common/src/graphql/__generated__/index.ts": {
            documents: "packages/common/src/graphql/*.graphql",
            plugins: [
              "typescript",
              "typescript-operations",
              "typescript-react-apollo",
            ],
            config: {
              withHOC: false,
              withComponent: false,
              withHooks: true,
              namingConvention: {
                typeNames: "pascal-case#pascalCase",
                transformUnderscore: true,
              },
            },
          },
        }),
      },
    })
  );
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
  color: string;
  command: string;
}

function getWatchCommand(commands: Command[]) {
  return `concurrently -k -p "[{name}]" -n "${commands
    .map((c) => c.name)
    .join(",")}" -c "${commands.map((c) => c.color).join(",")}" "${commands
    .map((c) => c.command)
    .join('" "')}"`;
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
    name: "Generate",
    color: "magenta.bold",
    command: "yarn generate",
  });
  if (backend === Backend.apolloServerExpress) {
    commands.push({
      name: "Server",
      color: "green.bold",
      command: "yarn --cwd packages/server watch",
    });
  }
  if (hasMobile || hasWeb) {
    commands.push({
      name: "Build Common",
      color: "yellow.bold",
      command: "yarn --cwd packages/common watch",
    });
  }
  if (hasMobile) {
    commands.push({
      name: "Mobile",
      color: "white.bold",
      command: "yarn --cwd packages/mobile start",
    });
  }
  if (hasWeb) {
    commands.push({
      name: "Web",
      color: "cyan.bold",
      command: "yarn --cwd packages/web start",
    });
  }
  appPackage.scripts = {
    ...appPackage.scripts,
    watch: getWatchCommand(commands),
  };
  fs.writeFileSync(
    path.join(projectPath, "package.json"),
    JSON.stringify(sortPackageJson(appPackage), undefined, 2) + os.EOL
  );
}

function recursiveFileFunc(
  dir: string,
  src: RegExp,
  func: (dir: string, file: string) => void
) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      recursiveFileFunc(path.join(dir, file), src, func);
    } else if (src.test(file)) {
      func(dir, file);
    }
  }
}

// Adapted from CRA's on-eject
// https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/scripts/eject.js#L155-L164
function removeInFile(file: string, keys: string[]) {
  let content = fs.readFileSync(file, "utf8");

  if (content.match(new RegExp(`// @remove-file-(${keys.join("|")})`))) {
    fs.removeSync(file);
    return;
  }
  content = `${content
    .replace(
      new RegExp(
        `// @remove-(${keys.join("|")})-begin([\\S\\s]*?)// @remove-\\1-end\\n`,
        "gm"
      ),
      ""
    )
    .replace(new RegExp("// @remove-.*?\\n", "gm"), "")
    .trim()}\n`;
  fs.writeFileSync(file, content);
}

export default async function copyTemplate(options: {
  projectPath: string;
  backend: Backend;
  auth: Auth;
  template: string;
  hasMobile: boolean;
  hasWeb: boolean;
  hasPulumiAws: boolean;
}) {
  const { projectPath, template, hasMobile, hasWeb, hasPulumiAws } = options;

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
  if (!hasMobile && !hasWeb) {
    excludeList.push("common");
  }
  if (!hasPulumiAws) {
    excludeList.push("pulumi-aws");
  }
  copySync(templatePath, projectPath, false, excludeList);
  // ".gitignore" isn't included in "npm publish" so copy it over as gitignore
  // and rename (CRA does this)
  recursiveFileFunc(projectPath, /^gitignore$/, (dir, file) =>
    fs.renameSync(path.join(dir, file), path.join(dir, ".gitignore"))
  );
  fs.renameSync(
    path.join(projectPath, "template.json"),
    path.join(projectPath, "package.json")
  );

  addApolloCodegen(options);
  await updateVSCodeLaunch(options);
  await updatePackage(options);

  const removeBlockInFileKeys: string[] = [];
  if (!hasMobile) {
    removeBlockInFileKeys.push("mobile");
  }
  if (!hasWeb) {
    removeBlockInFileKeys.push("web");
  }
  recursiveFileFunc(projectPath, /\.(ts|tsx)$/, (dir, file) =>
    removeInFile(path.join(dir, file), removeBlockInFileKeys)
  );
}
