// Adapted from
// https://github.com/hasura/graphql-engine/blob/master/community/sample-apps/firebase-jwt/functions/index.js
// https://firebase.google.com/docs/auth/admin/custom-claims#backend_implementation_admin_sdk
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

admin.initializeApp(functions.config().firebase);

// On sign up.
exports.processSignUp = functions.auth.user().onCreate(async (user) => {
  const customClaims = {
    "https://hasura.io/jwt/claims": {
      "x-hasura-default-role": "user",
      "x-hasura-allowed-roles": ["user"],
      "x-hasura-user-id": user.uid,
    },
  };
  // Set custom user claims on this newly created user.
  await admin.auth().setCustomUserClaims(user.uid, customClaims);
});
