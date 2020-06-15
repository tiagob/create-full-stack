export enum Backend {
  apolloServerExpress = "apollo-server-express",
  hasura = "hasura",
}
export const backends = Object.values(Backend);
export const nodeBackends = new Set([Backend.apolloServerExpress]);
export enum Auth {
  auth0 = "auth0",
  noAuth = "no-auth",
}
export const authChoiceToType = {
  auth0: Auth.auth0,
  "": Auth.noAuth,
} as const;
export type AuthChoiceToType = typeof authChoiceToType;
