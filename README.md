# Create Full Stack

Create full stack TypeScript apps with no configuration.

## Setup

_Assumes MacOS_

### Install [Homebrew](https://brew.sh/)

```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

### Install [Yarn](https://yarnpkg.com/)

```bash
brew install yarn
```

### Clone repo and cd to root of project

```bash
git clone https://github.com/tiagob/create-full-stack.git
cd create-full-stack
```

**All commands below are run from the root project directory `create-full-stack`.**

### Install dependencies

```bash
yarn
```

## Run

```bash
cd packages/create-full-stack
```

### Options

```bash
$ yarn create-full-stack --help
Usage: create-full-stack <project-directory> [options]

Options:
  -V, --version            output the version number
  -b, --backend <backend>  backend type [apollo|hasura|firestore]
  -w, --web                include react website
  -m, --mobile             include react-native mobile app
  -a, --auth <auth>        auth type [firebase|]
  -h, --help               display help for command
```

### Example run command

```bash
yarn create-full-stack -b apollo -w -m ~/my-full-stack
```

## Setup [VSCode](https://code.visualstudio.com/) (recommended IDE/Editor)

The config files (`.vscode/`) are included which formats on save.

### Install recommended [extensions](https://code.visualstudio.com/docs/editor/extension-gallery)

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

## Generated project notes

Check specific package READMEs for additional information.

**TODO: Generate in root README as applicable**

### Code generation

Repo uses [graphql-code-generator](https://graphql-code-generator.com/). Client React components for GraphQL queries and mutations are automatically generated via the [typescript-react-apollo plugin](https://graphql-code-generator.com/docs/plugins/typescript-react-apollo#usage) from the `*.graphql` files. The backend relies on type generation via the [typescript-resolvers plugin](https://graphql-code-generator.com/docs/plugins/typescript-resolvers). This code is automattically generated when running commands from the workspace root.

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
- [Sequelize](http://docs.sequelizejs.com/)
- [Yarn Workspaces](https://yarnpkg.com/lang/en/docs/workspaces/)
