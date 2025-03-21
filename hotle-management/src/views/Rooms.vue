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
          <v-select v-model="filterType" label="Lọc theo loại phòng" :items="['Tất cả', 'Đơn', 'Đôi']"></v-select>
        </v-col>
      </v-row>

      <v-expansion-panels>
        <v-expansion-panel v-for="(floor, index) in floors" :key="index">
          <v-expansion-panel-title>Tầng {{ floor.floor }}</v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row>
              <v-col cols="12" sm="6" md="3" v-for="room in filteredRooms(floor.rooms)" :key="room.id">
                <v-card>
                  <v-img :src="room.image" height="150px"></v-img>
                  <v-card-title>Phòng {{ room.number }}</v-card-title>
                  <v-card-subtitle>Loại: {{ room.type }}</v-card-subtitle>
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
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>

    <!-- Dialog chỉnh sửa phòng -->
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title>Chỉnh sửa thông tin phòng</v-card-title>
        <v-card-text>
          <v-text-field v-model="editedRoom.number" label="Số phòng" disabled></v-text-field>
          <v-text-field v-model="editedRoom.type" label="Loại phòng"></v-text-field>
          <v-text-field v-model="editedRoom.price" label="Giá tiền" type="number"></v-text-field>
          <v-select v-model="editedRoom.status" label="Trạng thái" :items="['Trống', 'Đã đặt']"></v-select>
          <v-img :src="editedRoom.image" height="150px"></v-img>
          <v-file-input label="Tải ảnh mới" @change="handleFileUpload"></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="saveEdit">Lưu</v-btn>
          <v-btn color="error" @click="editDialog = false">Hủy</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog đặt phòng -->
    <v-dialog v-model="bookingDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Đặt Phòng</v-card-title>
        <v-card-text>
          <v-text-field v-model="bookingInfo.customerName" label="Tên khách hàng" required></v-text-field>
          <v-text-field v-model="bookingInfo.phone" label="Số điện thoại" required></v-text-field>
          <v-text-field v-model="bookingInfo.checkInDate" label="Ngày nhận phòng" type="date"></v-text-field>
          <v-text-field v-model="bookingInfo.checkOutDate" label="Ngày trả phòng" type="date"></v-text-field>
          <p><b>Tổng tiền:</b> {{ totalPrice }} VNĐ</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="confirmBooking">Xác nhận</v-btn>
          <v-btn color="error" @click="bookingDialog = false">Hủy</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "RoomsView",
  data() {
    return {
      floors: [],
      editDialog: false,
      editedRoom: {},
      filterStatus: "Tất cả",
      filterType: "Tất cả",
      bookingDialog: false,
      bookingRoom: null,
      bookingInfo: {
        customerName: "",
        phone: "",
        checkInDate: "",
        checkOutDate: "",
      },
    };
  },
  created() {
    this.loadRooms();
  },
  computed: {
    totalPrice() {
      if (!this.bookingInfo.checkInDate || !this.bookingInfo.checkOutDate) return 0;
      let start = new Date(this.bookingInfo.checkInDate);
      let end = new Date(this.bookingInfo.checkOutDate);
      let days = (end - start) / (1000 * 60 * 60 * 24);
      return days * (this.bookingRoom ? this.bookingRoom.price : 0);
    },
    role() {
    return localStorage.getItem("role") || "guest";
  }
  },
  methods: {
    loadRooms() {
      const totalFloors = 5;
      const roomsPerFloor = 4;
      let id = 1;
      let data = [];

      for (let floor = 1; floor <= totalFloors; floor++) {
        let rooms = [];
        for (let i = 1; i <= roomsPerFloor; i++) {
          rooms.push({
            id: id,
            number: `${floor}0${i}`,
            type: i % 2 === 0 ? "Đôi" : "Đơn",
            price: i % 2 === 0 ? 800000 : 500000,
            status: "Trống",
            image: "https://via.placeholder.com/200"
          });
          id++;
        }
        data.push({ floor, rooms });
      }
      this.floors = data;
    },

    filteredRooms(rooms) {
      return rooms.filter(room => {
        let matchStatus = this.filterStatus === "Tất cả" || room.status === this.filterStatus;
        let matchType = this.filterType === "Tất cả" || room.type === this.filterType;
        return matchStatus && matchType;
      });
    },

    openEditDialog(room) {
      this.editedRoom = { ...room };
      this.editDialog = true;
    },

    saveEdit() {
  for (let floor of this.floors) {
    let roomIndex = floor.rooms.findIndex(r => r.id === this.editedRoom.id);
    if (roomIndex !== -1) {
      floor.rooms[roomIndex] = { ...this.editedRoom };
      this.$forceUpdate(); 
      break;
    }
  }
  this.editDialog = false;
},

    
    openBookingDialog(room) {
  if (room.status === "Đã đặt") {
    if (confirm("Bạn có chắc muốn hủy đặt phòng này?")) {
      room.status = "Trống"; 
    }
    return;
  }
  this.bookingRoom = room;
  this.bookingDialog = true;
},


    confirmBooking() {
      this.bookingRoom.status = "Đã đặt";
      this.bookingDialog = false;
    }
  }
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
