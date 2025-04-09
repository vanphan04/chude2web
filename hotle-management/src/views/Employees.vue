<template>
  <v-container>
    <v-card class="pa-5">
      <v-card-title class="text-h5">Quản lý Nhân viên</v-card-title>
      <v-divider class="my-3"></v-divider>
      <v-btn color="primary" class="mb-3" @click="openAddDialog">Thêm nhân viên</v-btn>
      <v-data-table :headers="headers" :items="employees" class="elevation-1">
        <template v-slot:item.actions="{ item }">
          <v-btn color="primary" small @click="openEditDialog(item)">Chỉnh sửa</v-btn>
          <v-btn color="error" small @click="deleteEmployee(item.staffid)">Xóa</v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog thêm/chỉnh sửa nhân viên -->
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title>{{ isEditing ? 'Chỉnh sửa' : 'Thêm' }} nhân viên</v-card-title>
        <v-card-text>
          <v-text-field v-model="editedEmployee.name" label="Tên nhân viên"></v-text-field>
          <v-text-field v-model="editedEmployee.email" label="Email"></v-text-field>
          <v-text-field v-model="editedEmployee.phone" label="Số điện thoại"></v-text-field>
          <v-select v-model="editedEmployee.position" :items="roles" label="Chức vụ"></v-select>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="saveEmployee">Lưu</v-btn>
          <v-btn color="error" @click="editDialog = false">Hủy</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: "EmployeesView",
  data() {
    return {
      employees: [],
      headers: [
        { text: "Tên", value: "name" },
        { text: "Email", value: "email" },
        { text: "Số điện thoại", value: "phone" },
        { text: "Chức vụ", value: "position" },
        { text: "Hành động", value: "actions", sortable: false }
      ],
      roles: ["Nhân viên", "Quản lý", "Admin"],
      editDialog: false,
      editedEmployee: {},
      isEditing: false,
      apiBase: 'http://localhost:3000' // backend link
    };
  },
  methods: {
    fetchEmployees() {
      axios.get(`${this.apiBase}/staff`)
        .then(res => this.employees = res.data)
        .catch(err => console.error("Lỗi khi lấy nhân viên:", err));
    },
    openAddDialog() {
      this.editedEmployee = { name: "", email: "", phone: "", position: "Nhân viên" };
      this.isEditing = false;
      this.editDialog = true;
    },
    openEditDialog(employee) {
      this.editedEmployee = { ...employee };
      this.isEditing = true;
      this.editDialog = true;
    },
    saveEmployee() {
  console.log('Dữ liệu gửi đi:', this.editedEmployee); // Debug

  if (this.isEditing) {
    axios.put(`${this.apiBase}/staff/${this.editedEmployee.staffid}`, this.editedEmployee)
      .then(() => {
        this.fetchEmployees();
        this.editDialog = false;
      })
      .catch(err => console.error("Lỗi cập nhật:", err));
  } else {
    axios.post(`${this.apiBase}/staff`, this.editedEmployee)
      .then(() => {
        this.fetchEmployees();
        this.editDialog = false;
      })
      .catch(err => console.error("Lỗi thêm:", err));
  }
}
,
    deleteEmployee(id) {
      // Thêm nếu bạn muốn có chức năng xoá
      if (confirm("Bạn có chắc muốn xoá nhân viên này không?")) {
        axios.delete(`${this.apiBase}/staff/${id}`)
          .then(() => this.fetchEmployees())
          .catch(err => console.error("Lỗi xoá:", err));
      }
    }
  },
  mounted() {
    this.fetchEmployees();
  }
};
</script>

<style scoped>
.v-container {
  margin-top: 20px;
}
</style>
