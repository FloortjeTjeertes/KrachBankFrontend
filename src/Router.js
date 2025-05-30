import { createMemoryHistory, createRouter } from "vue-router";

import HomePage from "./components/pages/HomePage.vue";
import ApiTestPage from "./components/pages/ApiTestPage.vue";
import AdminPage from "./components/pages/AdminPage.vue";
import FormPage from "./components/pages/FormPage.vue";
import LoginPage from "./components/pages/LoginPage.vue";
import VerifiedPage from "./components/pages/VerifiedPage.vue";
import NotVerifiedPage from "./components/pages/NotVerifiedPage.vue";

const routes = [
  { path: "/", component: HomePage },
  { path: "/api-test", component: ApiTestPage },
  {
    path: "/admin",
    component: AdminPage,
    children: [
      { path: "", redirect: "admin/users"},
      { path: "users", component: () => import("./components/containers/UserContainer.vue") },
      { path: "transactions", component: () => import("./components/containers/TransactionsContainer.vue") },
      { path: "accounts", component: () => import("./components/containers/AccountsContainer.vue") },
      { path: "users/form/:id?", component: FormPage }, // for user form (create/update)
    ],
  },
  { path: "/login", component: LoginPage },
  { path: "/verified", component: VerifiedPage },
  { path: "/notverified", component: NotVerifiedPage }
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
