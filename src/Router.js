import { createMemoryHistory, createRouter } from "vue-router";

import HomePage from "./components/pages/HomePage.vue";
import ApiTestPage from "./components/pages/ApiTestPage.vue";
import AdminPage from "./components/pages/AdminPage.vue";

const routes = [
  { path: "/", component: HomePage },
  { path: "/api-test", component: ApiTestPage },
  { path: "/admin", component: AdminPage},
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
