-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Mar 27, 2025 at 02:48 AM
-- Server version: 5.7.31
-- PHP Version: 7.4.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `qlks`
--

-- --------------------------------------------------------

--
-- Table structure for table `bill`
--

DROP TABLE IF EXISTS `bill`;
CREATE TABLE IF NOT EXISTS `bill` (
  `billid` int(11) NOT NULL AUTO_INCREMENT,
  `amount` varchar(50) NOT NULL,
  `paymentdate` date NOT NULL,
  `method` varchar(50) NOT NULL,
  `bookid` int(11) NOT NULL,
  PRIMARY KEY (`billid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

DROP TABLE IF EXISTS `booking`;
CREATE TABLE IF NOT EXISTS `booking` (
  `bookid` int(11) NOT NULL AUTO_INCREMENT,
  `checkin` date NOT NULL,
  `checkout` date NOT NULL,
  `roomid` int(11) NOT NULL,
  `cusid` int(11) NOT NULL,
  `staffid` int(11) NOT NULL,
  PRIMARY KEY (`bookid`),
  KEY `roomid` (`roomid`),
  KEY `cusid` (`cusid`),
  KEY `staffid` (`staffid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `customer`
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
-- Table structure for table `room`
--

DROP TABLE IF EXISTS `room`;
CREATE TABLE IF NOT EXISTS `room` (
  `roomid` int(11) NOT NULL AUTO_INCREMENT,
  `roomtype` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `status` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  PRIMARY KEY (`roomid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `service`
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
-- Table structure for table `serviceusage`
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
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
CREATE TABLE IF NOT EXISTS `staff` (
  `staffid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `email` varchar(255) NOT NULL,
  `position` varchar(255) NOT NULL,
  PRIMARY KEY (`staffid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bill`
--
ALTER TABLE `bill`
  ADD CONSTRAINT `bill_ibfk_1` FOREIGN KEY (`billid`) REFERENCES `booking` (`bookid`);

--
-- Constraints for table `booking`
--
ALTER TABLE `booking`
  ADD CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`roomid`) REFERENCES `room` (`roomid`),
  ADD CONSTRAINT `booking_ibfk_2` FOREIGN KEY (`cusid`) REFERENCES `customer` (`cusid`),
  ADD CONSTRAINT `booking_ibfk_3` FOREIGN KEY (`staffid`) REFERENCES `staff` (`staffid`);

--
-- Constraints for table `serviceusage`
--
ALTER TABLE `serviceusage`
  ADD CONSTRAINT `serviceusage_ibfk_1` FOREIGN KEY (`bookid`) REFERENCES `booking` (`bookid`),
  ADD CONSTRAINT `serviceusage_ibfk_2` FOREIGN KEY (`serviceid`) REFERENCES `service` (`serviceid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
