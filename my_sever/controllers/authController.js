const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../connectDB.js/db");
require("dotenv").config();

exports.LoginHehe = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM staff WHERE Email = ?", [
      username,
    ]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email ..." });
    }

    const user = rows[0];

    const match = await bcrypt.compare(password, user.PhoneNumber);
    if (!match) {
      return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
    }

    const payload = {
      id: user.StaffID,
      fullName: user.FullName,
      role: user.RoleID,
      Email: user.Email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    res.json({ accessToken: token, role: user.RoleID, StaffID: user.StaffID });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Protected route controller
exports.protected = (req, res) => {
  res.json({
    message: "Chào bạn, bạn đã truy cập API bảo vệ!",
    user: req.user,
  });
};
