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
const excludeFiles = new Set(["node_modules", "build", "yarn.lock"]);
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
    [Auth.noAuth]: "packages/server/src/graphql/schema.ts",
    [Auth.firebase]: "packages/server/src/graphql/schema.ts",
  },
  [Backend.hasura]: {
    [Auth.noAuth]: "http://localhost:8080/v1/graphql",
    [Auth.firebase]: [
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
        ...(hasMobile && {
          "packages/mobile/src/graphql/__generated__/index.ts": {
            documents: "packages/mobile/src/graphql/*.graphql",
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
        ...(hasWeb && {
          "packages/web/src/graphql/__generated__/index.ts": {
            documents: "packages/web/src/graphql/*.graphql",
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

function recursiveRename(dir: string, src: string, dst: string) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      recursiveRename(path.join(dir, file), src, dst);
    } else if (file === src) {
      fs.renameSync(path.join(dir, file), path.join(dir, dst));
    }
  }
}

export default async function copyTemplate(options: {
  projectPath: string;
  backend: Backend;
  auth: Auth;
  hasMobile: boolean;
  hasWeb: boolean;
}) {
  const { projectPath, backend, auth, hasMobile, hasWeb } = options;

  const templateName = `cfs-template-${backend}-${auth}`;
  runYarn(projectPath, ["add", templateName]);
  const templatePath = path.dirname(
    require.resolve(path.join(templateName, "package.json"), {
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
  copySync(templatePath, projectPath, false, excludeList);
  // ".gitignore" isn't included in "npm publish" so copy it over as gitingore
  // and rename (CRA does this)
  recursiveRename(projectPath, "gitignore", ".gitignore");
  fs.renameSync(
    path.join(projectPath, "template.json"),
    path.join(projectPath, "package.json")
  );

  addApolloCodegen(options);
  await updateVSCodeLaunch(options);
  await updatePackage(options);
}
