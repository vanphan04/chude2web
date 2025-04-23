<template>
  <v-container>
    <v-card class="pa-5">
      <v-card-title class="text-h5">Quản lý Phòng</v-card-title>
      <v-divider class="my-3"></v-divider>

      <!-- Bộ lọc phòng -->
      <v-row>
        <v-col cols="6">
          <v-select
            v-model="filterStatus"
            label="Lọc theo trạng thái"
            :items="['Tất cả', 'Trống', 'Đã đặt']"
          />
        </v-col>
        <v-col cols="6">
          <v-select
            v-model="filterType"
            label="Lọc theo loại phòng"
            :items="['Tất cả', 'Đơn', '2 giường']"
          />
        </v-col>
      </v-row>

      <!-- Danh sách phòng -->
      <v-row>
        <v-col
          cols="12"
          sm="6"
          md="3"
          v-for="room in filteredRooms"
          :key="room.roomid"
        >
          <v-card>
            <v-img :src="room.image" height="150px" />

            <v-card-title>Phòng {{ room.roomid }}</v-card-title>
            <v-card-subtitle>Loại: {{ room.roomtype }}</v-card-subtitle>
            <v-card-text>
              Giá: {{ room.price }} VNĐ/đêm<br />
              Trạng thái:
              <v-chip :color="room.status === 'Trống' ? 'green' : 'red'" dark>
                {{ room.status }}
              </v-chip>
            </v-card-text>
            <v-card-actions>
              <!-- Đặt / Hủy đặt -->
              <v-btn
                :color="room.status === 'Trống' ? 'blue' : 'red'"
                @click="room.status === 'Trống' ? openBookingDialog(room) : cancelBooking(room)"
              >
                {{ room.status === 'Trống' ? 'Đặt ngay' : 'Hủy đặt' }}
              </v-btn>
              <!-- Thanh toán nếu đã đặt -->
              <v-btn
                v-if="room.status === 'Đã đặt'"
                color="green"
                @click="openPaymentDialog(room)"
              >
                Thanh toán
              </v-btn>
              <!-- Chỉnh sửa nếu admin -->
              <v-btn
                v-if="role === 'admin'"
                color="primary"
                @click="openEditDialog(room)"
              >
                Chỉnh sửa
              </v-btn>
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
          <v-text-field
            v-model="bookingForm.name"
            label="Tên khách hàng"
            required
          />
          <v-text-field
            v-model="bookingForm.phone"
            label="Số điện thoại"
            required
          />
          <v-text-field
            v-model="bookingForm.checkin"
            label="Ngày nhận phòng"
            type="date"
            required
          />
          <v-text-field
            v-model="bookingForm.checkout"
            label="Ngày trả phòng"
            type="date"
            required
          />
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
        <v-card-title>
          Thanh toán phòng {{ selectedRoom?.roomid }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="paymentForm.amount"
            label="Số tiền thanh toán"
            :value="selectedRoom?.price"
            disabled
          />
          <v-text-field
            v-model="paymentForm.paymentMethod"
            label="Phương thức thanh toán"
            required
          />
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
import axios from 'axios';

export default {
  name: 'RoomsView',
  data() {
    return {
      rooms: [],
      filterStatus: 'Tất cả',
      filterType: 'Tất cả',
      role: 'admin',
      bookingDialog: false,
      paymentDialog: false,
      selectedRoom: null,
      bookingForm: { name: '', phone: '', checkin: '', checkout: '' },
      paymentForm: { amount: 0, paymentMethod: '' }
    };
  },
  computed: {
    filteredRooms() {
      return this.rooms.filter(room => {
        const ms = this.filterStatus === 'Tất cả' || room.status === this.filterStatus;
        const mt = this.filterType === 'Tất cả' || room.roomtype === this.filterType;
        return ms && mt;
      });
    }
  },
  created() {
    this.loadRooms();
  },
  methods: {
    async loadRooms() {
      try {
        const { data } = await axios.get('http://localhost:3000/room');
        this.rooms = data.map(r => ({
          roomid: r.RoomID,
          roomtype: r.RoomType,
          price: r.Price,
          status: r.Status === 'Available' ? 'Trống' : 'Đã đặt',
          image: r.image ? `http://localhost:3000/images/${r.image}` : 'https://via.placeholder.com/200'
        }));
      } catch (err) {
        console.error('Lỗi khi tải danh sách phòng:', err);
      }
    },
    openBookingDialog(room) {
      this.selectedRoom = room;
      this.bookingForm = { name: '', phone: '', checkin: '', checkout: '' };
      this.bookingDialog = true;
    },
    async confirmBooking() {
      try {
        const payload = {
          roomid: this.selectedRoom.roomid,
          customerid: 1,
          checkindate: this.bookingForm.checkin,
          checkoutdate: this.bookingForm.checkout
        };
        await axios.post('http://localhost:3000/reservation', payload);
        this.bookingDialog = false;
        await this.loadRooms();
        alert('✅ Đặt phòng thành công!');
      } catch (err) {
        console.error('Lỗi khi xác nhận đặt phòng:', err);
        alert(err.response?.data?.message || 'Lỗi đặt phòng');
      }
    },
    async cancelBooking(room) {
      try {
        const response = await axios.put(`http://localhost:3000/room/${room.roomid}/cancel`);

        if (response.status === 200) {
          this.loadRooms();
          alert("✅ Đã hủy đặt phòng");
        }
      } catch (err) {
        console.error("❌ Lỗi khi hủy đặt phòng:", err);
        alert("❌ Lỗi khi hủy đặt phòng");
      }
    },
    openPaymentDialog(room) {
      this.selectedRoom = room;
      this.paymentForm = { amount: room.price, paymentMethod: '' };
      this.paymentDialog = true;
    },
    async confirmPayment() {
      try {
        const payload = {
          roomid: this.selectedRoom.roomid,
          amount: this.paymentForm.amount,
          paymentMethod: this.paymentForm.paymentMethod
        };
        await axios.post('http://localhost:3000/payment', payload);
        this.paymentDialog = false;
        await this.loadRooms();
        alert('✅ Thanh toán thành công!');
      } catch (err) {
        console.error('Lỗi thanh toán:', err);
        alert('Lỗi thanh toán');
      }
    },
    openEditDialog(room) {
      console.log('Chỉnh sửa', room);
      // TODO: mở form chỉnh sửa
    }
  }
};
</script>

<style scoped>
.v-container { margin-top: 20px; }
.v-card { margin-bottom: 20px; }
</style>
