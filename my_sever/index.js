const cors = require('cors');
const express = require('express');
const mysql = require('mysql2/promise'); // Sử dụng promise để await

const app = express();
const PORT = 3000;

app.use(cors({
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Kết nối MySQL
const db = mysql.createPool({
  host: 'gondola.proxy.rlwy.net',
  port: 34491,
  user: 'root',
  password: 'GHinzlDxpgKJtAXSpVxkVPLmWOLuteNQ',
  database: 'railway'
});


// ROUTES
app.get('/', (req, res) => {
  res.send('🚀 API Backend đang chạy!');
});

// 1. Quản lý phòng
app.get('/room', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM room');
    res.json(results);
  } catch (err) {
    console.error('❌ Chi tiết lỗi truy vấn /room:', err);
    res.status(500).json({ error: 'Lỗi truy vấn' });
  }
});

app.post('/room', async (req, res) => {
  const { roomtype, price, status, image } = req.body;
  try {
    const [result] = await db.query('INSERT INTO room (roomtype, price, status, image) VALUES (?, ?, ?, ?)', [roomtype, price, status, image]);
    res.json({ message: 'Thêm phòng thành công', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi thêm phòng' });
  }
});

app.put('/room/:id', async (req, res) => {
  const { roomtype, price, status, image } = req.body;
  try {
    await db.query('UPDATE room SET roomtype=?, price=?, status=?, image=? WHERE roomid=?', [roomtype, price, status, image, req.params.id]);
    res.json({ message: 'Cập nhật phòng thành công' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi cập nhật phòng' });
  }
});

app.delete('/room/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM room WHERE roomid=?', [req.params.id]);
    res.json({ message: 'Xóa phòng thành công' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi xóa phòng' });
  }
});

// 2. Quản lý đặt phòng
app.post('/booking', async (req, res) => {
  const { name, phone, roomid, checkin, checkout } = req.body;
  console.log("📥 Nhận đặt phòng:", req.body);

  try {
    const [roomStatus] = await db.query('SELECT status FROM room WHERE roomid = ?', [roomid]);
    console.log("🔍 Trạng thái phòng:", roomStatus);

    if (!roomStatus.length) return res.status(404).json({ message: 'Không tìm thấy phòng' });
    if (roomStatus[0].status === 'booked') return res.status(400).json({ message: 'Phòng đã được đặt!' });

    await db.query('INSERT INTO booking (name, phone, roomid, checkin, checkout) VALUES (?, ?, ?, ?, ?)', [name, phone, roomid, checkin, checkout]);
    const [updateResult] = await db.query('UPDATE room SET status = "booked" WHERE roomid = ?', [roomid]);

    console.log("✅ Kết quả cập nhật trạng thái phòng:", updateResult);

    res.json({ message: 'Đặt phòng thành công' });
  } catch (error) {
    console.error('❌ Lỗi khi đặt phòng:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});


app.get('/booking', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM booking');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi lấy danh sách đặt phòng' });
  }
});

// 3. Quản lý khách hàng
app.get('/customer', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM customer');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi lấy danh sách khách hàng' });
  }
});

app.post('/customer', async (req, res) => {
  const { name, phone, email } = req.body;
  try {
    const [result] = await db.query('INSERT INTO customer (name, phone, email) VALUES (?, ?, ?)', [name, phone, email]);
    res.json({ message: 'Thêm khách hàng thành công', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi thêm khách hàng' });
  }
});

// 4. Quản lý nhân viên
app.get('/staff', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM staff');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi lấy danh sách nhân viên' });
  }
});

app.post('/staff', async (req, res) => {
  const { name, phone, email, position } = req.body;
  try {
    const [result] = await db.query('INSERT INTO staff (name, phone, email, position) VALUES (?, ?, ?, ?)', [name, phone, email, position]);
    res.json({ message: 'Thêm nhân viên thành công', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi thêm nhân viên' });
  }
});

// 5. Quản lý dịch vụ
app.get('/service', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM service');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi lấy danh sách dịch vụ' });
  }
});

app.post('/service', async (req, res) => {
  const { name, price } = req.body;
  try {
    const [result] = await db.query('INSERT INTO service (name, price) VALUES (?, ?)', [name, price]);
    res.json({ message: 'Thêm dịch vụ thành công', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi thêm dịch vụ' });
  }
});

// 6. Quản lý sử dụng dịch vụ
app.post('/serviceusage', async (req, res) => {
  const { quantity, totalprice, bookid, serviceid } = req.body;
  try {
    const [result] = await db.query('INSERT INTO serviceusage (quantity, totalprice, bookid, serviceid) VALUES (?, ?, ?, ?)', [quantity, totalprice, bookid, serviceid]);
    res.json({ message: 'Thêm sử dụng dịch vụ thành công', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi thêm sử dụng dịch vụ' });
  }
});

// 7. Quản lý hóa đơn
app.get('/bill', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM bill');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi lấy danh sách hóa đơn' });
  }
});

app.post('/bill', async (req, res) => {
  const { amount, paymentdate, method, bookid } = req.body;
  try {
    const [result] = await db.query('INSERT INTO bill (amount, paymentdate, method, bookid) VALUES (?, ?, ?, ?)', [amount, paymentdate, method, bookid]);
    res.json({ message: 'Tạo hóa đơn thành công', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi tạo hóa đơn' });
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});