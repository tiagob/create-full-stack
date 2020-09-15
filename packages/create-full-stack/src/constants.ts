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
export enum CloudPlatform {
  aws = "aws",
  none = "none",
}
export const cloudPlatforms = [CloudPlatform.aws, CloudPlatform.none];
