// Import the functions you need from the SDKs you need
import dayjs from 'dayjs';
import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import { addDoc, collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import get from 'lodash/get';
import { CreatePostFormData } from 'models/post';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCN3QPZuelRXFAgjHMVzAME2rrohnpFe6Q',
  authDomain: 'mintyfood-22c49.firebaseapp.com',
  projectId: 'mintyfood-22c49',
  storageBucket: 'mintyfood-22c49.appspot.com',
  messagingSenderId: '381561872130',
  appId: '1:381561872130:web:18dfe51a2db14bb94cec1b'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const storage = getStorage(app);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

facebookProvider.setCustomParameters({
  display: 'popup'
});

const signInWithFacebook = () => {
  signInWithPopup(auth, facebookProvider)
    .then((result: any) => {
      // The signed-in user info.
      const user = result.user;

      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken;

      // ...
    })
    .catch((error: any) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = FacebookAuthProvider.credentialFromError(error);

      // ...
    });
};

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;

    const q = query(collection(db, 'user'), where('uid', '==', user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, 'user'), {
        uid: user.uid,
        name: user.displayName,
        authProvider: 'google',
        email: user.email
      });
    }
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
};

const logInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const response = await signInWithEmailAndPassword(auth, email, password);
    if (response) {
      const { user } = response;
      const tokens: any = get(user, 'stsTokenManager');
      const userInfo = await getUserInfoFirebase();
      return {
        tokens,
        userInfo
      };
    }
  } catch (err) {
    console.error(err);
  }
};

const registerWithEmailAndPassword = async (fullName: string, email: string, password: string) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    const newUser = {
      uid: user.uid,
      fullName,
      authProvider: 'password',
      email,
      type: 'USER',
      status: 'ACTIVE',
      password
    };
    await addDoc(collection(db, 'user'), newUser);
    return {
      data: newUser
    };
  } catch (err: any) {
    console.error(err);
  }
};

const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert('Password reset link sent!');
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
};

const logoutFirebase = () => signOut(auth);

const getUserInfoFirebase = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      const q = query(collection(db, 'user'), where('uid', '==', user.uid));
      return getDocs(q).then((docs) => {
        if (docs.docs.length) {
          const { password, ...rest } = docs.docs[0].data();
          return rest;
        }
      });
    } else {
      console.log('ducnh signed out');

      // User is signed out
      // ...
    }
  } catch (e) {
    console.log('ducnh e');
  }
};

const getPostCategoryFirebase = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      const q = query(collection(db, 'post-category'));
      return getDocs(q).then((docs) => {
        if (docs.docs.length) {
          return docs.docs.map((item) => item.data());
        }
      });
    } else {
      console.log('ducnh signed out');

      // User is signed out
      // ...
    }
  } catch (e) {
    console.log('ducnh e');
  }
};

const createPostCategoryFirebase = async (label: string, value: string) => {
  await addDoc(collection(db, 'post-category'), { label, value });
};

const createPostFirebase = async (data: CreatePostFormData) => {
  await addDoc(collection(db, 'post'), data);
};

const uploadFileFirebase = async (file: any) => {
  try {
    const storageRef = ref(storage, `images/mintyfood-${dayjs().format('DD-MM-YYYY-hh-mm-ss')}.jpg`);
    return uploadBytes(storageRef, file)
      .then((snapshot) => {
        console.log('Uploaded a blob or file!', snapshot);
        return snapshot;
      })
      .catch((e) => console.log('ducnh e1', e));
  } catch (e) {
    console.log('ducnh e2', e);
  }
};

export {
  auth,
  db,
  signInWithGoogle,
  signInWithFacebook,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logoutFirebase,
  getUserInfoFirebase,
  createPostCategoryFirebase,
  getPostCategoryFirebase,
  createPostFirebase,
  uploadFileFirebase
};
