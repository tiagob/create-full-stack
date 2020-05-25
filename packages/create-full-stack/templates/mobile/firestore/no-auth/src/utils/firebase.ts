import "firebase/firestore";

import Constants from "expo-constants";
import * as firebase from "firebase/app";

const firebaseConfig = {
  apiKey: Constants.manifest.extra.firebaseApiKey,
  authDomain: Constants.manifest.extra.firebaseAuthDomain,
  projectId: Constants.manifest.extra.firebaseProjectId,
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();

export default firebase;

export const getTodosCollection = () => db.collection("todos");
