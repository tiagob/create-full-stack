# Create Full Stack

Create full stack TypeScript apps with no configuration.

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

_Assumes MacOS_

### Install [Homebrew](https://brew.sh/)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
```

### Install [Yarn](https://yarnpkg.com/)

```bash
brew install yarn
```

## Run

```bash
yarn create full-stack ~/my-full-stack
```

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

The config files (`.vscode/`) are included which formats on save.

### Install recommended [extensions](https://code.visualstudio.com/docs/editor/extension-gallery)

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Docker](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)
- [YAML](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml)
- [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)

## Generated project notes

Check specific package READMEs for setup configuration and commands.

### Code generation

Repo uses [graphql-code-generator](https://graphql-code-generator.com/). Client React components for GraphQL queries and mutations are automatically generated via the [typescript-react-apollo plugin](https://graphql-code-generator.com/docs/plugins/typescript-react-apollo#usage) from the `*.graphql` files. The backend relies on type generation via the [typescript-resolvers plugin](https://graphql-code-generator.com/docs/plugins/typescript-resolvers). This code is automatically generated when running commands from the workspace root.

### Gotchas

#### EADDRINUSE, Address already in use

Kill all node processes.

```bash
killall node
```

#### Hooks can only be called inside the body of a function component

React in both `packages/mobile/package.json` and `packages/web/package.json` need to be the same version since they're shared in Yarn Workspaces (unless you add [nohoist](https://yarnpkg.com/blog/2018/02/15/nohoist/)).

#### Yarn Workspaces with Expo

Using [expo-yarn-workspaces](https://www.npmjs.com/package/expo-yarn-workspaces) which provides a workaround to make Yarn Workspaces work with Expo. Yarn Workspaces is required to share `node_modules` between `packages/web` and `packages/mobile`.

## References

- [Create React App](https://reactjs.org/docs/create-a-new-react-app.html)
- [TypeScript Node Starter](https://github.com/microsoft/TypeScript-Node-Starter)
- [TypesScript](https://www.typescriptlang.org/)
- [React](https://reactjs.org/)
- [React Native](https://facebook.github.io/react-native/)
- [Expo](https://docs.expo.io)
- [Apollo Client](https://www.apollographql.com/docs/react/)
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- [GraphQL Codegen](https://graphql-code-generator.com/docs/getting-started/)
- [TypeORM](https://typeorm.io/#/)
- [Yarn Workspaces](https://yarnpkg.com/lang/en/docs/workspaces/)
