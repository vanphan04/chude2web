const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;


app.use(cors({
  origin: 'http://localhost:5173', // frontend của bạn
  methods: ['GET', 'POST', 'PUT'], // Thêm PUT vào phương thức được phép
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

// Kết nối tới database MySQL (hotelmanagement)
const db = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '', // nếu có thì điền vào
  database: 'hotelmanagement',
});

// API: Lấy danh sách phòng
app.get('/room', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM room');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi truy vấn phòng' });
  }
});

// API: Đặt phòng
app.post('/reservation', async (req, res) => {
  const { customerid, roomid, checkindate, checkoutdate } = req.body;
  try {
    // Kiểm tra trạng thái phòng
    const [rooms] = await db.query('SELECT Status FROM room WHERE RoomID = ?', [roomid]);
    if (!rooms.length) return res.status(404).json({ message: 'Không tìm thấy phòng' });
    if (rooms[0].Status !== 'Available') return res.status(400).json({ message: 'Phòng không có sẵn' });

    // Cập nhật trạng thái phòng thành "Occupied"
    await db.query('UPDATE room SET Status = ? WHERE RoomID = ?', ['Occupied', roomid]);

    // Thêm thông tin đặt phòng vào bảng reservation
    const [result] = await db.query(
      'INSERT INTO reservation (CustomerID, RoomID, CheckInDate, CheckOutDate, Status) VALUES (?, ?, ?, ?, ?)',
      [customerid, roomid, checkindate, checkoutdate, 'Confirmed']
    );

    res.json({ message: 'Đặt phòng thành công', reservationId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server khi đặt phòng' });
  }
});

// API: Thanh toán
app.post('/payment', async (req, res) => {
  const { reservationId, roomid, amount, paymentMethod } = req.body;
  try {
    // Ghi nhận thanh toán
    await db.query(
      'INSERT INTO payment (ReservationID, Amount, PaymentMethod) VALUES (?, ?, ?)',
      [reservationId, amount, paymentMethod]
    );

    // Cập nhật trạng thái phòng thành "Available"
    await db.query('UPDATE room SET Status = ? WHERE RoomID = ?', ['Available', roomid]);

    res.json({ message: 'Thanh toán thành công' });
  } catch (err) {
    console.error('Lỗi khi thanh toán:', err);
    res.status(500).json({ error: 'Lỗi khi thanh toán' });
  }
});

// API: Hủy đặt phòng
app.put('/room/:roomid/cancel', async (req, res) => {
  const { roomid } = req.params;
  try {
    // Cập nhật trạng thái phòng thành "Available"
    const [roomResult] = await db.query(
      'UPDATE room SET Status = "Available" WHERE RoomID = ?',
      [roomid]
    );
    if (roomResult.affectedRows === 0) return res.status(400).json({ message: 'Không tìm thấy phòng' });

    // Cập nhật trạng thái đặt phòng thành "Cancelled"
    await db.query(
      'UPDATE reservation SET Status = "Cancelled" WHERE RoomID = ? AND Status = "Confirmed"',
      [roomid]
    );

    res.json({ message: 'Hủy đặt phòng thành công' });
  } catch (err) {
    console.error('Lỗi khi hủy đặt phòng:', err);
    res.status(500).json({ error: 'Lỗi khi hủy đặt phòng' });
  }
});

// API: Đặt phòng
app.post('/booking', async (req, res) => {
  const { roomid, name, phone, checkin, checkout } = req.body;
  try {
    await db.query(
      'INSERT INTO reservation (roomid, name, phone, checkin, checkout) VALUES (?, ?, ?, ?, ?)',
      [roomid, name, phone, checkin, checkout]
    );
    await db.query('UPDATE room SET status = ? WHERE roomid = ?', ['unavailable', roomid]);
    res.json({ message: "Đặt phòng thành công" });
  } catch (err) {
    console.error("Lỗi khi đặt phòng:", err);
    res.status(500).json({ error: "Lỗi khi đặt phòng" });
  }
});

// API: Thanh toán
app.post('/payment', async (req, res) => {
  const { roomid, amount, paymentMethod } = req.body;
  try {
    await db.query(
      'INSERT INTO payment (roomid, amount, method) VALUES (?, ?, ?)',
      [roomid, amount, paymentMethod]
    );
    await db.query('UPDATE room SET status = ? WHERE roomid = ?', ['available', roomid]);
    res.json({ message: "Thanh toán thành công" });
  } catch (err) {
    console.error("Lỗi khi thanh toán:", err);
    res.status(500).json({ error: "Lỗi khi thanh toán" });
  }
});


// Phục vụ ảnh tĩnh
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.listen(port, () => {
  console.log(`✅ Backend chạy tại http://localhost:${port}`);
});

//Đặt phòng
app.post('/reservations', async (req, res) => {
  const { roomid, checkin, checkout, name, phone } = req.body;

  if (!roomid  || !checkin || !checkout || !name || !phone) {
    return res.status(400).json({ message: 'Thiếu thông tin đặt phòng' });
  }

  try {
    const [rooms] = await db.query(
      'SELECT Status FROM room WHERE RoomID = ?',
      [roomid]
    );

    if (!rooms.length) {
      return res.status(404).json({ message: 'Không tìm thấy phòng' });
    }

    if (rooms[0].Status !== 'Available') {
      return res.status(400).json({ message: 'Phòng không có sẵn' });
    }

    await db.query(
      'UPDATE room SET Status = "Occupied" WHERE RoomID = ?',
      [roomid]
    );

    const [result] = await db.query(
      'INSERT INTO reservation (CustomerName, CustomerPhone, RoomID, CheckInDate, CheckOutDate, Status) VALUES (?, ?, ?, ?, ?, ?)',
      [name, phone, roomid, checkin, checkout, 'Confirmed']
    );

    res.status(200).json({ message: 'Đặt phòng thành công', reservationId: result.insertId });
  } catch (err) {
    console.error('Lỗi khi đặt phòng:', err);
    res.status(500).json({ message: 'Lỗi server khi đặt phòng' });
  }
});

//
app.get('/customers', async (req, res) => {
  try {
    const [customers] = await db.query(`
      SELECT 
        r.CustomerName, 
        r.CustomerPhone, 
        r.CheckInDate, 
        r.CheckOutDate, 
        rm.RoomType, 
        r.Status
      FROM reservation r
      JOIN room rm ON r.RoomID = rm.RoomID
    `);
    res.json(customers);
  } catch (err) {
    console.error('Error fetching customers:', err);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách khách hàng' });
  }
});






