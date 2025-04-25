const db = require("../connectDB.js/db");
const bcrypt = require("bcrypt");

exports.getAllUsers = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM staff");
    res.json(result);
  } catch (error) {
    console.error("Lỗi truy vấn role:", error);
    res.status(500).json({ error: "Lỗi truy vấn" });
  }
};

exports.addUser = async (req, res) => {
  const { fullname, roleid, phoneNumber, email } = req.body;

  if (!fullname || !roleid || !phoneNumber || !email) {
    return res
      .status(400)
      .json({ message: "Please enter complete information" });
  }

  try {
    const [existingUser] = await db.query(
      "SELECT * FROM staff WHERE Email = ?",
      [email],
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(phoneNumber, 10);

    await db.query(
      "INSERT INTO staff (FullName,RoleID,PhoneNumber,Email) VALUES (?,?,?,?)",
      [fullname, roleid, hashedPassword, email],
    );

    res.status(201).json({ message: "Add User Completed" });
  } catch (error) {
    console.error("Error add user", error);
    res.status(500).json({ message: "Error server" });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM staff WHERE StaffID = ?", [
      id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Invalid User" });
    }

    res.status(200).json({ message: "Delete User Success" });
  } catch (error) {
    console.error("Lỗi khi xóa người dùng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { fullname, roleid, phoneNumber, email } = req.body;

  if (!fullname || !roleid || !email) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
  }

  try {
    const [existingUser] = await db.query(
      "SELECT * FROM staff WHERE Email = ? AND StaffID != ?",
      [email, id],
    );

    if (existingUser.length > 0) {
      return res
        .status(409)
        .json({ message: "Email đã tồn tại cho người dùng khác" });
    }

    // Hash lại mật khẩu mới
    const hashedPassword = await bcrypt.hash(phoneNumber, 10);

    const [result] = await db.query(
      "UPDATE staff SET FullName = ?, RoleID = ?, PhoneNumber = ?, Email = ? WHERE StaffID = ?",
      [fullname, roleid, hashedPassword, email, id],
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy người dùng để cập nhật" });
    }

    res.status(200).json({ message: "Cập nhật thành công" });
  } catch (error) {
    console.error("Lỗi cập nhật người dùng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
