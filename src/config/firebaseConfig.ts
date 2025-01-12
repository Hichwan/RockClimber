import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  initializeAuth, 
  indexedDBLocalPersistence, 
} from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCjP5T-_PA8CslQa7cVOTaveqrkYr6UzNU",
  authDomain: "rockclimber-23b3c.firebaseapp.com",
  projectId: "rockclimber-23b3c",
  storageBucket: "rockclimber-23b3c.appspot.com",
  messagingSenderId: "411658217464",
  appId: "1:411658217464:web:fee20cc6dd7cc2bb9d980d",
  measurementId: "G-W4DELSVGXQ",
  expoClientId: "340619659043-e7m588pe68jpu95a1obroqhknnge7qff.apps.googleusercontent.com",
  iosClientId: "340619659043-1leih1fnkntsn4o532qnv7lns5veq3cc.apps.googleusercontent.com"
};


const app = initializeApp(firebaseConfig);


const auth = initializeAuth(app, {
  persistence: indexedDBLocalPersistence 
});


const db = getFirestore(app);

export { auth, db, collection, addDoc };
