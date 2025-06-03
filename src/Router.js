import { createWebHashHistory, createRouter } from "vue-router/auto-routes";

import HomePage from "./components/pages/HomePage.vue";
import AdminPage from "./components/pages/AdminPage.vue";
import FormPage from "./components/pages/FormPage.vue";
import LoginPage from "./components/pages/LoginPage.vue";
import VerifiedPage from "./components/pages/VerifiedPage.vue";
import NotVerifiedPage from "./components/pages/NotVerifiedPage.vue";
import ATMPage from "./components/pages/ATMPage.vue";
import AccountPage from "./components/pages/AccountPage.vue";
import { createWebHistory } from "vue-router";
import { useUserStore } from "./stores/userStore"; // adjust path if needed

const routes = [

  { path: "/",name:"Home", component: HomePage },
  {
    path: "/admin",
    component: AdminPage,
    children: [
      { path: "", redirect: "admin/users" },
      { path: "users", component: () => import("./components/containers/UserContainer.vue") },
      {path: "users/form", component: () => import("./components/pages/FormPage.vue") },
      {path: "users/form/:id", component: () => import("./components/pages/FormPage.vue"), props: true },
      { path: "transactions", component: () => import("./components/containers/TransactionsContainer.vue") },
      { path: "accounts", component: () => import("./components/containers/AccountsContainer.vue") }
    ],
  },
  { path: "/form",component: FormPage},  
  {path: "/account/:iban", name:"AccountDetails", component: AccountPage}  ,
  { path: "/:pathMatch(.*)*", redirect: "/" },
  { path: "/login", component: LoginPage },
  { path: "/verified", redirect: "/" },
  { path: "/notverified", component: NotVerifiedPage },
  { path: "/atm", component: ATMPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const isAuthenticated = !!userStore.getUser; // or your actual auth check

  // List of routes that do NOT require authentication
  const publicPages = ["/login", "/verified", "/notverified"];
  const authRequired = !publicPages.includes(to.path);

  if (authRequired && !isAuthenticated) {
    return next("/login");
  }
  next();
});

export default router;
