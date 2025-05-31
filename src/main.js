import { createApp } from "vue";

import "./style.css";
import App from "./App.vue";
import router from "./Router";
import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
import { VueQueryPlugin } from "@tanstack/vue-query";
import {createPinia} from "pinia";
const pinia = createPinia();


createApp(App).use(router).use(VueQueryPlugin).use(Toast).use(pinia).mount("#app");
