-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3306
-- Thời gian đã tạo: Th4 25, 2025 lúc 09:34 AM
-- Phiên bản máy phục vụ: 5.7.31
-- Phiên bản PHP: 7.4.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `hotelmanagement`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `customer`
--

DROP TABLE IF EXISTS `customer`;
CREATE TABLE IF NOT EXISTS `customer` (
  `CustomerID` int(11) NOT NULL AUTO_INCREMENT,
  `FullName` varchar(255) NOT NULL,
  `PhoneNumber` varchar(20) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `Address` text,
  PRIMARY KEY (`CustomerID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hotel`
--

DROP TABLE IF EXISTS `hotel`;
CREATE TABLE IF NOT EXISTS `hotel` (
  `HotelID` int(11) NOT NULL AUTO_INCREMENT,
  `HotelName` varchar(255) NOT NULL,
  `Location` varchar(255) DEFAULT NULL,
  `Rating` decimal(2,1) DEFAULT NULL,
  PRIMARY KEY (`HotelID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payment`
--

DROP TABLE IF EXISTS `payment`;
CREATE TABLE IF NOT EXISTS `payment` (
  `PaymentID` int(11) NOT NULL AUTO_INCREMENT,
  `ReservationID` int(11) DEFAULT NULL,
  `Amount` decimal(10,2) DEFAULT NULL,
  `PaymentDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `PaymentMethod` enum('Cash','Credit Card','Debit Card','Online') DEFAULT NULL,
  PRIMARY KEY (`PaymentID`),
  KEY `ReservationID` (`ReservationID`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `payment`
--

INSERT INTO `payment` (`PaymentID`, `ReservationID`, `Amount`, `PaymentDate`, `PaymentMethod`) VALUES
(1, 1, '500000.00', '2025-04-25 15:18:30', 'Cash'),
(2, 1, '500000.00', '2025-04-25 15:19:34', 'Cash'),
(3, 1, '500000.00', '2025-04-25 15:23:19', 'Cash'),
(4, 1, '500000.00', '2025-04-25 15:27:48', 'Cash'),
(5, 1, '500000.00', '2025-04-25 15:28:20', 'Credit Card'),
(6, 1, '500000.00', '2025-04-25 16:07:47', 'Cash'),
(7, 1, '500000.00', '2025-04-25 16:11:18', 'Cash'),
(8, 9, '1600000.00', '2025-04-25 16:11:23', 'Cash'),
(9, 1, '3500000.00', '2025-04-25 16:21:50', 'Debit Card');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reservation`
--

DROP TABLE IF EXISTS `reservation`;
CREATE TABLE IF NOT EXISTS `reservation` (
  `ReservationID` int(11) NOT NULL AUTO_INCREMENT,
  `CustomerID` int(11) DEFAULT NULL,
  `CustomerName` varchar(50) DEFAULT NULL,
  `CustomerPhone` varchar(11) DEFAULT NULL,
  `RoomID` int(11) DEFAULT NULL,
  `CheckInDate` date DEFAULT NULL,
  `CheckOutDate` date DEFAULT NULL,
  `Status` enum('Pending','Confirmed','Completed','Cancelled') DEFAULT NULL,
  PRIMARY KEY (`ReservationID`),
  KEY `CustomerID` (`CustomerID`),
  KEY `RoomID` (`RoomID`)
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `reservation`
--

INSERT INTO `reservation` (`ReservationID`, `CustomerID`, `CustomerName`, `CustomerPhone`, `RoomID`, `CheckInDate`, `CheckOutDate`, `Status`) VALUES
(1, 1, NULL, NULL, 1, '2025-04-25', '2025-04-27', 'Cancelled'),
(2, 1, NULL, NULL, 1, '2025-04-25', '2025-04-27', 'Cancelled'),
(3, 1, 'dfhdf', '0868254679', 1, '2025-04-25', '2025-04-26', 'Cancelled'),
(4, NULL, 'ágsdg', '0868254679', 1, '2025-04-25', '2025-04-26', 'Cancelled'),
(5, 1, 'Phan Thanh Văn', '0868254679', 1, '2025-04-25', '2025-04-27', 'Cancelled'),
(6, 1, 'Phan Thành Văn', '0868254679', 1, '2025-04-25', '2025-04-27', 'Cancelled'),
(7, 1, 'gh', '0868254679', 1, '2025-04-25', '2025-04-26', 'Cancelled'),
(8, 1, 'gfjh', '0868254679', 1, '2025-04-25', '2025-04-26', 'Cancelled'),
(9, NULL, 'fdhfh', '0868254679', 2, '2025-04-25', '2025-04-27', 'Confirmed'),
(10, NULL, 'hjkhk', '0111111111', 1, '2025-04-25', '2025-04-30', 'Cancelled'),
(11, 1, 'Phan', '1545', 1, '2025-04-25', '2025-04-27', 'Cancelled'),
(12, 1, 'ghf', '08678454454', 1, '2025-04-25', '2025-04-26', 'Cancelled'),
(13, NULL, 'fhfgh', '0868254679', 1, '2025-04-25', '2025-04-26', 'Cancelled'),
(14, NULL, 'PHAN H', '0867845455', 1, '2025-04-25', '2025-04-27', 'Cancelled'),
(15, 1, 'haha', '08682546789', 1, '2025-04-25', '2025-05-02', 'Confirmed');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `role`
--

DROP TABLE IF EXISTS `role`;
CREATE TABLE IF NOT EXISTS `role` (
  `RoleID` int(11) NOT NULL AUTO_INCREMENT,
  `RoleName` varchar(100) NOT NULL,
  PRIMARY KEY (`RoleID`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `role`
--

INSERT INTO `role` (`RoleID`, `RoleName`) VALUES
(1, 'Khách Hàng'),
(2, 'Nhân Viên'),
(3, 'Admin');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `room`
--

DROP TABLE IF EXISTS `room`;
CREATE TABLE IF NOT EXISTS `room` (
  `RoomID` int(11) NOT NULL AUTO_INCREMENT,
  `HotelID` int(11) DEFAULT NULL,
  `RoomType` varchar(100) DEFAULT NULL,
  `Price` decimal(10,2) DEFAULT NULL,
  `Status` enum('Available','Occupied','Maintenance','Paid') DEFAULT 'Available',
  `image` varchar(255) NOT NULL,
  PRIMARY KEY (`RoomID`),
  KEY `HotelID` (`HotelID`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `room`
--

INSERT INTO `room` (`RoomID`, `HotelID`, `RoomType`, `Price`, `Status`, `image`) VALUES
(1, 1, 'Đơn', '500000.00', 'Available', 'room1.jpg'),
(2, 1, 'Đôi', '800000.00', 'Available', 'room2.jpg'),
(3, 1, 'Đơn', '500000.00', 'Available', 'room1.jpg'),
(4, 1, 'Đôi', '500000.00', 'Available', 'room2.jpg');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `service`
--

DROP TABLE IF EXISTS `service`;
CREATE TABLE IF NOT EXISTS `service` (
  `ServiceID` int(11) NOT NULL AUTO_INCREMENT,
  `ServiceName` varchar(255) NOT NULL,
  `Price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`ServiceID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `serviceusage`
--

DROP TABLE IF EXISTS `serviceusage`;
CREATE TABLE IF NOT EXISTS `serviceusage` (
  `UsageID` int(11) NOT NULL AUTO_INCREMENT,
  `ReservationID` int(11) DEFAULT NULL,
  `ServiceID` int(11) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
  PRIMARY KEY (`UsageID`),
  KEY `ReservationID` (`ReservationID`),
  KEY `ServiceID` (`ServiceID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `staff`
--

DROP TABLE IF EXISTS `staff`;
CREATE TABLE IF NOT EXISTS `staff` (
  `StaffID` int(11) NOT NULL AUTO_INCREMENT,
  `FullName` varchar(255) NOT NULL,
  `RoleID` int(11) DEFAULT NULL,
  `PhoneNumber` varchar(100) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`StaffID`),
  UNIQUE KEY `Email` (`Email`),
  KEY `RoleID` (`RoleID`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `staff`
--

INSERT INTO `staff` (`StaffID`, `FullName`, `RoleID`, `PhoneNumber`, `Email`) VALUES
(1, 'TRẦN HỒ MINH ĐỨC', 3, '$2b$10$fx2kPvpWEQkbgpZltRJE7ejeoSaS.yZCsbDdo4MZY38j4goK7ZON2', 'ductran123456@gmail.com');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
