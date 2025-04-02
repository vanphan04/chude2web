<template>
  <v-container>
    <v-card class="pa-5">
      <v-card-title class="text-h5">Đặt phòng</v-card-title>
      <v-divider class="my-3"></v-divider>

      <v-form ref="form" @submit.prevent="submitReservation">
        <v-text-field
          label="Họ và tên"
          v-model="reservation.name"
          :rules="[rules.required]"
          required
        ></v-text-field>

        <v-text-field
          label="Số điện thoại"
          v-model="reservation.phone"
          :rules="[rules.required, rules.phone]"
          required
        ></v-text-field>

        <v-select
          label="Chọn phòng"
          :items="rooms"
          v-model="reservation.room"
          item-title="name"
          item-value="id"
          required
        ></v-select>

        <v-text-field
          label="Ngày nhận phòng"
          v-model="reservation.checkInDate"
          type="date"
          required
        ></v-text-field>

        <v-text-field
          label="Ngày trả phòng"
          v-model="reservation.checkOutDate"
          type="date"
          required
        ></v-text-field>

        <v-alert v-if="selectedRoom" type="info" class="my-3">
          Giá phòng: {{ selectedRoom.price.toLocaleString() }} VNĐ / đêm
        </v-alert>

        <v-btn type="submit" color="primary">Xác nhận đặt phòng</v-btn>
      </v-form>

      <v-snackbar v-model="snackbar" :timeout="3000" color="green">
        {{ successMessage }}
      </v-snackbar>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'ReservationsView',
  data() {
    return {
      reservation: {
        name: '',
        phone: '',
        room: null,
        checkInDate: '',
        checkOutDate: '',
      },
      rooms: [
        {
          id: 1,
          name: 'Phòng Deluxe',
          type: 'Đơn',
          price: 500000,
          image: 'https://via.placeholder.com/200',
        },
        {
          id: 2,
          name: 'Phòng VIP',
          type: 'Đôi',
          price: 800000,
          image: 'https://via.placeholder.com/200',
        },
        {
          id: 3,
          name: 'Phòng Family',
          type: 'Gia đình',
          price: 1200000,
          image: 'https://bizweb.dktcdn.net/100/363/864/products/2w0a0109.jpg?v=1644744386330',
        },
      ],
      snackbar: false,
      successMessage: '',
      rules: {
        required: (value) => !!value || 'Trường hợp này không được để trống',
        phone: (value) => /^0\d{9}$/.test(value) || 'Số điện thoại không hợp lệ',
      },
    }
  },
  computed: {
    selectedRoom() {
      return this.rooms.find((room) => room.id === this.reservation.room)
    },
  },
  methods: {
    resetForm() {
      this.reservation = {
        name: '',
        phone: '',
        room: null,
        checkInDate: '',
        checkOutDate: '',
      }
      this.$refs.form.reset() // Reset lại form nếu sử dụng Vuetify form
    },

    submitReservation() {
      if (this.$refs.form.validate()) {
        this.successMessage = `Đặt phòng thành công cho ${this.reservation.name}, Phòng: ${this.selectedRoom.name}`
        this.$axios
          .post('http://localhost:3000/booking', {
            name: this.reservation.name,
            phone: this.reservation.phone,
            roomid: this.reservation.room,
            checkin: this.reservation.checkInDate,
            checkout: this.reservation.checkOutDate,
          })
          .then((response) => {
            this.snackbar = true
            this.resetForm()
          })
      }
    },
  },
}
</script>

<style scoped>
.v-container {
  margin-top: 20px;
}
</style>
