import { createWebHashHistory, createRouter } from "vue-router/auto-routes";

import HomePage from "./components/pages/HomePage.vue";
import AdminPage from "./components/pages/AdminPage.vue";
import FormPage from "./components/pages/FormPage.vue";
import LoginPage from "./components/pages/LoginPage.vue";
import TransactionPage from "./components/pages/TransactionPage.vue";
import VerifiedPage from "./components/pages/VerifiedPage.vue";
import NotVerifiedPage from "./components/pages/NotVerifiedPage.vue";
import ATMPage from "./components/pages/ATMPage.vue";
import AccountPage from "./components/pages/AccountPage.vue";
import { createWebHistory } from "vue-router";
import { useUserStore } from "./stores/userStore"; // adjust path if needed]
import atmPage from "./components/pages/ATMPage.vue";
import atmOverview from "./components/pages/ATMOverview.vue";

const routes = [
  { path: "/", name: "Home", component: HomePage },
  {
    path: "/admin",
    name: "Admin",
    component: AdminPage,
    children: [
      { path: "", redirect: "admin/users" },
      {
        path: "users",
        name: "AdminUsers",
        component: () => import("./components/containers/UserContainer.vue"),
      },
            {
        path: "users/form",
        name: "AdminUserForm",
        component: () => import("./components/pages/FormPage.vue"),
      },
      {
        path: "users/form/:id",
        name: "AdminUserFormEdit",
        component: () => import("./components/pages/FormPage.vue"),
        props: true,
      },
      {
        path: "transactions",
        name: "AdminTransactions",
        component: () =>
          import("./components/containers/TransactionsContainer.vue"),
      },
      {
        path: "accounts",
        name: "AdminAccounts",
        component: () =>
          import("./components/containers/AccountsContainer.vue"),
      },
      {
        path: "atm",
        name: "AdminATM",
        component: () => import("./components/pages/ATMPage.vue"),
      },
      {
        path: "atmoverview",
        name: "AdminATMOverview",
        component: () => import("./components/pages/ATMOverview.vue"),
      },
    ],
  },
  { path: "/form", name: "Form", component: FormPage },
  { path: "/account/:iban", name: "AccountDetails", component: AccountPage },
  { path: "/:pathMatch(.*)*", name: "NotFound", redirect: "/" },
  { path: "/login", name: "Login", component: LoginPage },
  { path: "/verified", name: "Verified", redirect: "/" },
  { path: "/notverified", name: "NotVerified", component: NotVerifiedPage },
  { path: "/atm", name: "ATM", component: atmPage },
  { path: "/atmoverview", name: "ATMOverview", component: atmOverview },
  { path: "/account/:iban/newTransaction", name: "NewAccountTransaction",  component: TransactionPage, props: true,},
  { path: "/transactions/new",  name: "NewTransaction", component: TransactionPage, },
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
