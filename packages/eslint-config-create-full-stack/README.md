# eslint-config-create-full-stack

This package includes the shareable ESLint configuration used by [Create Full Stack](https://github.com/tiagob/create-full-stack).<br>
Please refer to its documentation:

- [Getting Started](https://create-full-stack.com/docs) – How to create a new full stack.
- [User Guide](https://create-full-stack.com) – How to develop apps bootstrapped with Create Full Stack.

## Usage in Create Full Stack Projects

The easiest way to use this configuration is with [Create Full Stack](https://github.com/tiagob/create-full-stack), which includes it by default.

**You don’t need to install it separately in Create Full Stack projects.**

## Usage Outside of Create Full Stack

If you want to use this ESLint configuration in a project not built with Create Full Stack, you can install it with the following steps.

First, install this package, ESLint and the necessary plugins.

```bash
yarn add -D eslint-config-create-full-stack
```

Then create a file named `.eslintrc.json` with following contents in the root folder of your project:

```json
{
  "extends": "create-full-stack",
  "settings": {
    "jest": {
      "version": 26
    }
  }
}
```

Replace Jest version with your Jest version.

That's it! You can override the settings from `eslint-config-create-full-stack` by editing the `.eslintrc.json` file. Learn more about [configuring ESLint](http://eslint.org/docs/user-guide/configuring) on the ESLint website.
