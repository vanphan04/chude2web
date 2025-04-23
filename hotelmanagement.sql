-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3306
-- Thời gian đã tạo: Th4 21, 2025 lúc 10:41 AM
-- Phiên bản máy phục vụ: 8.2.0
-- Phiên bản PHP: 8.2.13

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
  `CustomerID` int NOT NULL AUTO_INCREMENT,
  `FullName` varchar(255) NOT NULL,
  `PhoneNumber` varchar(20) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `Address` text,
  PRIMARY KEY (`CustomerID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hotel`
--

DROP TABLE IF EXISTS `hotel`;
CREATE TABLE IF NOT EXISTS `hotel` (
  `HotelID` int NOT NULL AUTO_INCREMENT,
  `HotelName` varchar(255) NOT NULL,
  `Location` varchar(255) DEFAULT NULL,
  `Rating` decimal(2,1) DEFAULT NULL,
  PRIMARY KEY (`HotelID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payment`
--

DROP TABLE IF EXISTS `payment`;
CREATE TABLE IF NOT EXISTS `payment` (
  `PaymentID` int NOT NULL AUTO_INCREMENT,
  `ReservationID` int DEFAULT NULL,
  `Amount` decimal(10,2) DEFAULT NULL,
  `PaymentDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `PaymentMethod` enum('Cash','Credit Card','Debit Card','Online') DEFAULT NULL,
  PRIMARY KEY (`PaymentID`),
  KEY `ReservationID` (`ReservationID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reservation`
--

DROP TABLE IF EXISTS `reservation`;
CREATE TABLE IF NOT EXISTS `reservation` (
  `ReservationID` int NOT NULL AUTO_INCREMENT,
  `CustomerID` int DEFAULT NULL,
  `CustomerName` int DEFAULT NULL,
  `CustomerPhone` int DEFAULT NULL,
  `RoomID` int DEFAULT NULL,
  `CheckInDate` date DEFAULT NULL,
  `CheckOutDate` date DEFAULT NULL,
  `Status` enum('Pending','Confirmed','Completed','Cancelled') DEFAULT NULL,
  PRIMARY KEY (`ReservationID`),
  KEY `CustomerID` (`CustomerID`),
  KEY `RoomID` (`RoomID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `role`
--

DROP TABLE IF EXISTS `role`;
CREATE TABLE IF NOT EXISTS `role` (
  `RoleID` int NOT NULL AUTO_INCREMENT,
  `RoleName` varchar(100) NOT NULL,
  PRIMARY KEY (`RoleID`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `RoomID` int NOT NULL AUTO_INCREMENT,
  `HotelID` int DEFAULT NULL,
  `RoomType` varchar(100) DEFAULT NULL,
  `Price` decimal(10,2) DEFAULT NULL,
  `Status` enum('Available','Occupied','Maintenance') DEFAULT NULL,
  PRIMARY KEY (`RoomID`),
  KEY `HotelID` (`HotelID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `service`
--

DROP TABLE IF EXISTS `service`;
CREATE TABLE IF NOT EXISTS `service` (
  `ServiceID` int NOT NULL AUTO_INCREMENT,
  `ServiceName` varchar(255) NOT NULL,
  `Price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`ServiceID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `serviceusage`
--

DROP TABLE IF EXISTS `serviceusage`;
CREATE TABLE IF NOT EXISTS `serviceusage` (
  `UsageID` int NOT NULL AUTO_INCREMENT,
  `ReservationID` int DEFAULT NULL,
  `ServiceID` int DEFAULT NULL,
  `Quantity` int DEFAULT NULL,
  PRIMARY KEY (`UsageID`),
  KEY `ReservationID` (`ReservationID`),
  KEY `ServiceID` (`ServiceID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `staff`
--

DROP TABLE IF EXISTS `staff`;
CREATE TABLE IF NOT EXISTS `staff` (
  `StaffID` int NOT NULL AUTO_INCREMENT,
  `FullName` varchar(255) NOT NULL,
  `RoleID` int DEFAULT NULL,
  `PhoneNumber` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`StaffID`),
  UNIQUE KEY `Email` (`Email`),
  KEY `RoleID` (`RoleID`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `staff`
--

INSERT INTO `staff` (`StaffID`, `FullName`, `RoleID`, `PhoneNumber`, `Email`) VALUES
(1, 'TRẦN HỒ MINH ĐỨC', 3, '$2b$10$fx2kPvpWEQkbgpZltRJE7ejeoSaS.yZCsbDdo4MZY38j4goK7ZON2', 'ductran123456@gmail.com');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
