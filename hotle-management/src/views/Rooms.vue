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

      <!-- Danh sách phòng -->
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
              <v-btn
                :color="room.status === 'Trống' ? 'blue' : 'red'"
                @click="room.status === 'Trống' ? openBookingDialog(room) : cancelBooking(room)"
              >
                {{ room.status === 'Trống' ? 'Đặt ngay' : 'Hủy đặt' }}
              </v-btn>
              <v-btn
                v-if="room.status === 'Đã đặt'"
                color="green"
                @click="openPaymentDialog(room)"
              >
                Thanh toán
              </v-btn>
              <v-btn v-if="role === 'admin'" color="primary" @click="openEditDialog(room)">Chỉnh sửa</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <!-- Dialog đặt phòng -->
    <v-dialog v-model="bookingDialog" max-width="500px">
      <v-card>
        <v-card-title>Đặt phòng số {{ selectedRoom?.roomid }}</v-card-title>
        <v-card-text>
          <v-text-field v-model="bookingForm.name" label="Tên khách hàng" required />
          <v-text-field v-model="bookingForm.phone" label="Số điện thoại" required />
          <v-text-field v-model="bookingForm.checkin" label="Ngày nhận phòng" type="date" required />
          <v-text-field v-model="bookingForm.checkout" label="Ngày trả phòng" type="date" required />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="confirmBooking">Xác nhận</v-btn>
          <v-btn text @click="bookingDialog = false">Hủy</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog thanh toán -->
    <v-dialog v-model="paymentDialog" max-width="500px">
      <v-card>
        <v-card-title>Thanh toán phòng {{ selectedRoom?.roomid }}</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="paymentForm.amount"
            label="Số tiền thanh toán"
            :value="selectedRoom?.price"
            disabled
          />
          <v-text-field v-model="paymentForm.paymentMethod" label="Phương thức thanh toán" required />
        </v-card-text>
        <v-card-actions>
          <v-btn color="green" @click="confirmPayment">Thanh toán</v-btn>
          <v-btn text @click="paymentDialog = false">Hủy</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import api from "@/api";

export default {
  name: "RoomsView",
  data() {
    return {
      rooms: [],
      filterStatus: "Tất cả",
      filterType: "Tất cả",
      role: "admin", // Giả lập phân quyền
      bookingDialog: false,
      paymentDialog: false,
      selectedRoom: null,
      bookingForm: {
        name: "",
        phone: "",
        checkin: "",
        checkout: "",
      },
      paymentForm: {
        amount: 0,
        paymentMethod: "",
      },
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
      this.selectedRoom = room;
      this.bookingForm = {
        name: "",
        phone: "",
        checkin: "",
        checkout: "",
      };
      this.bookingDialog = true;
    },
    async confirmBooking() {
      try {
        const payload = {
          ...this.bookingForm,
          roomid: this.selectedRoom.roomid,
        };
        const response = await api.post("/booking", payload);
        this.bookingDialog = false;
        this.loadRooms();
        alert("✅ Đặt phòng thành công!");
      } catch (err) {
        alert("❌ Lỗi khi đặt phòng");
        console.error(err);
      }
    },
    async cancelBooking(room) {
      try {
        await api.put(`/room/${room.roomid}`, {
          ...room,
          status: "available",
        });
        this.loadRooms();
        alert("✅ Đã hủy đặt phòng");
      } catch (err) {
        console.error("❌ Lỗi khi hủy đặt phòng:", err);
      }
    },
    openPaymentDialog(room) {
      this.selectedRoom = room;
      this.paymentForm = {
        amount: room.price,
        paymentMethod: "",
      };
      this.paymentDialog = true;
    },
    async confirmPayment() {
      try {
        const payload = {
          roomid: this.selectedRoom.roomid,
          amount: this.paymentForm.amount,
          paymentMethod: this.paymentForm.paymentMethod,
        };
        await api.post("/payment", payload); // Tạo route thanh toán trên backend
        this.paymentDialog = false;
        this.loadRooms();
        alert("✅ Thanh toán thành công!");
      } catch (err) {
        alert("❌ Lỗi khi thanh toán");
        console.error(err);
      }
    },
    openEditDialog(room) {
      console.log("Chỉnh sửa phòng:", room);
      // TODO: Mở form chỉnh sửa
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
