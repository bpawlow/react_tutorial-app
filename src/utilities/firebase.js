import {initializeApp} from 'firebase/app';
import 'firebase/database';
import {useState, useEffect} from "react";
import { getDatabase, onValue, ref, set } from 'firebase/database';
import { getAuth, GoogleAuthProvider, onIdTokenChanged, signInWithPopup, signOut } from 'firebase/auth';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDqjLZ4CFP-3Ztn92xFpMF5TTo7PU-pess",
  authDomain: "react-app-tutorial-dc0dc.firebaseapp.com",
  databaseURL: "https://react-app-tutorial-dc0dc-default-rtdb.firebaseio.com",
  projectId: "react-app-tutorial-dc0dc",
  storageBucket: "react-app-tutorial-dc0dc.appspot.com",
  messagingSenderId: "42729323915",
  appId: "1:42729323915:web:6e9dabf1ccc2a3b020038e",
  measurementId: "G-PFBXB1XNVN"
};

const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);

export const setData = (path, value) =>
    set(ref(database, path), value);

export const useData = (path, transform) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const dbRef = ref(database, path);
    const devMode = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
    if (devMode) { console.log(`loading ${path}`); }
    return onValue(dbRef, (snapshot) => {
      const val = snapshot.val();
      if (devMode) { console.log(val); }
      setData(transform ? transform(val) : val);
      setLoading(false);
      setError(null);
    }, (error) => {
      setData(null);
      setLoading(false);
      setError(error);
    });
  }, [path, transform]);

  return [data, loading, error];
};

export const signInWithGoogle = () => {
    signInWithPopup(getAuth(firebase), new GoogleAuthProvider());
};

const firebaseSignOut = () => signOut(getAuth(firebase));

export { firebaseSignOut as signOut };

export const useUserState = () => {
    const [user, setUser] = useState();

    useEffect(() => {
        onIdTokenChanged(getAuth(firebase), setUser);
    }, []);

    return [user];
};