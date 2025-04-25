const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "", // nếu bạn có mật khẩu thì nhập vào đây
  database: "hotelmanagement",
});

module.exports = db;
