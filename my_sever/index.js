const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

// Middleware để xử lý JSON
app.use(express.json());

// Kết nối đến MySQL
const db = mysql.createConnection({
  host: 'localhost',  // Địa chỉ MySQL Server
  user: 'root',       // Tên user MySQL
  password: '',       // Mật khẩu MySQL (nếu có)
  database: 'qlks'    // Tên database
});

// Kiểm tra kết nối
db.connect((err) => {
  if (err) {
    console.error('❌ Lỗi kết nối MySQL:', err);
    return;
  }
  console.log('✅ Kết nối MySQL thành công!');
});

// Route kiểm tra server
app.get('/', (req, res) => {
    res.send('Hello, world! Server đang chạy.');
});

// Route lấy danh sách phòng từ MySQL
app.get('/room', (req, res) => {
    db.query('SELECT * FROM room', (err, results) => {
        if (err) {
            console.error('❌ Lỗi truy vấn:', err);
            res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
        } else {
            res.json(results);
        }
    });
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
