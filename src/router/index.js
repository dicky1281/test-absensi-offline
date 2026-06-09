import { createRouter, createWebHistory } from "vue-router";

import Absensi from "../pages/attendance.vue";
import Riwayat from "../pages/Riwayat.vue";
import Login from "../pages/login.vue";

const routes = [
  {
    path: "/",
    component: Absensi,
  },
  {
    path: "/riwayat",
    component: Riwayat,
  },
  {
    path: "/login",
    component: Login,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
