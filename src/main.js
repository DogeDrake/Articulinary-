import { createApp, reactive } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";

import UserList from "./components/UserList.vue";
import UserDetails from "./components/UserDetails.vue";
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
import AddRecipe from "./components/AddRecipe.vue";
import UserProfile from "./components/UserProfile.vue";
import UserEdit from "./components/UserEdit.vue";
import Favoritos from "./components/Favoritos.vue";
import Buscar from "./components/Buscar.vue";
import store from "./store";

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import specific icons */
import { faUserSecret } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

/* add icons to the library */
library.add(faUserSecret);
library.add(faHeart);

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";

const routes = [
  {
    path: "/home",
    name: "UserList",
    component: UserList,
    meta: { requiresAuth: true },
  },
  {
    path: "/recetas/:id",
    name: "UserDetails",
    component: UserDetails,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/usuario",
    name: "Usuario",
    component: UserProfile,
    meta: { requiresAuth: true },
  },
  {
    path: "/nuevo",
    name: "AddRecipe",
    component: AddRecipe,
    meta: { requiresAuth: true },
  },
  {
    path: "/favoritos",
    name: "Favoritos",
    component: Favoritos,
    meta: { requiresAuth: true },
  },
  {
    path: "/buscar",
    name: "Buscar",
    component: Buscar,
    meta: { requiresAuth: true },
  },
  {
    path: "/editar",
    name: "Editar",
    component: UserEdit,
    meta: { requiresAuth: true },
  },
];

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

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: "Login" });
    } else {
      next();
    }
  } else {
    next();
  }
});

//const app = firebase.initializeApp(firebaseConfig);
//const db = getFirestore(app);

//export { app }

router.push("/login");

const appVue = createApp(App);
/* add font awesome icon component */
appVue.component("font-awesome-icon", FontAwesomeIcon);
appVue.use(router);
appVue.use(store);
appVue.mount("#app");
