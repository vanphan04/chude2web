<template>
  <v-container>
    <v-card class="pa-5">
      <v-card-title class="text-h5">Danh sách khách hàng đã đặt phòng</v-card-title>
      <v-divider class="my-3" />

      <!-- 🔍 Ô tìm kiếm -->
      <v-text-field
        v-model="search"
        label="Tìm theo tên, SĐT, hoặc loại phòng"
        append-inner-icon="mdi-magnify"
        class="mb-4"
        clearable
      />

      <!-- 📋 Bảng danh sách khách hàng -->
      <v-data-table
        :headers="headers"
        :items="filteredCustomers"
        :items-per-page="5"
        class="elevation-1"
      >
        <!-- Hiển thị trạng thái với màu sắc và chữ dễ phân biệt -->
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.Status)"
            dark
            small
            class="text-uppercase font-weight-bold"
          >
            {{ item.Status }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'Customers',
  data() {
    return {
      search: '',
      headers: [
        { title: 'Tên khách hàng', value: 'CustomerName' },
        { title: 'Số điện thoại', value: 'CustomerPhone' },
        { title: 'Ngày nhận phòng', value: 'CheckInDate' },
        { title: 'Ngày trả phòng', value: 'CheckOutDate' },
        { title: 'Loại phòng', value: 'RoomType' },
        { title: 'Trạng thái', value: 'Status' },
      ],
      customers: [],
    };
  },
  computed: {
    filteredCustomers() {
      if (!this.search) return this.customers;

      const lowerSearch = this.search.toLowerCase();
      return this.customers.filter((cust) =>
        cust.CustomerName?.toLowerCase().includes(lowerSearch) ||
        cust.CustomerPhone?.toLowerCase().includes(lowerSearch) ||
        cust.RoomType?.toLowerCase().includes(lowerSearch) // Tìm kiếm theo loại phòng
      );
    },
  },
  mounted() {
    this.fetchCustomers();
  },
  methods: {
    async fetchCustomers() {
      try {
        const response = await this.$axios.get('http://localhost:3000/customers');
        this.customers = response.data;
      } catch (error) {
        console.error('Lỗi khi lấy danh sách khách hàng:', error);
      }
    },
    getStatusColor(status) {
      switch (status) {
        case 'Confirmed':
          return 'green';
        case 'Cancelled':
          return 'red';
        case 'Pending':
          return 'orange';
        default:
          return 'grey';
      }
    },
  },
};
</script>

<style scoped>
.v-container {
  margin-top: 20px;
}

.v-chip {
  text-transform: uppercase;
  font-weight: bold;
  padding: 5px 10px;
}

</style>
