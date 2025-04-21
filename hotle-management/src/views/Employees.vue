<template>
  <v-container>
    <v-card class="pa-5">
      <v-card-title class="text-h5">Quản lý Nhân viên</v-card-title>
      <v-divider class="my-3"></v-divider>
      <v-btn color="primary" class="mb-3" @click="openAddDialog">Thêm nhân viên</v-btn>
      <v-data-table
        :headers="headers"
        :items="employees"
        class="elevation-1"
        item-key="staffid"
        :loading="loading"
        loading-text="Đang tải dữ liệu..."
      >
        <!-- Slot header cho Vuetify 3 -->
        <template v-slot:header="{ columns }">
          <tr>
            <th v-for="column in columns" :key="column.key" :class="column.align ? `text-${column.align}` : ''">
              <span class="font-weight-bold">{{ column.title }}</span>
            </th>
          </tr>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn color="primary" small @click="openEditDialog(item)">Chỉnh sửa</v-btn>
          <v-btn color="error" small class="ml-2" @click="deleteEmployee(item.staffid)">Xóa</v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog thêm/chỉnh sửa nhân viên -->
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title>{{ isEditing ? 'Chỉnh sửa' : 'Thêm' }} nhân viên</v-card-title>
        <v-card-text>
          <v-text-field v-model="editedEmployee.name" label="Tên nhân viên" required></v-text-field>
          <v-text-field v-model="editedEmployee.email" label="Email" type="email" required></v-text-field>
          <v-text-field v-model="editedEmployee.phoneNumber" label="Số điện thoại" type="tel" required></v-text-field>
          <v-select v-model="editedEmployee.position" :items="roles" label="Chức vụ" required></v-select>
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
import axios from "axios";

export default {
  name: "EmployeesView",
  data() {
    return {
      employees: [],
      headers: [
        { title: "Tên nhân viên", key: "name", align: "start" },
        { title: "Email", key: "email", align: "start" },
        { title: "Chức vụ", key: "position", align: "start" },
        { title: "Hành động", key: "actions", sortable: false, align: "center" }
      ],
      roles: ["Khách Hàng", "Nhân Viên", "Admin"],
      editDialog: false,
      editedEmployee: {},
      isEditing: false,
      loading: false,
      apiBase: "http://localhost:3000"
    };
  },
  methods: {
    getAuthHeaders() {
      const token = localStorage.getItem("token");
      return {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
    },
    mapRole(roleId) {
      const map = { 1: "Khách Hàng", 2: "Nhân Viên", 3: "Admin" };
      return map[roleId] || "Không xác định";
    },
    reverseMapRole(roleName) {
      const map = { "Khách Hàng": 1, "Nhân Viên": 2, "Admin": 3 };
      return map[roleName] || 1;
    },
    fetchEmployees() {
      this.loading = true;
      axios
        .get(`${this.apiBase}/api/staff/getallstaff`, this.getAuthHeaders())
        .then(res => {
          this.employees = res.data.map(emp => ({
            staffid: emp.StaffID,
            name: emp.FullName || "N/A",
            email: emp.Email || "N/A",
            position: this.mapRole(emp.RoleID) || "N/A"
          }));
        })
        .catch(err => {
          console.error("Lỗi khi lấy nhân viên:", err);
          this.employees = [];
          alert("Lỗi khi tải danh sách nhân viên!");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    openAddDialog() {
      this.editedEmployee = {
        name: "",
        email: "",
        phoneNumber: "",
        position: "Nhân Viên"
      };
      this.isEditing = false;
      this.editDialog = true;
    },
    openEditDialog(employee) {
      this.editedEmployee = {
        ...employee,
        phoneNumber: employee.phoneNumber || ""
      };
      this.isEditing = true;
      this.editDialog = true;
    },
    saveEmployee() {
      if (!this.editedEmployee.name || !this.editedEmployee.email || !this.editedEmployee.phoneNumber) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
      }

      const payload = {
        fullname: this.editedEmployee.name,
        email: this.editedEmployee.email,
        phoneNumber: this.editedEmployee.phoneNumber,
        roleid: this.reverseMapRole(this.editedEmployee.position)
      };

      this.loading = true;
      if (this.isEditing) {
        axios
          .put(`${this.apiBase}/api/staff/updateUser/${this.editedEmployee.staffid}`, payload, this.getAuthHeaders())
          .then(() => {
            this.fetchEmployees();
            this.editDialog = false;
            alert("Cập nhật nhân viên thành công!");
          })
          .catch(err => {
            console.error("Lỗi cập nhật:", err);
            alert("Lỗi khi cập nhật nhân viên: " + (err.response?.data?.message || err.message));
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        axios
          .post(`${this.apiBase}/api/staff/addUser`, payload, this.getAuthHeaders())
          .then(() => {
            this.fetchEmployees();
            this.editDialog = false;
            alert("Thêm nhân viên thành công!");
          })
          .catch(err => {
            console.error("Lỗi thêm:", err);
            alert("Lỗi khi thêm nhân viên: " + (err.response?.data?.message || err.message));
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    deleteEmployee(id) {
      if (confirm("Bạn có chắc muốn xoá nhân viên này không?")) {
        this.loading = true;
        axios
          .delete(`${this.apiBase}/api/staff/deleteUser/${id}`, this.getAuthHeaders())
          .then(() => {
            this.fetchEmployees();
            alert("Xóa nhân viên thành công!");
          })
          .catch(err => {
            console.error("Lỗi xoá:", err);
            alert("Lỗi khi xoá nhân viên: " + (err.response?.data?.message || err.message));
          })
          .finally(() => {
            this.loading = false;
          });
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
.v-data-table-header th {
  font-weight: bold !important;
  color: #000 !important;
}
</style>