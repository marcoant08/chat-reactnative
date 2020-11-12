import firebase from "firebase/app";
import "firebase/database";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

let firebaseConfig = {
  apiKey: "AIzaSyA7Q7KICOurzutgWPoWX4RJWTaLws3Zax4",
  authDomain: "chat-a2792.firebaseapp.com",
  databaseURL: "https://chat-a2792.firebaseio.com",
  projectId: "chat-a2792",
  storageBucket: "chat-a2792.appspot.com",
  messagingSenderId: "1033689524488",
  appId: "1:1033689524488:web:11e69f3114b2926158a4bd",
  measurementId: "G-W7TQJ9VPSB",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
