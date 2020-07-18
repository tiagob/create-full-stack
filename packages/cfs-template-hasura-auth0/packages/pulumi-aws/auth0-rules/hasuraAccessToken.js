// eslint-disable-next-line @typescript-eslint/no-unused-vars
function hasuraAccessToken(user, context, callback) {
  const namespace = "https://hasura.io/jwt/claims";
  // eslint-disable-next-line no-param-reassign
  context.accessToken[namespace] = {
    "x-hasura-default-role": "user",
    "x-hasura-allowed-roles": ["user"],
    "x-hasura-user-id": user.user_id,
  };
  callback(undefined, user, context);
}
