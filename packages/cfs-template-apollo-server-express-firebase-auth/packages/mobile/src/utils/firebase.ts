import "firebase/auth";

import Constants from "expo-constants";
import * as firebase from "firebase/app";

const firebaseConfig = {
  apiKey: Constants.manifest.extra.firebaseApiKey,
  authDomain: Constants.manifest.extra.firebaseAuthDomain,
  projectId: Constants.manifest.extra.firebaseProjectId,
};

firebase.initializeApp(firebaseConfig);

export default firebase;
