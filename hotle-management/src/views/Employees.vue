<template>
    <v-container>
      <v-card class="pa-5">
        <v-card-title class="text-h5">Quản lý Nhân viên</v-card-title>
        <v-divider class="my-3"></v-divider>
        <v-btn color="primary" class="mb-3" @click="openAddDialog">Thêm nhân viên</v-btn>
        <v-data-table :headers="headers" :items="employees" class="elevation-1">
          <template v-slot:item.actions="{ item }">
            <v-btn color="primary" small @click="openEditDialog(item)">Chỉnh sửa</v-btn>
            <v-btn color="error" small @click="deleteEmployee(item.id)">Xóa</v-btn>
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
            <v-select v-model="editedEmployee.role" :items="roles" label="Cấp quyền"></v-select>
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
  export default {
    name: "EmployeesView",
    data() {
      return {
        employees: [
          { id: 1, name: "Nguyễn Văn A", email: "a@example.com", role: "Nhân viên" },
          { id: 2, name: "Trần Thị B", email: "b@example.com", role: "Quản lý" }
        ],
        headers: [
          { text: "Tên", value: "name" },
          { text: "Email", value: "email" },
          { text: "Cấp quyền", value: "role" },
          { text: "Hành động", value: "actions", sortable: false }
        ],
        roles: ["Nhân viên", "Quản lý", "Admin"],
        editDialog: false,
        editedEmployee: {},
        isEditing: false
      };
    },
    methods: {
      openAddDialog() {
        this.editedEmployee = { name: "", email: "", role: "Nhân viên" };
        this.isEditing = false;
        this.editDialog = true;
      },
      openEditDialog(employee) {
        this.editedEmployee = { ...employee };
        this.isEditing = true;
        this.editDialog = true;
      },
      saveEmployee() {
        if (this.isEditing) {
          const index = this.employees.findIndex(emp => emp.id === this.editedEmployee.id);
          if (index !== -1) {
            this.employees[index] = { ...this.editedEmployee };
          }
        } else {
          this.editedEmployee.id = this.employees.length + 1;
          this.employees.push({ ...this.editedEmployee });
        }
        this.editDialog = false;
      },
      deleteEmployee(employeeId) {
        this.employees = this.employees.filter(emp => emp.id !== employeeId);
      }
    }
  };
  </script>
  
  <style scoped>
  .v-container {
    margin-top: 20px;
  }
  </style>