const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config(); // Thêm để dùng biến môi trường

const app = express();
const PORT = 3000;

// CORS cấu hình
app.use(cors({
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Kết nối MySQL dùng biến môi trường
const db = mysql.createConnection({
  host: process.env.MYSQLHOST || 'localhost',
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || '',
  database: process.env.MYSQLDATABASE || 'qlks',
  port: process.env.MYSQLPORT || 3306
});

db.connect((err) => {
  if (err) {
    console.error('❌ Lỗi kết nối MySQL:', err);
    return;
  }
  console.log('✅ Kết nối MySQL thành công!');
});

// ROUTES
app.get('/', (req, res) => {
  res.send('🚀 API Backend đang chạy!');
});

// 1. Quản lý phòng
app.get('/room', (req, res) => {
  db.query('SELECT * FROM room', (err, results) => {
    if (err) res.status(500).json({ error: 'Lỗi truy vấn' });
    else res.json(results);
  });
});

app.post('/room', (req, res) => {
  const { roomtype, price, status, image } = req.body;
  db.query('INSERT INTO room (roomtype, price, status, image) VALUES (?, ?, ?, ?)',
    [roomtype, price, status, image], (err, result) => {
      if (err) res.status(500).json({ error: 'Lỗi thêm phòng' });
      else res.json({ message: 'Thêm phòng thành công', id: result.insertId });
    });
});

app.put('/room/:id', (req, res) => {
  const { roomtype, price, status, image } = req.body;
  db.query('UPDATE room SET roomtype=?, price=?, status=?, image=? WHERE roomid=?',
    [roomtype, price, status, image, req.params.id], (err) => {
      if (err) res.status(500).json({ error: 'Lỗi cập nhật phòng' });
      else res.json({ message: 'Cập nhật phòng thành công' });
    });
});

app.delete('/room/:id', (req, res) => {
  db.query('DELETE FROM room WHERE roomid=?', [req.params.id], (err) => {
    if (err) res.status(500).json({ error: 'Lỗi xóa phòng' });
    else res.json({ message: 'Xóa phòng thành công' });
  });
});

// 2. Quản lý đặt phòng
app.post('/booking', (req, res) => {
  const { name, phone, roomid, checkin, checkout } = req.body;
  db.query('INSERT INTO booking (name, phone, roomid, checkin, checkout) VALUES (?, ?, ?, ?, ?)',
    [name, phone, roomid, checkin, checkout], (err, result) => {
      if (err) res.status(500).json({ error: 'Lỗi đặt phòng' });
      else res.json({ message: 'Đặt phòng thành công', id: result.insertId });
    });
});

app.get('/booking', (req, res) => {
  db.query('SELECT * FROM booking', (err, results) => {
    if (err) res.status(500).json({ error: 'Lỗi lấy danh sách đặt phòng' });
    else res.json(results);
  });
});

// 3. Quản lý khách hàng
app.get('/customer', (req, res) => {
  db.query('SELECT * FROM customer', (err, results) => {
    if (err) res.status(500).json({ error: 'Lỗi lấy danh sách khách hàng' });
    else res.json(results);
  });
});

app.post('/customer', (req, res) => {
  const { name, phone, email } = req.body;
  db.query('INSERT INTO customer (name, phone, email) VALUES (?, ?, ?)',
    [name, phone, email], (err, result) => {
      if (err) res.status(500).json({ error: 'Lỗi thêm khách hàng' });
      else res.json({ message: 'Thêm khách hàng thành công', id: result.insertId });
    });
});

// 4. Quản lý nhân viên
app.get('/staff', (req, res) => {
  db.query('SELECT * FROM staff', (err, results) => {
    if (err) res.status(500).json({ error: 'Lỗi lấy danh sách nhân viên' });
    else res.json(results);
  });
});

app.post('/staff', (req, res) => {
  const { name, phone, email, position } = req.body;
  db.query('INSERT INTO staff (name, phone, email, position) VALUES (?, ?, ?, ?)',
    [name, phone, email, position], (err, result) => {
      if (err) res.status(500).json({ error: 'Lỗi thêm nhân viên' });
      else res.json({ message: 'Thêm nhân viên thành công', id: result.insertId });
    });
});

app.put('/staff/:id', (req, res) => {
  const { name, phone, email, position } = req.body;
  db.query('UPDATE staff SET name=?, phone=?, email=?, position=? WHERE staffid=?',
    [name, phone, email, position, req.params.id], (err) => {
      if (err) res.status(500).json({ error: 'Lỗi cập nhật nhân viên' });
      else res.json({ message: 'Cập nhật nhân viên thành công' });
    });
});

// 5. Quản lý dịch vụ
app.get('/service', (req, res) => {
  db.query('SELECT * FROM service', (err, results) => {
    if (err) res.status(500).json({ error: 'Lỗi lấy danh sách dịch vụ' });
    else res.json(results);
  });
});

app.post('/service', (req, res) => {
  const { name, price } = req.body;
  db.query('INSERT INTO service (name, price) VALUES (?, ?)',
    [name, price], (err, result) => {
      if (err) res.status(500).json({ error: 'Lỗi thêm dịch vụ' });
      else res.json({ message: 'Thêm dịch vụ thành công', id: result.insertId });
    });
});

// 6. Quản lý sử dụng dịch vụ
app.post('/serviceusage', (req, res) => {
  const { quantity, totalprice, bookid, serviceid } = req.body;
  db.query('INSERT INTO serviceusage (quantity, totalprice, bookid, serviceid) VALUES (?, ?, ?, ?)',
    [quantity, totalprice, bookid, serviceid], (err, result) => {
      if (err) res.status(500).json({ error: 'Lỗi thêm sử dụng dịch vụ' });
      else res.json({ message: 'Thêm sử dụng dịch vụ thành công', id: result.insertId });
    });
});

// 7. Quản lý hóa đơn
app.get('/bill', (req, res) => {
  db.query('SELECT * FROM bill', (err, results) => {
    if (err) res.status(500).json({ error: 'Lỗi lấy danh sách hóa đơn' });
    else res.json(results);
  });
});

app.post('/bill', (req, res) => {
  const { amount, paymentdate, method, bookid } = req.body;
  db.query('INSERT INTO bill (amount, paymentdate, method, bookid) VALUES (?, ?, ?, ?)',
    [amount, paymentdate, method, bookid], (err, result) => {
      if (err) res.status(500).json({ error: 'Lỗi tạo hóa đơn' });
      else res.json({ message: 'Tạo hóa đơn thành công', id: result.insertId });
    });
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
