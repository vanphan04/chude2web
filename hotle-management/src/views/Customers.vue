<template>
  <v-container>
    <v-card class="pa-5">
      <v-card-title class="text-h5">Quản lý Khách hàng</v-card-title>
      <v-divider class="my-3"></v-divider>
      <v-list>
        <v-list-item v-for="customer in customers" :key="customer.id">
          <v-list-item-content>
            <v-list-item-title>{{ customer.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ customer.phone }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn color="primary" @click="editCustomer(customer)">Chỉnh sửa</v-btn>
            <v-btn color="error" @click="deleteCustomer(customer.id)">Xóa</v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "CustomersView",
  data() {
    return {
      customers: [
        { id: 1, name: "Nguyễn Văn A", phone: "0123456789" },
        { id: 2, name: "Trần Thị B", phone: "0987654321" }
      ]
    };
  },
  methods: {
    editCustomer(customer) {
      alert("Chỉnh sửa khách hàng: " + customer.name);
    },
    deleteCustomer(customerId) {
      this.customers = this.customers.filter(customer => customer.id !== customerId);
    }
  }
};
</script>

<style scoped>
.v-container {
  margin-top: 20px;
}
</style>
