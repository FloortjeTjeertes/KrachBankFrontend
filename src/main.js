import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./Router";
import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
import { VueQueryPlugin } from "@tanstack/vue-query";

createApp(App).use(router).use(VueQueryPlugin).mount("#app");
