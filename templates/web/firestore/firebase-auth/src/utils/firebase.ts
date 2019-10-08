import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID
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
