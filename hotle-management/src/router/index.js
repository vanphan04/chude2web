import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Login from "../views/Login.vue";
import Rooms from "../views/Rooms.vue";
import Reservations from "../views/Reservations.vue";
import Customers from "../views/Customers.vue";
import Employees from "../views/Employees.vue";

const routes = [
  { path: "/login", component: Login },
  { path: "/", component: Dashboard, meta: { requiresAuth: true } },
  { path: "/rooms", component: Rooms, meta: { requiresAuth: true } },
  { path: "/reservations", component: Reservations, meta: { requiresAuth: true } },
  { path: "/customers", component: Customers, meta: { requiresAuth: true } },
  { path: "/employees", component: Employees, meta: { requiresAuth: true, roles: [3] } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 🔹 Kiểm tra quyền truy cập trước khi vào route
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const role = parseInt(localStorage.getItem("role")); 

  if (to.meta.requiresAuth) {
    if (!token) {
      return next("/login"); // ❌ Nếu chưa đăng nhập, chuyển về login
    }
    if (to.meta.roles && !to.meta.roles.includes(role)) {
      return next("/"); // ❌ Nếu không có quyền, quay về trang chính
    }
  }
  next();
});

export default router;
