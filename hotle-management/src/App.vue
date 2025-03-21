<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Quản Lý Khách Sạn</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text to="/">Dashboard</v-btn>
      <v-btn text to="/rooms">Phòng</v-btn>
      <v-btn text to="/reservations">Đặt Phòng</v-btn>
      <v-btn text to="/customers">Khách Hàng</v-btn>
      <v-btn v-if="role === 'admin'" text to="/employees">Nhân Viên</v-btn> 
      <v-btn v-if="isAuthenticated" text @click="logout">Đăng Xuất</v-btn>
      <v-btn v-else text to="/login">Đăng Nhập</v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem("token");
    },
    role() {
      return localStorage.getItem("role");
    }
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      this.$router.push("/login");
    }
  }
};
</script>
