const db = require("../connectDB.js/db");

exports.getAllRoles = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM role");
    res.json(result);
  } catch (error) {
    console.error("Lỗi truy vấn role:", error);
    res.status(500).json({ error: "Lỗi truy vấn" });
  }
};
