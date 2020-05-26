import "firebase/firestore";
import "firebase/auth";

import Constants from "expo-constants";
import * as firebase from "firebase/app";

const firebaseConfig = {
  apiKey: Constants.manifest.extra.firebaseApiKey,
  authDomain: Constants.manifest.extra.firebaseAuthDomain,
  projectId: Constants.manifest.extra.firebaseProjectId,
};

firebase.initializeApp(firebaseConfig);

export const provider = new firebase.auth.GoogleAuthProvider();

export const db = firebase.firestore();

export default firebase;

export const getTodosCollection = () => {
  const user = firebase.auth().currentUser;
  return db
    .collection("users")
    .doc(user ? user.uid : "")
    .collection("todos");
};
