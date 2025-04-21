<template>
  <v-container>
    <v-card class="pa-5 mx-auto" max-width="400">
      <v-card-title class="text-h5">Đăng Nhập</v-card-title>
      <v-card-text>
        <v-text-field v-model="username" label="Tên đăng nhập" required></v-text-field>
        <v-text-field v-model="password" label="Mật khẩu" type="password" required></v-text-field>
        <v-alert v-if="errorMessage" type="error" dense>{{ errorMessage }}</v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" block @click="handleLogin">Đăng Nhập</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        // Lấy URL API từ biến môi trường
        const apiUrl = import.meta.env.VITE_API_URL;

        // Gửi request POST tới API đăng nhập
        const response = await axios.post(`${apiUrl}/login`, {
          username: this.username,
          password: this.password,
        });

        if (response.data.accessToken) {
          localStorage.setItem("token", response.data.accessToken); // Lưu token
          localStorage.setItem("role", response.data.role); // Lưu role
          localStorage.setItem("StaffID",response.data.StaffID); 
          // this.$router.push("/"); // Chuyển hướng về trang chủ

          if (response.data.role === 3) {
            this.$router.push("/employees"); // Admin → Employees
          }
          else{
            this.$router.push("/"); // Các quyền khác → Dashboard
          }
        }
      } catch (error) {
        if (error.response) {
          this.errorMessage = error.response.data.message || "Sai tài khoản hoặc mật khẩu!";
        } else {
          this.errorMessage = "Lỗi kết nối đến server!";
        }
      }
    }
  }
};
</script>
