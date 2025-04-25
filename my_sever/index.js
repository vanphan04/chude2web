const cors = require("cors");
const express = require("express");
// const dotenv = require('dotenv');
const mysql = require("mysql2/promise");
// dotenv.config();
const path = require("path"); // ✅ Dòng này là bắt buộc
const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

const db = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "", // nếu bạn có mật khẩu thì nhập vào đây
  database: "hotelmanagement",
});

// ROUTES
app.get("/", (req, res) => {
  res.send("🚀 API Backend đang chạy!");
});

// Login
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", require("./router/loginRoute"));

// API: Lấy danh sách phòng
app.get("/room", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM room");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi truy vấn phòng" });
  }
});
// API: Chỉnh sửa thông tin phòng
app.put("/room/:roomid", async (req, res) => {
  const { roomid } = req.params;
  const { roomtype, price, status } = req.body;

  // Kiểm tra nếu không có thông tin cần thiết trong body
  if (!roomtype || !price || !status) {
    return res
      .status(400)
      .json({ message: "Thiếu thông tin để chỉnh sửa phòng" });
  }

  try {
    // Cập nhật thông tin phòng trong cơ sở dữ liệu
    const [result] = await db.query(
      "UPDATE room SET RoomType = ?, Price = ?, Status = ? WHERE RoomID = ?",
      [roomtype, price, status, roomid],
    );

    // Kiểm tra xem có phòng nào được cập nhật không
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy phòng để chỉnh sửa" });
    }

    res.json({ message: "Chỉnh sửa phòng thành công" });
  } catch (err) {
    console.error("Lỗi khi chỉnh sửa phòng:", err);
    res.status(500).json({ message: "Lỗi server khi chỉnh sửa phòng" });
  }
});
// API: Thanh toán và lưu thông tin thanh toán
app.post("/api/payment", async (req, res) => {
  const { reservationId, paymentMethod } = req.body;

  try {
    // Lấy thông tin đặt phòng + giá phòng
    const [reservation] = await db.promise().query(
      `
      SELECT r.CheckInDate, r.CheckOutDate, rm.Price
      FROM reservation r
      JOIN room rm ON r.RoomID = rm.RoomID
      WHERE r.ReservationID = ?
    `,
      [reservationId],
    );

    if (reservation.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thông tin đặt phòng" });
    }

    const { CheckInDate, CheckOutDate, Price } = reservation[0];

    // Tính số ngày thuê
    const start = new Date(CheckInDate);
    const end = new Date(CheckOutDate);
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalAmount = diffDays * Price;

    // Lưu vào bảng payment
    await db.promise().query(
      `
      INSERT INTO payment (ReservationID, Amount, PaymentMethod)
      VALUES (?, ?, ?)
    `,
      [reservationId, totalAmount, paymentMethod],
    );

    res
      .status(200)
      .json({ message: "Thanh toán thành công", amount: totalAmount });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ message: "Lỗi khi xử lý thanh toán" });
  }
});
app.get("/api/reservation/amount/:id", async (req, res) => {
  const reservationId = req.params.id;
  try {
    const [result] = await db.promise().query(
      `
      SELECT r.CheckInDate, r.CheckOutDate, rm.Price
      FROM reservation r
      JOIN room rm ON r.RoomID = rm.RoomID
      WHERE r.ReservationID = ?
    `,
      [reservationId],
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy" });
    }

    const { CheckInDate, CheckOutDate, Price } = result[0];
    const start = new Date(CheckInDate);
    const end = new Date(CheckOutDate);
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const amount = diffDays * Price;

    res.json({ amount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi tính toán" });
  }
});
// Lấy thông tin đặt phòng theo RoomID
app.get("/reservation/:roomid", async (req, res) => {
  const { roomid } = req.params;
  try {
    const [rows] = await db.execute(
      "SELECT * FROM reservation WHERE RoomID = ? ORDER BY ReservationID DESC LIMIT 1",
      [roomid],
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thông tin đặt phòng" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi máy chủ khi truy vấn reservation" });
  }
});
// Route thanh toán
// Route thanh toán
app.post("/payment", async (req, res) => {
  try {
    const { roomid, amount, paymentMethod } = req.body;

    // Kiểm tra nếu thông tin thanh toán đầy đủ
    if (!roomid || !amount || !paymentMethod) {
      return res.status(400).json({ message: "Thiếu thông tin thanh toán." });
    }

    // Lấy ReservationID từ RoomID
    const reservationQuery =
      "SELECT ReservationID FROM reservation WHERE RoomID = ?";
    const [reservationResult] = await db.execute(reservationQuery, [roomid]);

    if (reservationResult.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy đặt phòng với RoomID này." });
    }

    const reservationID = reservationResult[0].ReservationID;

    // Lưu thông tin thanh toán vào bảng payment
    const paymentQuery =
      "INSERT INTO payment (ReservationID, Amount, PaymentMethod) VALUES (?, ?, ?)";
    await db.execute(paymentQuery, [reservationID, amount, paymentMethod]);

    // Cập nhật trạng thái phòng thành "Available" (trống) sau khi thanh toán thành công
    const updateRoomQuery =
      'UPDATE room SET Status = "Available" WHERE RoomID = ?';
    await db.execute(updateRoomQuery, [roomid]);

    // Trả về thông báo thành công
    res.status(200).json({
      message: "Thanh toán thành công và phòng đã được cập nhật thành trống.",
    });
  } catch (err) {
    console.error("Lỗi khi thanh toán:", err);
    res.status(500).json({ message: "Lỗi server khi thanh toán" });
  }
});

// API: Đặt phòng
app.post("/reservation", async (req, res) => {
  const { name, phone, customerid, roomid, checkindate, checkoutdate } =
    req.body;
  try {
    // Kiểm tra trạng thái phòng
    const [rooms] = await db.query("SELECT Status FROM room WHERE RoomID = ?", [
      roomid,
    ]);
    if (!rooms.length)
      return res.status(404).json({ message: "Không tìm thấy phòng" });
    if (rooms[0].Status !== "Available")
      return res.status(400).json({ message: "Phòng không có sẵn" });

    // Cập nhật trạng thái phòng thành "Occupied"
    await db.query("UPDATE room SET Status = ? WHERE RoomID = ?", [
      "Occupied",
      roomid,
    ]);

    // Thêm thông tin đặt phòng vào bảng reservation
    const [result] = await db.query(
      "INSERT INTO reservation (CustomerName, CustomerPhone, CustomerID, RoomID, CheckInDate, CheckOutDate, Status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, phone, customerid, roomid, checkindate, checkoutdate, "Confirmed"],
    );

    res.json({
      message: "Đặt phòng thành công",
      reservationId: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server khi đặt phòng" });
  }
});

// API: Hủy đặt phòng
app.put("/room/:roomid/cancel", async (req, res) => {
  const { roomid } = req.params;
  try {
    // Cập nhật trạng thái phòng thành "Available"
    const [roomResult] = await db.query(
      'UPDATE room SET Status = "Available" WHERE RoomID = ?',
      [roomid],
    );
    if (roomResult.affectedRows === 0)
      return res.status(400).json({ message: "Không tìm thấy phòng" });

    // Cập nhật trạng thái đặt phòng thành "Cancelled"
    await db.query(
      'UPDATE reservation SET Status = "Cancelled" WHERE RoomID = ? AND Status = "Confirmed"',
      [roomid],
    );

    res.json({ message: "Hủy đặt phòng thành công" });
  } catch (err) {
    console.error("Lỗi khi hủy đặt phòng:", err);
    res.status(500).json({ error: "Lỗi khi hủy đặt phòng" });
  }
});

//Đặt phòng
app.post("/reservations", async (req, res) => {
  const { roomid, checkin, checkout, name, phone } = req.body;

  if (!roomid || !checkin || !checkout || !name || !phone) {
    return res.status(400).json({ message: "Thiếu thông tin đặt phòng" });
  }

  try {
    const [rooms] = await db.query("SELECT Status FROM room WHERE RoomID = ?", [
      roomid,
    ]);

    if (!rooms.length) {
      return res.status(404).json({ message: "Không tìm thấy phòng" });
    }

    if (rooms[0].Status !== "Available") {
      return res.status(400).json({ message: "Phòng không có sẵn" });
    }

    await db.query('UPDATE room SET Status = "Occupied" WHERE RoomID = ?', [
      roomid,
    ]);

    const [result] = await db.query(
      "INSERT INTO reservation (CustomerName, CustomerPhone, RoomID, CheckInDate, CheckOutDate, Status) VALUES (?, ?, ?, ?, ?, ?)",
      [name, phone, roomid, checkin, checkout, "Confirmed"],
    );

    res.status(200).json({
      message: "Đặt phòng thành công",
      reservationId: result.insertId,
    });
  } catch (err) {
    console.error("Lỗi khi đặt phòng:", err);
    res.status(500).json({ message: "Lỗi server khi đặt phòng" });
  }
});

//
app.get("/customers", async (req, res) => {
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
    console.error("Error fetching customers:", err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách khách hàng" });
  }
});
// Phục vụ ảnh tĩnh
app.use("/images", express.static(path.join(__dirname, "public/images")));

// Quản lý quyền
app.use("/api/role", require("./router/roleRoute"));

// Quản lý staff
app.use("/api/staff", require("./router/userRoute"));

// 4. Quản lý nhân viên
app.get("/staff", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM staff");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Lỗi lấy danh sách nhân viên" });
  }
});
app.post("/staff", async (req, res) => {
  const { name, phone, email, position } = req.body;
  try {
    const { roomid, name, phone, checkin, checkout } = req.body;

    await db.query(
      "INSERT INTO booking (roomid, name, phone, checkin, checkout) VALUES (?, ?, ?, ?, ?)",
      [roomid, name, phone, checkin, checkout],
    );
  } catch (err) {
    res.status(500).json({ error: "Lỗi thêm nhân viên" });
  }
});
// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
