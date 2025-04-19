-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3306
-- Thời gian đã tạo: Th4 19, 2025 lúc 04:25 AM
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
-- Cơ sở dữ liệu: `qlks`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bill`
--

DROP TABLE IF EXISTS `bill`;
CREATE TABLE IF NOT EXISTS `bill` (
  `billid` int(11) NOT NULL AUTO_INCREMENT,
  `amount` varchar(50) NOT NULL,
  `paymentdate` date NOT NULL,
  `bookid` int(11) NOT NULL,
  `methodid` int(11) NOT NULL,
  PRIMARY KEY (`billid`),
  KEY `fk_bill_method` (`methodid`),
  KEY `fk_bill_booking` (`bookid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `booking`
--

DROP TABLE IF EXISTS `booking`;
CREATE TABLE IF NOT EXISTS `booking` (
  `bookid` int(11) NOT NULL AUTO_INCREMENT,
  `checkin` date NOT NULL,
  `checkout` date NOT NULL,
  `roomid` int(11) NOT NULL,
  `cusid` int(11) DEFAULT NULL,
  `staffid` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`bookid`),
  KEY `roomid` (`roomid`),
  KEY `cusid` (`cusid`),
  KEY `staffid` (`staffid`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `booking`
--

INSERT INTO `booking` (`bookid`, `checkin`, `checkout`, `roomid`, `cusid`, `staffid`, `name`, `phone`) VALUES
(29, '2025-04-08', '2025-04-17', 3, NULL, NULL, 'Phan Thành Văn', '0868254679'),
(30, '2025-04-01', '2025-04-18', 3, NULL, NULL, 'dg', '0222222222'),
(31, '2025-04-15', '2025-04-19', 2, NULL, NULL, 'dfh', '0222222222'),
(32, '2025-04-14', '2025-04-24', 2, NULL, NULL, 'ghghg', '0222222111'),
(33, '2025-04-17', '2025-04-29', 2, NULL, NULL, 'fghfg', '0222222222'),
(34, '2025-04-15', '2025-05-01', 2, NULL, NULL, 'dfgdf', '0545400124'),
(35, '2025-04-03', '2025-04-24', 2, NULL, NULL, 'dfg', '0222222222'),
(36, '2025-04-07', '2025-04-25', 2, NULL, NULL, 'ghf', '0868254679'),
(37, '2025-04-16', '2025-04-30', 2, NULL, NULL, 'dfg', '0868254679');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `customer`
--

DROP TABLE IF EXISTS `customer`;
CREATE TABLE IF NOT EXISTS `customer` (
  `cusid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`cusid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payment_method`
--

DROP TABLE IF EXISTS `payment_method`;
CREATE TABLE IF NOT EXISTS `payment_method` (
  `methodid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`methodid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `payment_method`
--

INSERT INTO `payment_method` (`methodid`, `name`) VALUES
(1, 'Chuyển khoản'),
(2, 'Tiền mặt');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `room`
--

DROP TABLE IF EXISTS `room`;
CREATE TABLE IF NOT EXISTS `room` (
  `roomid` int(11) NOT NULL AUTO_INCREMENT,
  `roomtype` varchar(255) NOT NULL,
  `price` varchar(50) NOT NULL,
  `status` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  PRIMARY KEY (`roomid`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `room`
--

INSERT INTO `room` (`roomid`, `roomtype`, `price`, `status`, `image`) VALUES
(1, 'Đơn', '800000', 'booked', ''),
(2, 'Đôi', '500000', 'available', ''),
(3, 'Đơn', '800000', 'available', '');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `service`
--

DROP TABLE IF EXISTS `service`;
CREATE TABLE IF NOT EXISTS `service` (
  `serviceid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` varchar(50) NOT NULL,
  PRIMARY KEY (`serviceid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `serviceusage`
--

DROP TABLE IF EXISTS `serviceusage`;
CREATE TABLE IF NOT EXISTS `serviceusage` (
  `usageid` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `totalprice` varchar(50) NOT NULL,
  `bookid` int(11) NOT NULL,
  `serviceid` int(11) NOT NULL,
  KEY `bookid` (`bookid`),
  KEY `serviceid` (`serviceid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `staff`
--

DROP TABLE IF EXISTS `staff`;
CREATE TABLE IF NOT EXISTS `staff` (
  `staffid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `email` varchar(255) NOT NULL,
  `position` varchar(255) NOT NULL,
  PRIMARY KEY (`staffid`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `staff`
--

INSERT INTO `staff` (`staffid`, `name`, `phone`, `email`, `position`) VALUES
(1, 'dghdfhffaaaaa', '0868254679', 'hgh', 'Nhân viên'),
(2, 'fgdfg', 'dfgdfg', 'dfgdfg', 'Nhân viên'),
(3, 'dfgfdg', 'gdfgfd', 'dfgdf', 'Quản lý'),
(4, 'dfgd', 'dfgdfg', 'fgdfg', 'Admin'),
(5, 'fdgd', 'fdg', 'fgdfg', 'Nhân viên');

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `bill`
--
ALTER TABLE `bill`
  ADD CONSTRAINT `fk_bill_booking` FOREIGN KEY (`bookid`) REFERENCES `booking` (`bookid`),
  ADD CONSTRAINT `fk_bill_method` FOREIGN KEY (`methodid`) REFERENCES `payment_method` (`methodid`);

--
-- Các ràng buộc cho bảng `booking`
--
ALTER TABLE `booking`
  ADD CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`roomid`) REFERENCES `room` (`roomid`),
  ADD CONSTRAINT `booking_ibfk_2` FOREIGN KEY (`cusid`) REFERENCES `customer` (`cusid`),
  ADD CONSTRAINT `booking_ibfk_3` FOREIGN KEY (`staffid`) REFERENCES `staff` (`staffid`);

--
-- Các ràng buộc cho bảng `serviceusage`
--
ALTER TABLE `serviceusage`
  ADD CONSTRAINT `serviceusage_ibfk_1` FOREIGN KEY (`bookid`) REFERENCES `booking` (`bookid`),
  ADD CONSTRAINT `serviceusage_ibfk_2` FOREIGN KEY (`serviceid`) REFERENCES `service` (`serviceid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
