const cors = require('cors');
const express = require('express');
// const dotenv = require('dotenv');
const mysql = require('mysql2/promise');
// dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors({
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const db = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '', // 
  database: 'hotelmanagement'
});


// ROUTES
app.get('/', (req, res) => {
  res.send('🚀 API Backend đang chạy!');
});

// Login
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api',require('./router/loginRoute'));

// Quản lý quyền
app.use('/api/role', require('./router/roleRoute'));

// Quản lý staff
app.use('/api/staff',require('./router/userRoute'));


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

app.put('/room/:id/cancel', async (req, res) => {
  const roomId = req.params.id;
  try {
    await db.query('UPDATE room SET status = "available" WHERE roomid = ?', [roomId]);
    res.json({ message: 'Đã hủy đặt phòng, phòng hiện ở trạng thái trống.' });
  } catch (err) {
    console.error('❌ Lỗi khi hủy đặt phòng:', err);
    res.status(500).json({ error: 'Lỗi khi hủy đặt phòng' });
  }
});

// 2. Quản lý đặt phòng
app.post('/booking', async (req, res) => {
  const { roomid, checkin, checkout } = req.body;
  console.log("📥 Nhận đặt phòng:", req.body);

  try {
    const [roomStatus] = await db.query('SELECT status FROM room WHERE roomid = ?', [roomid]);
    console.log("🔍 Trạng thái phòng:", roomStatus);

    if (!roomStatus.length) return res.status(404).json({ message: 'Không tìm thấy phòng' });
    if (roomStatus[0].status === 'booked') return res.status(400).json({ message: 'Phòng đã được đặt!' });

    // Chỉ thêm dữ liệu booking đơn giản (bảng booking không có name, phone)
    await db.query('INSERT INTO booking (roomid, checkin, checkout) VALUES (?, ?, ?)', [roomid, checkin, checkout]);

    await db.query('UPDATE room SET status = "booked" WHERE roomid = ?', [roomid]);

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
    const { roomid, name, phone, checkin, checkout } = req.body;

await db.query(
  'INSERT INTO booking (roomid, name, phone, checkin, checkout) VALUES (?, ?, ?, ?, ?)',
  [roomid, name, phone, checkin, checkout]
);

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

// Thanh toán
app.post("/payment", (req, res) => {
  const { billid, amount, payment_method } = req.body;
  const insertQuery = `INSERT INTO payment (billid, amount, payment_method) VALUES (?, ?, ?)`;

  db.query(insertQuery, [billid, amount, payment_method], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Thanh toán thành công!", paymentid: result.insertId });
  });
});

app.get("/payment", (req, res) => {
  db.query("SELECT * FROM payment", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
