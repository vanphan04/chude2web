<template>
  <v-container>
    <v-card class="pa-5 mx-auto" max-width="400">
      <v-card-title class="text-h5">Đăng Nhập</v-card-title>
      <v-card-text>
        <v-text-field v-model="username" label="Tên đăng nhập"></v-text-field>
        <v-text-field v-model="password" label="Mật khẩu" type="password"></v-text-field>
        <v-alert v-if="errorMessage" type="error" dense>{{ errorMessage }}</v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" block @click="handleLogin">Đăng Nhập</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    handleLogin() {
      const users = {
        admin: { password: "123456", role: "admin" },
        nhanvien: { password: "123456", role: "nhanvien" },
      };

      if (users[this.username] && users[this.username].password === this.password) {
        const role = users[this.username].role;
        localStorage.setItem("token", "fake-jwt-token"); 
        localStorage.setItem("role", role); 
        this.$router.push("/"); 
      } else {
        this.errorMessage = "Sai tên đăng nhập hoặc mật khẩu!";
      }
    }
  }
};
</script>
