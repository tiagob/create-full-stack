import chalk from "chalk";

export enum Backend {
  apolloServerExpress = "apollo-server-express",
  hasura = "hasura",
}
export const backends = Object.values(Backend);
export const nodeBackends = new Set([Backend.apolloServerExpress]);
export enum Auth {
  auth0 = "auth0",
  none = "none",
}
export const auths = Object.values(Auth);
export const authChoices = [
  {
    name: `${Auth.auth0} ${chalk.grey("(~10m of setup)")}`,
    value: Auth.auth0,
  },
  Auth.none,
];
export const templateToTypes = Object.freeze({
  "apollo-server-express-auth0": {
    backend: Backend.apolloServerExpress,
    auth: Auth.auth0,
  },
  "apollo-server-express-no-auth": {
    backend: Backend.apolloServerExpress,
    auth: Auth.none,
  },
  "hasura-auth0": {
    backend: Backend.hasura,
    auth: Auth.auth0,
  },
  "hasura-no-auth": {
    backend: Backend.hasura,
    auth: Auth.none,
  },
});
export type TemplateToTypes = typeof templateToTypes;
export function getTemplateTypeKey(
  templateTypes: TemplateToTypes[keyof TemplateToTypes]
) {
  return JSON.stringify(templateTypes, Object.keys(templateTypes).sort());
}
export const typesToTemplate = Object.freeze(
  Object.fromEntries(
    Object.entries(templateToTypes).map(([template, templateTypes]) => [
      getTemplateTypeKey(templateTypes),
      template,
    ])
  )
);
export enum Cloud {
  aws = "aws",
  none = "none",
}
export const cloudPlatforms = [Cloud.aws, Cloud.none];
export const cloudPlatformChoices = [
  {
    name: `${Cloud.aws} ${chalk.grey("(~15m of setup)")}`,
    value: Cloud.aws,
  },
  Cloud.none,
];
export enum Web {
  react = "react",
  none = "none",
}
export const webStacks = Object.values(Web);
export enum Mobile {
  reactNative = "react-native",
  none = "none",
}
export const mobileStacks = Object.values(Mobile);
export enum Cicd {
  githubActions = "github-actions",
  none = "none",
}
export const cicds = Object.values(Cicd);
