import * as admin from "firebase-admin";

// TODO: #60 Require creating serviceAccountKey.json in CLI
// error TS2307: Cannot find module './serviceAccountKey.json' or its corresponding
// type declarations.
import serviceAccount from "./serviceAccountKey.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
