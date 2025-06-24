import { createRouter, createWebHistory } from "vue-router";

import AccountPage from "./components/pages/AccountPage.vue";
import AdminPage from "./components/pages/AdminPage.vue";
import atmOverview from "./components/pages/ATMOverview.vue";
import atmPage from "./components/pages/ATMPage.vue";
import FormPage from "./components/pages/FormPage.vue";
import HomePage from "./components/pages/HomePage.vue";
import LoginPage from "./components/pages/LoginPage.vue";
import NotVerifiedPage from "./components/pages/NotVerifiedPage.vue";
import TransactionPage from "./components/pages/TransactionPage.vue";
import { useUserStore } from "./stores/userStore";
import UserContainer from "./components/containers/UserContainer.vue";
import TransactionsContainer from "./components/containers/TransactionsContainer.vue";
import AccountsContainer from "./components/containers/AccountsContainer.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
    meta: { requiresAdmin: false, public: false, requiresVerification: true },
  },
  {
    path: "/admin",
    component: AdminPage,
    children: [
      { path: "", name: "Admin", redirect: "admin/users" },
      { path: "users", name: "AdminUsers", component: UserContainer },
      { path: "users/form", name: "AdminUserForm", component: FormPage },
      {
        path: "users/form/:id",
        name: "AdminUserFormEdit",
        component: FormPage,
        props: true,
      },
      {
        path: "transactions",
        name: "AdminTransactions",
        component: TransactionsContainer,
      },
      { path: "accounts", name: "AdminAccounts", component: AccountsContainer },
      { path: "atm", name: "AdminATM", component: atmPage },
      { path: "atmoverview", name: "AdminATMOverview", component: atmOverview },
    ],
    meta: { requiresAdmin: true, public: false, requiresVerification: true },
  },
  {
    path: "/form",
    name: "Form",
    component: FormPage,
    meta: { public: false, requiresAdmin: false, requiresVerification: false }, //what is this route for? does it need verification?
  },
  {
    path: "/account/:iban",
    name: "AccountDetails",
    component: AccountPage,
    meta: { public: false, requiresAdmin: false, requiresVerification: true },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    redirect: "/",
    meta: { public: true, requiresAdmin: false, requiresVerification: false },
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
    meta: { public: true, requiresAdmin: false, requiresVerification: false },
  },
  {
    path: "/verified",
    name: "Verified",
    redirect: "/",
    meta: { public: false, requiresAdmin: false, requiresVerification: false },
  },
  {
    path: "/notverified",
    name: "NotVerified",
    component: NotVerifiedPage,
    meta: { public: false, requiresAdmin: false, requiresVerification: false },
  },
  {
    path: "/atmlogin",
    name: "ATMLogin",
    component: atmPage, // import it above
    meta: { public: true, requiresAdmin: false, requiresVerification: false },
  },
  { path: "/atmoverview", name: "ATMOverview", component: atmOverview 
    , meta: { public: false, requiresAdmin: false, requiresVerification: true } 
  },
  {
  },
  {
    path: "/account/:iban/newTransaction",
    name: "NewAccountTransaction",
    component: TransactionPage,
    props: true,
    meta: { public: false, requiresAdmin: false, requiresVerification: true },
  },
  {
    path: "/transactions/new",
    name: "NewTransaction",
    component: TransactionPage,
    meta: { public: false, requiresAdmin: false, requiresVerification: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const user = userStore.getUser;
  const isAuthenticated = userStore.isAuthenticated;

  // List of routes that do NOT require authentication TODO:maybe make this an config or use custom meta field

  if (to.meta.public) {
    return next();
  }
  // Check if the user is authenticated and public
  if (!isAuthenticated || user === null ) {
    return next("/login");
  }

  console.log("User is authenticated:", user);
  // Check if the user is an admin for admin routes
  if (to.meta.requiresAdmin && !user.admin ) {
    return next("/");
  }

  //check if the user is verified for routes that require verification
  if (to.meta.requiresVerification && !user.verified) {
    return next("/notverified");
  }

  next();
});

export default router;
