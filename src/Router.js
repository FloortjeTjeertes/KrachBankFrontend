import { createWebHashHistory, createRouter } from "vue-router/auto-routes";

import HomePage from "./components/pages/HomePage.vue";
import AdminPage from "./components/pages/AdminPage.vue";
import AccountPage from "./components/pages/AccountPage.vue";

const routes = [
  { path: "/",name:"Home", component: HomePage },
  { path: "/admin", name:"Admin",component: AdminPage},
  {path: "/account/:iban", name:"AccountDetails", component: AccountPage}   ,
  { path: "/:pathMatch(.*)*", redirect: "/" }
  // Redirect all nmatched routes to home
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
