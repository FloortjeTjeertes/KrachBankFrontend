import { createMemoryHistory, createRouter } from "vue-router";

import HomePage from "./components/pages/HomePage.vue";
import ApiTestPage from "./components/pages/ApiTestPage.vue";
import AdminPage from "./components/pages/AdminPage.vue";
import LoginPage from "./components/pages/LoginPage.vue";
import VerifiedPage from "./components/pages/VerifiedPage.vue";
import NotVerifiedPage from "./components/pages/NotVerifiedPage.vue";

const routes = [
  { path: "/", component: HomePage },
  { path: "/api-test", component: ApiTestPage },
  { path: "/admin", component: AdminPage},
  { path: "/login", component: LoginPage },
  { path: "/verified", component: VerifiedPage },
  { path: "/notverified", component: NotVerifiedPage }
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
