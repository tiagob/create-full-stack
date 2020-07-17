// Adapted from
// https://github.com/iamturns/create-exposed-app/blob/master/.eslintrc.js
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  plugins: [
    "@typescript-eslint",
    "eslint-comments",
    "jest",
    "promise",
    "unicorn",
    "simple-import-sort",
  ],
  extends: [
    "react-app",
    "airbnb-typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:eslint-comments/recommended",
    "plugin:jest/recommended",
    "plugin:promise/recommended",
    "plugin:unicorn/recommended",
    "plugin:prettier/recommended",
    "prettier/react",
    "prettier/@typescript-eslint",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
  ],
  env: {
    node: true,
    browser: true,
    jest: true,
  },
  rules: {
    "import/prefer-default-export": "off",
    // Overload airbnb definition to allow 'ForOfStatement'
    // https://github.com/airbnb/javascript/blob/b6fc6dc7c3cb76497db0bb81edaa54d8f3427796/packages/eslint-config-airbnb-base/rules/style.js#L257
    "no-restricted-syntax": [
      "error",
      "ForInStatement",
      "LabeledStatement",
      "WithStatement",
    ],
    "object-shorthand": "error",
    "react/jsx-props-no-spreading": "off",
    "simple-import-sort/sort": "error",
    "unicorn/filename-case": [
      "error",
      {
        cases: {
          camelCase: true,
          pascalCase: true,
        },
      },
    ],
    // Common abbreviations are known and readable
    "unicorn/prevent-abbreviations": "off",
    // TypeScript can infer return types
    // https://www.typescriptlang.org/docs/handbook/type-inference.html
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
  },
  ignorePatterns: [
    "node_modules",
    "build",
    // graphql-codegen and mobile (expo)
    "__generated__",
    // web (CRA)
    "react-app-env.d.ts",
    "serviceWorker.ts",
    "setupTests.ts",
    // mobile (expo)
    "babel.config.js",
    "metro.config.js",
  ],
};
