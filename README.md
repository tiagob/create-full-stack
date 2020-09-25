# Create Full Stack

Create a TypeScript full stack with minimal configuration.

- [Getting Started](https://create-full-stack.com/docs) – How to create a new full stack.
- [User Guide](https://create-full-stack.com) – How to develop apps bootstrapped with Create Full Stack.

Create Full Stack works on macOS, and Linux.<br>
If something doesn’t work, please file an [issue](https://github.com/tiagob/create-full-stack/issues).

**Looking for co-contributors. If this project interests you, email me@tiagobandeira.com**

## Philosophy

- Single language (TypeScript)
  - Minimize context switching
- Static typing everywhere (DB to UI across APIs)
  - Compile time bugs instead of runtime bugs
- Scales
  - In terms of requests, features, and complexity (engineers on the project)
- Most popular tools in class
  - Better support and fewer edge cases
- Simplicity over infinite flexibility
  - Prefer simpler solutions to the 90% use case over supporting the 1% use case

## Setup

### Install Yarn

Follow instructions at https://classic.yarnpkg.com/en/docs/install

Or with [Homebrew](https://brew.sh/) run:

```bash
brew install yarn
```

CFS support for `npm` will be added when [npm v7](https://blog.npmjs.org/post/626173315965468672/npm-v7-series-beta-release-and-semver-major) is stable, which contains the required [workspaces feature](https://github.com/npm/rfcs/blob/latest/accepted/0026-workspaces.md).

## Run

```bash
yarn create full-stack my-full-stack
```

**Node v12.10.0 or later is required**. You can use [n](https://github.com/tj/n) to switch Node versions.

### Help

```bash
% yarn create-full-stack --help
Usage: create-full-stack <project-directory> [options]

Options:
  -V, --version              output the version number
  -t, --template <template>  specify a template for the created project
  -h, --help                 display help for command
```

## Setup [VSCode](https://code.visualstudio.com/) (recommended IDE/Editor)

The config files (`.vscode/`) are included which formats on save and includes recommended extensions.

## Generated project notes

Check specific package READMEs for setup configuration and commands.

### Code generation

Repo uses [graphql-code-generator](https://graphql-code-generator.com/). Client React components for GraphQL queries and mutations are automatically generated via the [typescript-react-apollo plugin](https://graphql-code-generator.com/docs/plugins/typescript-react-apollo#usage) from the `*.graphql` files. The backend relies on type generation via the [typescript-resolvers plugin](https://graphql-code-generator.com/docs/plugins/typescript-resolvers). This code is automatically generated when running commands from the workspace root.

### Troubleshooting

#### EADDRINUSE, Address already in use

Kill all node processes.

```bash
killall node
```

#### Hooks can only be called inside the body of a function component

React in both `packages/mobile/package.json` and `packages/web/package.json` need to be the same version since they're shared in Yarn Workspaces (unless you add [nohoist](https://yarnpkg.com/blog/2018/02/15/nohoist/)).

#### Auth0 login hangs on Android virtual device

Your Android virtual device (AVD) must use Android 11. [expo/issues/9845](https://github.com/expo/expo/issues/9845)

#### FatalError: relation \"todos\" already exists

Reset your docker Postgres volume. This wipes any existing data.

```bash
docker rm <project name>_postgres_1
docker volume rm <project name>_db_data
```

#### pulumi:providers: no resource plugin found in the workspace or on your \$PATH, install the plugin

This can occur locally or in continuous deployment (CD) with GitHub actions.

If locally, run the command in the error message to install the plugin.

If on GitHub actions, you must setup and deploy the production stack locally first before GitHub actions can deploy. [pulumi/issues/2097](https://github.com/pulumi/pulumi/issues/2097)

To deploy the production stack run:

```bash
cd packages/pulumi-aws
pulumi stack select production
pulumi up
```

#### Something is already running on port 3000

Check which service is running on the port.

```bash
sudo lsof -i tcp:3000
```

Kill it (ex. node)

```bash
pkill node
```
