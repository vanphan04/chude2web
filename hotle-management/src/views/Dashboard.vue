// src/views/Dashboard.vue
<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="pa-5">
          <v-card-title class="text-h5">Dashboard - Quản lý khách sạn</v-card-title>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col cols="12" md="3">
              <v-card color="blue lighten-4" class="pa-3">
                <v-card-title>Phòng</v-card-title>
                <v-card-subtitle>120 phòng</v-card-subtitle>
              </v-card>
            </v-col>
            <v-col cols="12" md="3">
              <v-card color="green lighten-4" class="pa-3">
                <v-card-title>Đặt phòng</v-card-title>
                <v-card-subtitle>50 đơn đang xử lý</v-card-subtitle>
              </v-card>
            </v-col>
            <v-col cols="12" md="3">
              <v-card color="orange lighten-4" class="pa-3">
                <v-card-title>Khách hàng</v-card-title>
                <v-card-subtitle>300 khách</v-card-subtitle>
              </v-card>
            </v-col>
            <v-col cols="12" md="3">
              <v-card color="red lighten-4" class="pa-3">
                <v-card-title>Nhân viên</v-card-title>
                <v-card-subtitle>20 nhân viên</v-card-subtitle>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "DashboardView"
};
</script>

<style scoped>
.v-container {
  margin-top: 20px;
}
</style>
