import { NodePath, Visitor } from "@babel/traverse";
import * as BabelTypes from "@babel/types";
import { config } from "cfs-dotenv";

interface Env {
  parsed?: { [index: string]: NodeJS.ProcessEnv };
}

// Hack to fix https://github.com/motdotla/dotenv/issues/199
// dotenv/config sets process.env and won't override values. To get it to
// reload for different environments reset process.env
const processEnv = Object.freeze({ ...process.env });
const productionEnv = config("production") as Env;
process.env = { ...processEnv };
const developmentEnv = config("development") as Env;
process.env = { ...processEnv };

// Adapted from
// https://github.com/babel/minify/blob/master/packages/babel-plugin-transform-inline-environment-variables/src/index.js
// https://github.com/brysgo/babel-plugin-inline-dotenv/blob/master/src/index.js

interface PluginOptions {
  opts?: {
    include?: string[];
    exclude?: string[];
  };
}

interface Path extends NodePath<BabelTypes.MemberExpression> {
  toComputedKey: () => BabelTypes.Expression;
}

export default function ({
  types: t,
}: {
  types: typeof BabelTypes;
}): { visitor: Visitor<PluginOptions> } {
  return {
    visitor: {
      MemberExpression(path, { opts: { include, exclude } = {} }) {
        if (path.get("object").matchesPattern("process.env")) {
          const key = (path as Path).toComputedKey();
          if (
            t.isStringLiteral(key) &&
            (!include || include.includes(key.value)) &&
            (!exclude || !exclude.includes(key.value))
          ) {
            path.replaceWith(
              key.value in process.env
                ? t.valueToNode(process.env[key.value])
                : t.conditionalExpression(
                    t.identifier("__DEV__"),
                    t.valueToNode(
                      developmentEnv.parsed && developmentEnv.parsed[key.value]
                    ),
                    t.valueToNode(
                      productionEnv.parsed && productionEnv.parsed[key.value]
                    )
                  )
            );
          }
        }
      },
    },
  };
}
