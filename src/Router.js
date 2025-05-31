import { createWebHashHistory, createRouter } from "vue-router/auto-routes";

import HomePage from "./components/pages/HomePage.vue";
import AdminPage from "./components/pages/AdminPage.vue";
import FormPage from "./components/pages/FormPage.vue";
import LoginPage from "./components/pages/LoginPage.vue";
import VerifiedPage from "./components/pages/VerifiedPage.vue";
import NotVerifiedPage from "./components/pages/NotVerifiedPage.vue";
import AccountPage from "./components/pages/AccountPage.vue";

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
  { path: "/verified", component: VerifiedPage },
  { path: "/notverified", component: NotVerifiedPage }
  // Redirect all nmatched routes to home
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
