<template>
  <v-container>
    <v-card class="pa-5">
      <v-card-title class="text-h5">Quản lý Phòng</v-card-title>
      <v-divider class="my-3"></v-divider>

      <!-- Bộ lọc phòng -->
      <v-row>
        <v-col cols="6">
          <v-select v-model="filterStatus" label="Lọc theo trạng thái" :items="['Tất cả', 'Trống', 'Đã đặt']"></v-select>
        </v-col>
        <v-col cols="6">
          <v-select v-model="filterType" label="Lọc theo loại phòng" :items="['Tất cả', 'Đơn', '2 giường']"></v-select>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="6" md="3" v-for="room in filteredRooms" :key="room.roomid">
          <v-card>
            <v-img :src="room.image || 'https://via.placeholder.com/200'" height="150px"></v-img>
            <v-card-title>Phòng {{ room.roomid }}</v-card-title>
            <v-card-subtitle>Loại: {{ room.roomtype }}</v-card-subtitle>
            <v-card-text>
              Giá: {{ room.price }} VNĐ/đêm <br />
              Trạng thái: 
              <v-chip :color="room.status === 'Trống' ? 'green' : 'red'" dark>
                {{ room.status }}
              </v-chip>
            </v-card-text>
            <v-card-actions>
              <v-btn color="blue" @click="openBookingDialog(room)">
                {{ room.status === 'Trống' ? 'Đặt ngay' : 'Hủy đặt' }}
              </v-btn>
              <v-btn v-if="role === 'admin'" color="primary" @click="openEditDialog(room)">Chỉnh sửa</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import api from "@/api";
const response = await api.get('/room');
export default {
  name: "RoomsView",
  data() {
    return {
      rooms: [],
      filterStatus: "Tất cả",
      filterType: "Tất cả",
      role: "admin", // Giả sử có phân quyền (có thể lấy từ Vuex hoặc API)
    };
  },
  computed: {
    filteredRooms() {
      return this.rooms.filter((room) => {
        let matchStatus = this.filterStatus === "Tất cả" || room.status === this.filterStatus;
        let matchType = this.filterType === "Tất cả" || room.roomtype === this.filterType;
        return matchStatus && matchType;
      });
    },
  },
  created() {
    this.loadRooms();
  },
  methods: {
    async loadRooms() {
      try {
        const response = await api.get("/room");
        this.rooms = response.data.map((room) => ({
          roomid: room.roomid,
          roomtype: room.roomtype,
          price: room.price,
          status: room.status === "available" ? "Trống" : "Đã đặt",
          image: room.image,
        }));
      } catch (error) {
        console.error("Lỗi khi tải danh sách phòng:", error);
      }
    },
    openBookingDialog(room) {
      console.log("Đặt phòng:", room);
      // Xử lý logic đặt phòng
    },
    openEditDialog(room) {
      console.log("Chỉnh sửa phòng:", room);
      // Xử lý logic chỉnh sửa
    },
  },
};
</script>

<style scoped>
.v-container {
  margin-top: 20px;
}
.v-card {
  margin-bottom: 20px;
}
</style>