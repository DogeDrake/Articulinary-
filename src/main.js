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

router.push("/home");

const appVue = createApp(App);
/* add font awesome icon component */
appVue.component("font-awesome-icon", FontAwesomeIcon);
appVue.use(router);
appVue.use(store);
appVue.mount("#app");
