export enum Backend {
  apolloServerExpress = "apollo-server-express",
  hasura = "hasura",
}
export const backends = Object.values(Backend);
export const nodeBackends = new Set([Backend.apolloServerExpress]);
// TODO: Add auth0
export enum Auth {
  firebase = "firebase-auth",
  noAuth = "no-auth",
}
export const authChoiceToType = {
  firebase: Auth.firebase,
  "": Auth.noAuth,
} as const;
export type AuthChoiceToType = typeof authChoiceToType;
