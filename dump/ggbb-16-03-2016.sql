-- phpMyAdmin SQL Dump
-- version 4.5.2
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Mar 16, 2016 at 05:58 PM
-- Server version: 5.7.9
-- PHP Version: 5.6.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ggbbdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `shoots`
--

DROP TABLE IF EXISTS `shoots`;
CREATE TABLE IF NOT EXISTS `shoots` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` char(16) NOT NULL,
  `type` varchar(16) NOT NULL,
  `title` varchar(255) NOT NULL,
  `frames` tinyint(4) NOT NULL,
  `active` tinyint(1) NOT NULL,
  `timer` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `uploaded_frames` tinyint(4) NOT NULL,
  `shoottime` timestamp NULL DEFAULT NULL,
  `gif_done` tinyint(1) NOT NULL DEFAULT '0',
  `thumbnail` tinytext,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=276 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `shoots`
--

INSERT INTO `shoots` (`id`, `uuid`, `type`, `title`, `frames`, `active`, `timer`, `uploaded_frames`, `shoottime`, `gif_done`, `thumbnail`) VALUES
(264, 'o3kx77', 'alone', 'bt', 3, 1, '2016-03-08 10:11:08', 3, '0000-00-00 00:00:00', 1, 'o3kx77-1-geek.jpg'),
(253, 'o3kf8a', 'alone', 'fauteuil', 5, 1, '2016-03-08 10:11:24', 5, '0000-00-00 00:00:00', 1, 'o3kf8a-1-bw.jpg'),
(204, 'o32frw', 'together', 'maziar2', 3, 1, '2016-03-08 10:11:40', 2, '2016-02-24 19:07:35', 1, 'o32frw-1.jpg'),
(265, 'o3mbvh', 'alone', 'tata', 3, 1, '2016-03-08 10:11:53', 3, '0000-00-00 00:00:00', 1, 'o3mbvh-1-bw.jpg'),
(263, 'o3kwxn', 'alone', 'bouteille2', 3, 1, '2016-03-08 10:12:03', 3, '0000-00-00 00:00:00', 1, 'o3kwxn-1-bw.jpg'),
(250, 'o3ixpi', 'alone', 'pp', 4, 1, '2016-03-08 10:12:15', 5, '0000-00-00 00:00:00', 1, 'o3ixpi-1.jpg'),
(270, 'o3q0rv', 'alone', 'postit', 1, 1, '2016-03-08 12:45:38', 1, '0000-00-00 00:00:00', 0, ''),
(271, 'o3q0ua', 'alone', 'post-it', 4, 1, '2016-03-08 12:47:37', 4, '0000-00-00 00:00:00', 1, 'o3q0ua-1.jpg'),
(272, 'o3qcr0', 'alone', 'test', 3, 1, '2016-03-08 17:04:32', 3, '0000-00-00 00:00:00', 1, 'o3qcr0-1.jpg'),
(273, 'o3sjjf', 'alone', 'uu', 1, 1, '2016-03-09 21:26:05', 1, '0000-00-00 00:00:00', 0, ''),
(274, 'o3sjtp', 'alone', 'yep', 5, 1, '2016-03-10 09:03:26', 5, '0000-00-00 00:00:00', 1, 'o3sjtp-1.jpg'),
(275, 'o458km', 'alone', 'test897', 1, 1, '2016-03-16 17:57:58', 0, NULL, 0, NULL);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
