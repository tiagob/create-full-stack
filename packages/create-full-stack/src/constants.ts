export enum Backend {
  apolloServerExpress = "apollo-server-express",
  hasura = "hasura",
  firestore = "firestore",
}
export const backends = Object.values(Backend);
export const nodeBackends = new Set([Backend.apolloServerExpress]);
// TODO: Add auth0
export const authChoiceToType = {
  firebase: "firebase-auth",
  "": "no-auth",
} as const;
export type AuthChoiceToType = typeof authChoiceToType;
export type Auth = AuthChoiceToType[keyof AuthChoiceToType];
