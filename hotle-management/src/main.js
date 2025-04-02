import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import { createVuetify } from "vuetify";
import "vuetify/styles"; // Import styles Vuetify
import "@mdi/font/css/materialdesignicons.css"; // Icon Vuetify

// Import tất cả component và directives của Vuetify
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import axios from 'axios';

const vuetify = createVuetify({
  components,
  directives,
});

const pinia = createPinia();
const app = createApp(App);
app.config.globalProperties.$axios = axios;

app.use(pinia);
app.use(router);
app.use(vuetify); // Thêm Vuetify vào ứng dụng
app.mount("#app");
