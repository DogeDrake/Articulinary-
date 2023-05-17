import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBpeTh-1wzEmBuf3S5L_HVpbX4b0naWfGk",
  authDomain: "articullinary.firebaseapp.com",
  databaseURL:
    "https://articullinary-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "articullinary",
  storageBucket: "articullinary.appspot.com",
  messagingSenderId: "936030800031",
  appId: "1:936030800031:web:a20da356473816408d7aaa",
};

const app = initializeApp(firebaseConfig);

import { getStorage } from "firebase/storage";

const storage = getStorage(app);

export { storage };
