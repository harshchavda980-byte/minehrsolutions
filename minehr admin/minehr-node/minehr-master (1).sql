-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 25, 2026 at 10:14 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `minehr-master`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `module` varchar(255) NOT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  `details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`details`)),
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `company_id`, `user_id`, `action`, `module`, `ip_address`, `details`, `created_at`) VALUES
(1, 10, 1, 'Add Employee', 'Auth', '192.168.1.151', '{\"employee_id\":4535}', '2026-03-08 10:50:25'),
(2, 10, 1, 'Add Employee', 'Auth', '192.168.1.185', '{\"employee_id\":4535}', '2026-03-08 10:50:25'),
(3, 10, 1, 'Login', 'Auth', '192.168.1.186', '{\"msg\":\"User logged in successfully\"}', '2026-03-08 10:50:25'),
(4, 10, 1, 'Login', 'Auth', '192.168.1.153', '{\"msg\":\"User logged in successfully\"}', '2026-03-08 10:50:25'),
(5, 10, 1, 'Add Employee', 'Auth', '192.168.1.197', '{\"employee_id\":4535}', '2026-03-08 10:50:25'),
(6, 10, 1, 'Update Company', 'Companies', '192.168.1.229', '{\"field\":\"contact_mobile\",\"value\":\"+91 9876543210\"}', '2026-03-08 10:50:25'),
(7, 10, 1, 'Add Employee', 'Auth', '192.168.1.128', '{\"employee_id\":4535}', '2026-03-08 10:50:25'),
(8, 10, 1, 'Add Employee', 'Auth', '192.168.1.168', '{\"employee_id\":4535}', '2026-03-08 10:50:25'),
(9, 10, 1, 'Update Company', 'Companies', '192.168.1.84', '{\"field\":\"contact_mobile\",\"value\":\"+91 9876543210\"}', '2026-03-08 10:50:25'),
(10, 10, 1, 'Logout', 'Auth', '192.168.1.64', '{}', '2026-03-08 10:50:25'),
(11, 11, 1, 'Update Company', 'Companies', '192.168.1.242', '{\"field\":\"contact_mobile\",\"value\":\"+91 9876543210\"}', '2026-03-08 10:50:25'),
(12, 11, 1, 'Update Company', 'Companies', '192.168.1.43', '{\"field\":\"contact_mobile\",\"value\":\"+91 9876543210\"}', '2026-03-08 10:50:25'),
(13, 11, 1, 'Logout', 'Auth', '192.168.1.102', '{}', '2026-03-08 10:50:25'),
(14, 11, 1, 'Logout', 'Auth', '192.168.1.99', '{}', '2026-03-08 10:50:25'),
(15, 11, 1, 'Login', 'Auth', '192.168.1.48', '{\"msg\":\"User logged in successfully\"}', '2026-03-08 10:50:25'),
(16, 11, 1, 'Logout', 'Auth', '192.168.1.165', '{}', '2026-03-08 10:50:25'),
(17, 11, 1, 'Renew Plan', 'Plans', '192.168.1.67', '{\"duration\":\"1 Year\",\"price\":999}', '2026-03-08 10:50:25'),
(18, 11, 1, 'Logout', 'Auth', '192.168.1.130', '{}', '2026-03-08 10:50:25'),
(19, 11, 1, 'Add Employee', 'Auth', '192.168.1.39', '{\"employee_id\":8580}', '2026-03-08 10:50:25'),
(20, 11, 1, 'Add Employee', 'Auth', '192.168.1.194', '{\"employee_id\":8580}', '2026-03-08 10:50:25'),
(21, 12, 1, 'Update Company', 'Companies', '192.168.1.150', '{\"field\":\"contact_mobile\",\"value\":\"+91 9876543210\"}', '2026-03-08 10:50:25'),
(22, 12, 1, 'Logout', 'Auth', '192.168.1.19', '{}', '2026-03-08 10:50:25'),
(23, 12, 1, 'Renew Plan', 'Plans', '192.168.1.15', '{\"duration\":\"1 Year\",\"price\":999}', '2026-03-08 10:50:25'),
(24, 12, 1, 'Renew Plan', 'Plans', '192.168.1.230', '{\"duration\":\"1 Year\",\"price\":999}', '2026-03-08 10:50:25'),
(25, 12, 1, 'Renew Plan', 'Plans', '192.168.1.123', '{\"duration\":\"1 Year\",\"price\":999}', '2026-03-08 10:50:25'),
(26, 12, 1, 'Logout', 'Auth', '192.168.1.11', '{}', '2026-03-08 10:50:25'),
(27, 12, 1, 'Login', 'Auth', '192.168.1.38', '{\"msg\":\"User logged in successfully\"}', '2026-03-08 10:50:25'),
(28, 12, 1, 'Add Employee', 'Auth', '192.168.1.216', '{\"employee_id\":3219}', '2026-03-08 10:50:25'),
(29, 12, 1, 'Logout', 'Auth', '192.168.1.215', '{}', '2026-03-08 10:50:25'),
(30, 12, 1, 'Logout', 'Auth', '192.168.1.116', '{}', '2026-03-08 10:50:25'),
(31, 13, 1, 'Add Employee', 'Auth', '192.168.1.170', '{\"employee_id\":1255}', '2026-03-08 10:50:25'),
(32, 13, 1, 'Login', 'Auth', '192.168.1.90', '{\"msg\":\"User logged in successfully\"}', '2026-03-08 10:50:25'),
(33, 13, 1, 'Login', 'Auth', '192.168.1.38', '{\"msg\":\"User logged in successfully\"}', '2026-03-08 10:50:25'),
(34, 13, 1, 'Renew Plan', 'Plans', '192.168.1.254', '{\"duration\":\"1 Year\",\"price\":999}', '2026-03-08 10:50:25'),
(35, 13, 1, 'Login', 'Auth', '192.168.1.17', '{\"msg\":\"User logged in successfully\"}', '2026-03-08 10:50:25'),
(36, 13, 1, 'Add Employee', 'Auth', '192.168.1.84', '{\"employee_id\":1255}', '2026-03-08 10:50:25'),
(37, 13, 1, 'Renew Plan', 'Plans', '192.168.1.50', '{\"duration\":\"1 Year\",\"price\":999}', '2026-03-08 10:50:25'),
(38, 13, 1, 'Renew Plan', 'Plans', '192.168.1.88', '{\"duration\":\"1 Year\",\"price\":999}', '2026-03-08 10:50:25'),
(39, 13, 1, 'Renew Plan', 'Plans', '192.168.1.244', '{\"duration\":\"1 Year\",\"price\":999}', '2026-03-08 10:50:25'),
(40, 13, 1, 'Update Company', 'Companies', '192.168.1.3', '{\"field\":\"contact_mobile\",\"value\":\"+91 9876543210\"}', '2026-03-08 10:50:25'),
(41, 14, 1, 'Update Company', 'Companies', '192.168.1.2', '{\"field\":\"contact_mobile\",\"value\":\"+91 9876543210\"}', '2026-03-08 10:50:25'),
(42, 14, 1, 'Login', 'Auth', '192.168.1.11', '{\"msg\":\"User logged in successfully\"}', '2026-03-08 10:50:25'),
(43, 14, 1, 'Update Company', 'Companies', '192.168.1.43', '{\"field\":\"contact_mobile\",\"value\":\"+91 9876543210\"}', '2026-03-08 10:50:25'),
(44, 14, 1, 'Login', 'Auth', '192.168.1.124', '{\"msg\":\"User logged in successfully\"}', '2026-03-08 10:50:25'),
(45, 14, 1, 'Renew Plan', 'Plans', '192.168.1.227', '{\"duration\":\"1 Year\",\"price\":999}', '2026-03-08 10:50:25'),
(46, 14, 1, 'Renew Plan', 'Plans', '192.168.1.213', '{\"duration\":\"1 Year\",\"price\":999}', '2026-03-08 10:50:25'),
(47, 14, 1, 'Logout', 'Auth', '192.168.1.210', '{}', '2026-03-08 10:50:25'),
(48, 14, 1, 'Renew Plan', 'Plans', '192.168.1.13', '{\"duration\":\"1 Year\",\"price\":999}', '2026-03-08 10:50:25'),
(49, 14, 1, 'Renew Plan', 'Plans', '192.168.1.70', '{\"duration\":\"1 Year\",\"price\":999}', '2026-03-08 10:50:25'),
(50, 14, 1, 'Login', 'Auth', '192.168.1.228', '{\"msg\":\"User logged in successfully\"}', '2026-03-08 10:50:25');

-- --------------------------------------------------------

--
-- Table structure for table `app_usages`
--

CREATE TABLE `app_usages` (
  `id` int(11) NOT NULL,
  `module_name` varchar(255) NOT NULL,
  `usage_count` int(11) DEFAULT 0,
  `month` varchar(255) NOT NULL,
  `year` varchar(255) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `app_usages`
--

INSERT INTO `app_usages` (`id`, `module_name`, `usage_count`, `month`, `year`, `company_id`, `created_at`, `updated_at`) VALUES
(1, 'My Visits', 1532, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(2, 'Leave', 1769, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(3, 'Work Report', 133, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(4, 'My Expense', 507, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(5, 'Take Order', 298, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(6, 'Sales', 163, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(7, 'Timeline', 139, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(8, 'Payslip', 388, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(9, 'Chat', 104, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(10, 'Attendance', 392, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(11, 'Circular', 14, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(12, 'Employees', 57, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(13, 'Tasks', 17, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(14, 'Documents', 69, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(15, 'Discussion', 70, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(16, 'CRM', 77, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(17, 'Work Allocation', 91, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(18, 'Targets & Achievements', 55, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(19, 'Assets', 39, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(20, 'Holiday', 43, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(21, 'My ID Card', 24, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(22, 'Tax Exemption', 102, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(23, 'Bank Accounts', 95, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(24, 'My Profile', 84, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(25, 'Advance Salary', 17, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(26, 'WFH', 45, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(27, 'Gallery', 98, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(28, 'Loan', 80, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(29, 'Performance Matrix', 35, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(30, 'Events', 32, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(31, 'Visiting Card', 104, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(32, 'Appointments', 25, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(33, 'My Notes', 28, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(34, 'Meetings', 19, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(35, 'Current Openings', 75, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(36, 'Parking', 58, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(37, 'Company Info', 103, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(38, 'Greetings', 104, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(39, 'Reminders', 86, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(40, 'Survey', 95, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(41, 'Penalty', 92, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(42, 'Visitors', 35, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(43, 'LMS', 12, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(44, 'Idea Box', 53, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(45, 'Complain', 36, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(46, 'Vendors', 97, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(47, 'Support', 39, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(48, 'Polls', 64, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(49, 'QR/Barcode Scanner', 49, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(50, 'Lost & Found', 101, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(51, 'Escalation', 27, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(52, 'SOS', 29, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(53, 'Emergency', 95, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45'),
(54, 'Canteen', 78, 'March', '2026', NULL, '2026-03-05 10:20:45', '2026-03-05 10:20:45');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `companies`
--

CREATE TABLE `companies` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `employee_count` int(11) DEFAULT NULL,
  `status` enum('pending','verified','rejected','inactive') DEFAULT 'pending',
  `plan` enum('basic','pro','enterprise') DEFAULT 'basic',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `company_code` varchar(255) DEFAULT NULL,
  `contact_mobile` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `contact_person` varchar(255) DEFAULT NULL,
  `rejection_reason` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `companies`
--

INSERT INTO `companies` (`id`, `name`, `city`, `state`, `country`, `employee_count`, `status`, `plan`, `created_at`, `updated_at`, `company_code`, `contact_mobile`, `address`, `email`, `contact_person`, `rejection_reason`) VALUES
(1, 'TechCorp Solutions', 'Bangalore', 'Karnataka', 'India', 250, '', 'pro', '2026-03-02 09:42:08', '2026-03-05 10:27:59', NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'Global Industries', 'Mumbai', 'Maharashtra', 'India', 1200, 'verified', 'enterprise', '2026-03-02 09:42:08', '2026-03-02 09:42:08', NULL, NULL, NULL, NULL, NULL, NULL),
(3, 'Swift Food', 'Delhi', 'Delhi', 'India', 45, 'pending', 'basic', '2026-03-02 09:42:08', '2026-03-02 09:42:08', NULL, NULL, NULL, NULL, NULL, NULL),
(4, 'Limit Test Corp', NULL, NULL, NULL, NULL, 'verified', 'basic', '2026-03-07 18:23:34', '2026-03-07 18:23:34', 'LTC001', NULL, NULL, NULL, NULL, NULL),
(6, 'TechFlow Solutions', NULL, NULL, NULL, NULL, 'verified', 'pro', '2026-03-08 10:40:50', '2026-03-08 10:40:50', 'TS412', NULL, NULL, NULL, NULL, NULL),
(7, 'Green Horizon Ltd', NULL, NULL, NULL, NULL, 'verified', 'basic', '2026-03-08 10:40:50', '2026-03-08 10:40:50', 'GHL561', NULL, NULL, NULL, NULL, NULL),
(8, 'Global Logistics Inc', NULL, NULL, NULL, NULL, 'verified', 'enterprise', '2026-03-08 10:40:50', '2026-03-08 10:40:50', 'GLI236', NULL, NULL, NULL, NULL, NULL),
(9, 'Startup Hive', NULL, NULL, NULL, NULL, 'verified', 'basic', '2026-03-08 10:40:50', '2026-03-08 10:40:50', 'SH748', NULL, NULL, NULL, NULL, NULL),
(10, 'Skyline Architects', NULL, NULL, NULL, NULL, 'verified', 'pro', '2026-03-08 10:50:25', '2026-03-08 10:50:25', 'SKY812', NULL, NULL, NULL, NULL, NULL),
(11, 'Pure Water Solutions', NULL, NULL, NULL, NULL, 'verified', 'basic', '2026-03-08 10:50:25', '2026-03-08 10:50:25', 'PUR386', NULL, NULL, NULL, NULL, NULL),
(12, 'NextGen Robotics', NULL, NULL, NULL, NULL, 'verified', 'enterprise', '2026-03-08 10:50:25', '2026-03-08 10:50:25', 'NEX451', NULL, NULL, NULL, NULL, NULL),
(13, 'Elite Marketing', NULL, NULL, NULL, NULL, 'verified', 'pro', '2026-03-08 10:50:25', '2026-03-08 10:50:25', 'ELI255', NULL, NULL, NULL, NULL, NULL),
(14, 'Local Grocers', NULL, NULL, NULL, NULL, 'verified', 'basic', '2026-03-08 10:50:25', '2026-03-08 10:50:25', 'LOC918', NULL, NULL, NULL, NULL, NULL),
(15, 'Pending Corp', NULL, NULL, NULL, NULL, 'pending', 'basic', '2026-03-08 10:56:22', '2026-03-08 10:56:22', 'PEND123', NULL, NULL, NULL, NULL, NULL),
(16, 'Rejected Ltd', NULL, NULL, NULL, NULL, 'rejected', 'pro', '2026-03-08 10:56:22', '2026-03-08 10:56:22', 'REJ456', NULL, NULL, NULL, NULL, NULL),
(17, 'MineHR Global', 'Surat', NULL, NULL, NULL, 'verified', 'enterprise', '2026-03-08 10:57:58', '2026-03-08 10:57:58', 'MHR001', NULL, NULL, NULL, NULL, NULL),
(18, 'Tech Solutions', 'Mumbai', NULL, NULL, NULL, 'verified', 'pro', '2026-03-08 10:57:58', '2026-03-08 10:57:58', 'TECH99', NULL, NULL, NULL, NULL, NULL),
(19, 'Fresh Startup Inc', 'Delhi', NULL, NULL, NULL, 'pending', 'basic', '2026-03-08 10:57:58', '2026-03-08 10:57:58', 'STRT01', NULL, NULL, NULL, NULL, NULL),
(20, 'Future Systems', 'Bangalore', NULL, NULL, NULL, 'pending', 'pro', '2026-03-08 10:57:58', '2026-03-08 10:57:58', 'FUTR22', NULL, NULL, NULL, NULL, NULL),
(21, 'Bad Data Corp', 'Test', NULL, NULL, NULL, 'rejected', 'basic', '2026-03-08 10:57:58', '2026-03-08 10:57:58', 'BAD000', NULL, NULL, NULL, NULL, NULL),
(22, 'Alpha Corp', 'Surat', NULL, NULL, NULL, 'pending', 'pro', '2026-03-08 11:07:17', '2026-03-08 11:07:17', NULL, '9876543210', NULL, 'alpha@test.com', 'John Doe', NULL),
(23, 'Beta Systems', 'Mumbai', NULL, NULL, NULL, 'pending', 'enterprise', '2026-03-08 11:07:17', '2026-03-08 11:07:17', NULL, '1234567890', NULL, 'beta@test.com', 'Jane Smith', NULL),
(24, 'Request Co 1', 'City 1', NULL, 'India', NULL, 'pending', 'basic', '2026-03-08 11:10:46', '2026-03-08 11:10:46', NULL, '900000001', NULL, 'req1@example.com', 'Contact 1', NULL),
(25, 'Request Co 2', 'City 2', NULL, 'India', NULL, 'pending', 'pro', '2026-03-08 11:10:46', '2026-03-08 11:10:46', NULL, '900000002', NULL, 'req2@example.com', 'Contact 2', NULL),
(26, 'Request Co 3', 'City 3', NULL, 'India', NULL, 'pending', 'basic', '2026-03-08 11:10:46', '2026-03-08 11:10:46', NULL, '900000003', NULL, 'req3@example.com', 'Contact 3', NULL),
(27, 'Request Co 4', 'City 4', NULL, 'India', NULL, 'pending', 'pro', '2026-03-08 11:10:46', '2026-03-08 11:10:46', NULL, '900000004', NULL, 'req4@example.com', 'Contact 4', NULL),
(28, 'Request Co 5', 'City 5', NULL, 'India', NULL, 'pending', 'basic', '2026-03-08 11:10:46', '2026-03-08 11:10:46', NULL, '900000005', NULL, 'req5@example.com', 'Contact 5', NULL),
(29, 'Request Co 6', 'City 6', NULL, 'India', NULL, 'pending', 'pro', '2026-03-08 11:10:46', '2026-03-08 11:10:46', NULL, '900000006', NULL, 'req6@example.com', 'Contact 6', NULL),
(30, 'Request Co 7', 'City 7', NULL, 'India', NULL, 'pending', 'basic', '2026-03-08 11:10:46', '2026-03-08 11:10:46', NULL, '900000007', NULL, 'req7@example.com', 'Contact 7', NULL),
(31, 'Request Co 8', 'City 8', NULL, 'India', NULL, 'pending', 'pro', '2026-03-08 11:10:46', '2026-03-08 11:10:46', NULL, '900000008', NULL, 'req8@example.com', 'Contact 8', NULL),
(32, 'Request Co 9', 'City 9', NULL, 'India', NULL, 'pending', 'basic', '2026-03-08 11:10:46', '2026-03-08 11:10:46', NULL, '900000009', NULL, 'req9@example.com', 'Contact 9', NULL),
(33, 'Request Co 10', 'City 10', NULL, 'India', NULL, 'pending', 'pro', '2026-03-08 11:10:46', '2026-03-08 11:10:46', NULL, '9000000010', NULL, 'req10@example.com', 'Contact 10', NULL),
(34, 'Request Co 11', 'City 11', NULL, 'India', NULL, 'pending', 'basic', '2026-03-08 11:10:46', '2026-03-08 11:10:46', NULL, '9000000011', NULL, 'req11@example.com', 'Contact 11', NULL),
(35, 'Request Co 12', 'City 12', NULL, 'India', NULL, 'pending', 'pro', '2026-03-08 11:10:46', '2026-03-08 11:10:46', NULL, '9000000012', NULL, 'req12@example.com', 'Contact 12', NULL),
(36, 'Request Co 13', 'City 13', NULL, 'India', NULL, 'pending', 'basic', '2026-03-08 11:10:46', '2026-03-08 11:10:46', NULL, '9000000013', NULL, 'req13@example.com', 'Contact 13', NULL),
(37, 'Request Co 14', 'City 14', NULL, 'India', NULL, 'pending', 'pro', '2026-03-08 11:10:46', '2026-03-08 11:10:46', NULL, '9000000014', NULL, 'req14@example.com', 'Contact 14', NULL),
(38, 'Request Co 15', 'City 15', NULL, 'India', NULL, 'pending', 'basic', '2026-03-08 11:10:46', '2026-03-08 11:10:46', NULL, '9000000015', NULL, 'req15@example.com', 'Contact 15', NULL),
(39, 'Request Co 16', 'City 16', NULL, 'India', NULL, 'pending', 'pro', '2026-03-08 11:10:46', '2026-03-08 11:10:46', NULL, '9000000016', NULL, 'req16@example.com', 'Contact 16', NULL),
(40, 'Request Co 17', 'City 17', NULL, 'India', NULL, 'pending', 'basic', '2026-03-08 11:10:46', '2026-03-08 11:10:46', NULL, '9000000017', NULL, 'req17@example.com', 'Contact 17', NULL),
(41, 'Request Co 18', 'City 18', NULL, 'India', NULL, 'pending', 'pro', '2026-03-08 11:10:46', '2026-03-08 11:10:46', NULL, '9000000018', NULL, 'req18@example.com', 'Contact 18', NULL),
(42, 'Request Co 19', 'City 19', NULL, 'India', NULL, 'pending', 'basic', '2026-03-08 11:10:46', '2026-03-08 11:10:46', NULL, '9000000019', NULL, 'req19@example.com', 'Contact 19', NULL),
(43, 'Request Co 20', 'City 20', NULL, 'India', NULL, 'pending', 'pro', '2026-03-08 11:10:46', '2026-03-08 11:10:46', NULL, '9000000020', NULL, 'req20@example.com', 'Contact 20', NULL),
(44, 'Request Co 21', 'City 21', NULL, 'India', NULL, 'pending', 'basic', '2026-03-08 11:10:46', '2026-03-08 11:10:46', NULL, '9000000021', NULL, 'req21@example.com', 'Contact 21', NULL),
(45, 'Request Co 22', 'City 22', NULL, 'India', NULL, 'pending', 'pro', '2026-03-08 11:10:46', '2026-03-08 11:10:46', NULL, '9000000022', NULL, 'req22@example.com', 'Contact 22', NULL),
(46, 'Request Co 23', 'City 23', NULL, 'India', NULL, 'pending', 'basic', '2026-03-08 11:10:46', '2026-03-08 11:10:46', NULL, '9000000023', NULL, 'req23@example.com', 'Contact 23', NULL),
(47, 'Request Co 24', 'City 24', NULL, 'India', NULL, 'pending', 'pro', '2026-03-08 11:10:46', '2026-03-08 11:10:46', NULL, '9000000024', NULL, 'req24@example.com', 'Contact 24', NULL),
(48, 'Request Co 25', 'City 25', NULL, 'India', NULL, 'pending', 'basic', '2026-03-08 11:10:46', '2026-03-08 11:10:46', NULL, '9000000025', NULL, 'req25@example.com', 'Contact 25', NULL),
(49, 'Active Tech', NULL, NULL, NULL, 5, 'verified', 'pro', '2026-03-08 11:17:01', '2026-03-08 11:17:01', NULL, '9998887776', NULL, 'active@tech.com', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `company_plans`
--

CREATE TABLE `company_plans` (
  `id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `plan_name` varchar(255) DEFAULT 'basic',
  `start_date` date DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `status` enum('active','expiring','expired') DEFAULT 'active',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `plan_duration` enum('1 Month','6 Month','1 Year','Custom') DEFAULT NULL,
  `plan_history` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`plan_history`)),
  `payment_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`payment_details`)),
  `employee_limit` int(11) DEFAULT 10
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `company_plans`
--

INSERT INTO `company_plans` (`id`, `company_id`, `plan_name`, `start_date`, `expiry_date`, `status`, `created_at`, `updated_at`, `plan_duration`, `plan_history`, `payment_details`, `employee_limit`) VALUES
(1, 1, 'Premium Annual', '2025-01-01', '2026-12-31', 'active', '2026-03-05 10:28:54', '2026-03-05 10:28:54', NULL, NULL, NULL, 10),
(2, 2, 'basic', '2026-02-15', '2026-03-31', 'active', '2026-03-05 10:28:54', '2026-03-07 17:51:26', 'Custom', '[{\"old_plan\":\"Starter Monthly\",\"old_expiry\":\"2026-03-20\",\"new_plan\":\"basic\",\"new_expiry\":\"2026-03-24\",\"updated_at\":\"2026-03-07T17:50:36.955Z\"},{\"old_plan\":\"basic\",\"old_expiry\":\"2026-03-24\",\"new_plan\":\"basic\",\"new_expiry\":\"2026-03-31\",\"updated_at\":\"2026-03-07T17:51:26.078Z\"}]', NULL, 10),
(3, 3, 'basic', '2024-01-01', '2026-04-30', 'active', '2026-03-05 10:28:54', '2026-03-07 17:52:26', 'Custom', '[{\"old_plan\":\"Basic Plan\",\"old_expiry\":\"2025-01-01\",\"new_plan\":\"basic\",\"new_expiry\":\"2025-01-15\",\"updated_at\":\"2026-03-07T17:43:22.079Z\"},{\"old_plan\":\"basic\",\"old_expiry\":\"2025-01-15\",\"new_plan\":\"basic\",\"new_expiry\":\"2026-03-23\",\"updated_at\":\"2026-03-07T17:52:13.052Z\"},{\"old_plan\":\"basic\",\"old_expiry\":\"2026-03-23\",\"new_plan\":\"basic\",\"new_expiry\":\"2026-04-30\",\"updated_at\":\"2026-03-07T17:52:26.712Z\"}]', NULL, 10),
(4, 4, 'pro', NULL, NULL, 'expired', '2026-03-07 18:23:34', '2026-03-08 10:51:44', NULL, NULL, NULL, 5),
(5, 6, 'pro', NULL, '2026-04-07', 'active', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, 20),
(6, 7, 'basic', NULL, '2026-04-07', 'active', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, 10),
(7, 8, 'enterprise', NULL, '2026-04-07', 'active', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, 50),
(8, 9, 'basic', NULL, '2026-04-07', 'active', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, 5),
(9, 10, 'pro', NULL, '2026-05-07', 'active', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, 15),
(10, 11, 'basic', NULL, '2026-05-07', 'active', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, 10),
(11, 12, 'enterprise', NULL, '2026-05-07', 'active', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, 100),
(12, 13, 'pro', NULL, '2026-05-07', 'active', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, 25),
(13, 14, 'basic', NULL, '2026-05-07', 'active', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, 5),
(14, 49, 'pro', '2024-01-01', '2025-01-01', 'active', '2026-03-08 11:17:01', '2026-03-08 11:17:01', NULL, NULL, NULL, 50);

-- --------------------------------------------------------

--
-- Table structure for table `escalation_histories`
--

CREATE TABLE `escalation_histories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `feedback_id` bigint(20) UNSIGNED NOT NULL,
  `action` varchar(255) NOT NULL,
  `escalated_by` bigint(20) UNSIGNED NOT NULL,
  `escalated_to` bigint(20) UNSIGNED DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `feedbacks`
--

CREATE TABLE `feedbacks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `feedback_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contact_number` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `status` enum('New','In Progress','Escalated','Resolved') DEFAULT 'New',
  `assigned_to` bigint(20) UNSIGNED DEFAULT NULL,
  `company_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedbacks`
--

INSERT INTO `feedbacks` (`id`, `feedback_id`, `name`, `email`, `contact_number`, `subject`, `message`, `status`, `assigned_to`, `company_id`, `created_at`, `updated_at`) VALUES
(1, 'FB-20260308-001', 'User 1', 'user1@example.com', NULL, 'Inquiry 1', 'This is a sample feedback message for inquiry 1. Please follow up.', 'New', NULL, NULL, '2026-03-08 11:31:49', '2026-03-08 11:31:49'),
(2, 'FB-20260308-002', 'User 2', 'user2@example.com', NULL, 'Inquiry 2', 'This is a sample feedback message for inquiry 2. Please follow up.', 'New', NULL, NULL, '2026-03-08 11:31:49', '2026-03-08 11:31:49'),
(3, 'FB-20260308-003', 'User 3', 'user3@example.com', NULL, 'Inquiry 3', 'This is a sample feedback message for inquiry 3. Please follow up.', 'Resolved', NULL, NULL, '2026-03-08 11:31:49', '2026-03-08 11:31:49'),
(4, 'FB-20260308-004', 'User 4', 'user4@example.com', NULL, 'Inquiry 4', 'This is a sample feedback message for inquiry 4. Please follow up.', 'Escalated', NULL, NULL, '2026-03-08 11:31:49', '2026-03-08 11:31:49'),
(5, 'FB-20260308-005', 'User 5', 'user5@example.com', NULL, 'Inquiry 5', 'This is a sample feedback message for inquiry 5. Please follow up.', 'New', NULL, NULL, '2026-03-08 11:31:49', '2026-03-08 11:31:49'),
(6, 'FB-20260308-006', 'User 6', 'user6@example.com', NULL, 'Inquiry 6', 'This is a sample feedback message for inquiry 6. Please follow up.', 'Resolved', NULL, NULL, '2026-03-08 11:31:49', '2026-03-08 11:31:49'),
(7, 'FB-20260308-007', 'User 7', 'user7@example.com', NULL, 'Inquiry 7', 'This is a sample feedback message for inquiry 7. Please follow up.', 'New', NULL, NULL, '2026-03-08 11:31:49', '2026-03-08 11:31:49'),
(8, 'FB-20260308-008', 'User 8', 'user8@example.com', NULL, 'Inquiry 8', 'This is a sample feedback message for inquiry 8. Please follow up.', 'Escalated', NULL, NULL, '2026-03-08 11:31:49', '2026-03-08 11:31:49'),
(9, 'FB-20260308-009', 'User 9', 'user9@example.com', NULL, 'Inquiry 9', 'This is a sample feedback message for inquiry 9. Please follow up.', 'Resolved', NULL, NULL, '2026-03-08 11:31:49', '2026-03-08 11:31:49'),
(10, 'FB-20260308-0010', 'User 10', 'user10@example.com', NULL, 'Inquiry 10', 'This is a sample feedback message for inquiry 10. Please follow up.', 'New', NULL, NULL, '2026-03-08 11:31:49', '2026-03-08 11:31:49'),
(11, 'FB-20260308-0011', 'User 11', 'user11@example.com', NULL, 'Inquiry 11', 'This is a sample feedback message for inquiry 11. Please follow up.', 'New', NULL, NULL, '2026-03-08 11:31:49', '2026-03-08 11:31:49'),
(12, 'FB-20260308-0012', 'User 12', 'user12@example.com', NULL, 'Inquiry 12', 'This is a sample feedback message for inquiry 12. Please follow up.', 'Escalated', NULL, NULL, '2026-03-08 11:31:49', '2026-03-08 11:31:49');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `leads`
--

CREATE TABLE `leads` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `status` enum('new','contacted','qualified','lost') NOT NULL DEFAULT 'new',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `leads`
--

INSERT INTO `leads` (`id`, `name`, `email`, `phone`, `company_name`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Rajesh Kumar', 'rajesh@example.com', '9888888888', 'New Ventures Ltd', 'new', '2026-03-02 09:42:08', '2026-03-02 09:42:08'),
(2, 'Sneha Patil', 'sneha@example.com', '9777777777', 'Startup Hub', 'qualified', '2026-03-02 09:42:08', '2026-03-02 09:42:08');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_02_16_033039_create_companies_table', 1),
(5, '2026_02_16_033039_create_tickets_table', 1),
(6, '2026_02_16_033040_create_leads_table', 1),
(7, '2026_02_16_033040_create_recent_activities_table', 1),
(8, '2026_02_16_034324_create_page_clicks_table', 1),
(9, '2026_02_16_034324_create_roles_table', 1),
(10, '2026_02_16_041038_add_soft_deletes_to_users_and_companies_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `page_clicks`
--

CREATE TABLE `page_clicks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `page_url` varchar(255) NOT NULL,
  `element_id` varchar(255) DEFAULT NULL,
  `element_text` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `recent_activities`
--

CREATE TABLE `recent_activities` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `description` varchar(255) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`permissions`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('CCSP4WEhwdQoR4TRkdzj1b0wSnRXRHOrYJglGK6Y', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiV1pFOTF1cWhSNUl5bHhvVzVpY0hSalJKT3BmY3hkb1pMRGVFQU9GaCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9kYXNoYm9hcmQiO3M6NToicm91dGUiO3M6OToiZGFzaGJvYXJkIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTt9', 1772464390);

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `subject` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `status` enum('open','in_progress','resolved','closed') NOT NULL DEFAULT 'open',
  `priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`id`, `subject`, `description`, `company_id`, `status`, `priority`, `created_at`, `updated_at`) VALUES
(1, 'Issue with login', 'User unable to login to the portal.', 1, 'open', 'high', '2026-03-02 09:42:08', '2026-03-02 09:42:08'),
(2, 'Server Maintenance', 'Scheduled downtime for server upgrade.', 2, 'resolved', 'medium', '2026-03-02 09:42:08', '2026-03-02 09:42:08');

-- --------------------------------------------------------

--
-- Table structure for table `ticket_histories`
--

CREATE TABLE `ticket_histories` (
  `id` int(11) NOT NULL,
  `ticket_id` bigint(20) UNSIGNED NOT NULL,
  `action` varchar(255) NOT NULL,
  `notes` text DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` datetime DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT 'User',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `countries` varchar(255) DEFAULT NULL,
  `timezone` varchar(255) DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `fcm_notifications` tinyint(1) DEFAULT 0,
  `language` varchar(255) DEFAULT 'English',
  `is_developer` tinyint(1) DEFAULT 0,
  `company_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role`, `created_at`, `updated_at`, `phone`, `countries`, `timezone`, `last_login`, `created_by`, `updated_by`, `fcm_notifications`, `language`, `is_developer`, `company_id`) VALUES
(1, 'Admin User', 'admin@minehr.com', NULL, '$2y$12$C8YqMZKN585aTFmbLnK7AOyZeUqnvNQsEFP8h5WWFR6D5VRngwhR6', 'Super Admin', '2026-03-02 09:42:08', '2026-03-02 09:42:08', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, NULL),
(2, 'Harshil Thakrar', 'harshilthakrar33@gmail.com', NULL, '$2b$12$rE22gIU391ljEklA6h8Dy.R/hAZhJChh35AjFy.SBpMxkko41JF.C', 'Manager', '2026-03-02 17:01:47', '2026-03-02 17:01:47', '6351143540', 'India', 'Asia/Kolkata', NULL, NULL, NULL, 1, 'English', 0, NULL),
(3, 'TechFlow Solutions Emp 1', 'emp1@techflowsolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 6),
(4, 'TechFlow Solutions Emp 2', 'emp2@techflowsolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 6),
(5, 'TechFlow Solutions Emp 3', 'emp3@techflowsolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 6),
(6, 'TechFlow Solutions Emp 4', 'emp4@techflowsolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 6),
(7, 'TechFlow Solutions Emp 5', 'emp5@techflowsolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 6),
(8, 'TechFlow Solutions Emp 6', 'emp6@techflowsolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 6),
(9, 'TechFlow Solutions Emp 7', 'emp7@techflowsolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 6),
(10, 'TechFlow Solutions Emp 8', 'emp8@techflowsolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 6),
(11, 'TechFlow Solutions Emp 9', 'emp9@techflowsolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 6),
(12, 'TechFlow Solutions Emp 10', 'emp10@techflowsolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 6),
(13, 'TechFlow Solutions Emp 11', 'emp11@techflowsolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 6),
(14, 'TechFlow Solutions Emp 12', 'emp12@techflowsolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 6),
(15, 'TechFlow Solutions Emp 13', 'emp13@techflowsolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 6),
(16, 'TechFlow Solutions Emp 14', 'emp14@techflowsolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 6),
(17, 'TechFlow Solutions Emp 15', 'emp15@techflowsolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 6),
(18, 'Green Horizon Ltd Emp 1', 'emp1@greenhorizonltd.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 7),
(19, 'Green Horizon Ltd Emp 2', 'emp2@greenhorizonltd.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 7),
(20, 'Green Horizon Ltd Emp 3', 'emp3@greenhorizonltd.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 7),
(21, 'Green Horizon Ltd Emp 4', 'emp4@greenhorizonltd.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 7),
(22, 'Green Horizon Ltd Emp 5', 'emp5@greenhorizonltd.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 7),
(23, 'Green Horizon Ltd Emp 6', 'emp6@greenhorizonltd.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 7),
(24, 'Green Horizon Ltd Emp 7', 'emp7@greenhorizonltd.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 7),
(25, 'Green Horizon Ltd Emp 8', 'emp8@greenhorizonltd.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 7),
(26, 'Green Horizon Ltd Emp 9', 'emp9@greenhorizonltd.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 7),
(27, 'Green Horizon Ltd Emp 10', 'emp10@greenhorizonltd.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 7),
(28, 'Global Logistics Inc Emp 1', 'emp1@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(29, 'Global Logistics Inc Emp 2', 'emp2@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(30, 'Global Logistics Inc Emp 3', 'emp3@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(31, 'Global Logistics Inc Emp 4', 'emp4@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(32, 'Global Logistics Inc Emp 5', 'emp5@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(33, 'Global Logistics Inc Emp 6', 'emp6@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(34, 'Global Logistics Inc Emp 7', 'emp7@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(35, 'Global Logistics Inc Emp 8', 'emp8@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(36, 'Global Logistics Inc Emp 9', 'emp9@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(37, 'Global Logistics Inc Emp 10', 'emp10@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(38, 'Global Logistics Inc Emp 11', 'emp11@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(39, 'Global Logistics Inc Emp 12', 'emp12@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(40, 'Global Logistics Inc Emp 13', 'emp13@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(41, 'Global Logistics Inc Emp 14', 'emp14@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(42, 'Global Logistics Inc Emp 15', 'emp15@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(43, 'Global Logistics Inc Emp 16', 'emp16@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(44, 'Global Logistics Inc Emp 17', 'emp17@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(45, 'Global Logistics Inc Emp 18', 'emp18@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(46, 'Global Logistics Inc Emp 19', 'emp19@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(47, 'Global Logistics Inc Emp 20', 'emp20@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(48, 'Global Logistics Inc Emp 21', 'emp21@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(49, 'Global Logistics Inc Emp 22', 'emp22@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(50, 'Global Logistics Inc Emp 23', 'emp23@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(51, 'Global Logistics Inc Emp 24', 'emp24@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(52, 'Global Logistics Inc Emp 25', 'emp25@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(53, 'Global Logistics Inc Emp 26', 'emp26@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(54, 'Global Logistics Inc Emp 27', 'emp27@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(55, 'Global Logistics Inc Emp 28', 'emp28@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(56, 'Global Logistics Inc Emp 29', 'emp29@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(57, 'Global Logistics Inc Emp 30', 'emp30@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(58, 'Global Logistics Inc Emp 31', 'emp31@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(59, 'Global Logistics Inc Emp 32', 'emp32@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(60, 'Global Logistics Inc Emp 33', 'emp33@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(61, 'Global Logistics Inc Emp 34', 'emp34@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(62, 'Global Logistics Inc Emp 35', 'emp35@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(63, 'Global Logistics Inc Emp 36', 'emp36@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(64, 'Global Logistics Inc Emp 37', 'emp37@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(65, 'Global Logistics Inc Emp 38', 'emp38@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(66, 'Global Logistics Inc Emp 39', 'emp39@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(67, 'Global Logistics Inc Emp 40', 'emp40@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(68, 'Global Logistics Inc Emp 41', 'emp41@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(69, 'Global Logistics Inc Emp 42', 'emp42@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(70, 'Global Logistics Inc Emp 43', 'emp43@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(71, 'Global Logistics Inc Emp 44', 'emp44@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(72, 'Global Logistics Inc Emp 45', 'emp45@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(73, 'Global Logistics Inc Emp 46', 'emp46@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(74, 'Global Logistics Inc Emp 47', 'emp47@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(75, 'Global Logistics Inc Emp 48', 'emp48@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(76, 'Global Logistics Inc Emp 49', 'emp49@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(77, 'Global Logistics Inc Emp 50', 'emp50@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(78, 'Global Logistics Inc Emp 51', 'emp51@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(79, 'Global Logistics Inc Emp 52', 'emp52@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(80, 'Global Logistics Inc Emp 53', 'emp53@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(81, 'Global Logistics Inc Emp 54', 'emp54@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(82, 'Global Logistics Inc Emp 55', 'emp55@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(83, 'Startup Hive Emp 1', 'emp1@startuphive.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 9),
(84, 'Startup Hive Emp 2', 'emp2@startuphive.com', NULL, 'password123', 'Employee', '2026-03-08 10:40:50', '2026-03-08 10:40:50', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 9),
(85, 'TechCorp Solutions Employee 1', 'emp1_1@techcorpsolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 1),
(86, 'Global Industries Employee 1', 'emp1_2@globalindustries.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 2),
(87, 'Swift Food Employee 1', 'emp1_3@swiftfood.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 3),
(88, 'Swift Food Employee 2', 'emp2_3@swiftfood.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 3),
(89, 'Swift Food Employee 3', 'emp3_3@swiftfood.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 3),
(90, 'Swift Food Employee 4', 'emp4_3@swiftfood.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 3),
(91, 'Swift Food Employee 5', 'emp5_3@swiftfood.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 3),
(92, 'Swift Food Employee 6', 'emp6_3@swiftfood.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 3),
(93, 'Swift Food Employee 7', 'emp7_3@swiftfood.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 3),
(94, 'Swift Food Employee 8', 'emp8_3@swiftfood.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 3),
(95, 'Swift Food Employee 9', 'emp9_3@swiftfood.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 3),
(96, 'Limit Test Corp Employee 1', 'emp1_4@limittestcorp.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 4),
(97, 'Limit Test Corp Employee 2', 'emp2_4@limittestcorp.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 4),
(98, 'TechFlow Solutions Employee 1', 'emp1_6@techflowsolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 6),
(99, 'TechFlow Solutions Employee 2', 'emp2_6@techflowsolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 6),
(100, 'TechFlow Solutions Employee 3', 'emp3_6@techflowsolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 6),
(101, 'TechFlow Solutions Employee 4', 'emp4_6@techflowsolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 6),
(102, 'TechFlow Solutions Employee 5', 'emp5_6@techflowsolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 6),
(103, 'TechFlow Solutions Employee 6', 'emp6_6@techflowsolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 6),
(104, 'TechFlow Solutions Employee 7', 'emp7_6@techflowsolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 6),
(105, 'TechFlow Solutions Employee 8', 'emp8_6@techflowsolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 6),
(106, 'TechFlow Solutions Employee 9', 'emp9_6@techflowsolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 6),
(107, 'TechFlow Solutions Employee 10', 'emp10_6@techflowsolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 6),
(108, 'TechFlow Solutions Employee 11', 'emp11_6@techflowsolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 6),
(109, 'TechFlow Solutions Employee 12', 'emp12_6@techflowsolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 6),
(110, 'TechFlow Solutions Employee 13', 'emp13_6@techflowsolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 6),
(111, 'TechFlow Solutions Employee 14', 'emp14_6@techflowsolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 6),
(112, 'TechFlow Solutions Employee 15', 'emp15_6@techflowsolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 6),
(113, 'TechFlow Solutions Employee 16', 'emp16_6@techflowsolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 6),
(114, 'TechFlow Solutions Employee 17', 'emp17_6@techflowsolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 6),
(115, 'TechFlow Solutions Employee 18', 'emp18_6@techflowsolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 6),
(116, 'TechFlow Solutions Employee 19', 'emp19_6@techflowsolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 6),
(117, 'Green Horizon Ltd Employee 1', 'emp1_7@greenhorizonltd.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 7),
(118, 'Green Horizon Ltd Employee 2', 'emp2_7@greenhorizonltd.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 7),
(119, 'Green Horizon Ltd Employee 3', 'emp3_7@greenhorizonltd.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 7),
(120, 'Green Horizon Ltd Employee 4', 'emp4_7@greenhorizonltd.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 7),
(121, 'Green Horizon Ltd Employee 5', 'emp5_7@greenhorizonltd.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 7),
(122, 'Green Horizon Ltd Employee 6', 'emp6_7@greenhorizonltd.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 7),
(123, 'Green Horizon Ltd Employee 7', 'emp7_7@greenhorizonltd.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 7),
(124, 'Green Horizon Ltd Employee 8', 'emp8_7@greenhorizonltd.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 7),
(125, 'Green Horizon Ltd Employee 9', 'emp9_7@greenhorizonltd.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 7),
(126, 'Green Horizon Ltd Employee 10', 'emp10_7@greenhorizonltd.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 7),
(127, 'Green Horizon Ltd Employee 11', 'emp11_7@greenhorizonltd.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 7),
(128, 'Green Horizon Ltd Employee 12', 'emp12_7@greenhorizonltd.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 7),
(129, 'Green Horizon Ltd Employee 13', 'emp13_7@greenhorizonltd.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 7),
(130, 'Green Horizon Ltd Employee 14', 'emp14_7@greenhorizonltd.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 7),
(131, 'Global Logistics Inc Employee 1', 'emp1_8@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(132, 'Global Logistics Inc Employee 2', 'emp2_8@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(133, 'Global Logistics Inc Employee 3', 'emp3_8@globallogisticsinc.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 8),
(134, 'Startup Hive Employee 1', 'emp1_9@startuphive.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 9),
(135, 'Startup Hive Employee 2', 'emp2_9@startuphive.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 9),
(136, 'Startup Hive Employee 3', 'emp3_9@startuphive.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 9),
(137, 'Startup Hive Employee 4', 'emp4_9@startuphive.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 9),
(138, 'Startup Hive Employee 5', 'emp5_9@startuphive.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 9),
(139, 'Startup Hive Employee 6', 'emp6_9@startuphive.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 9),
(140, 'Startup Hive Employee 7', 'emp7_9@startuphive.com', NULL, 'password123', 'Employee', '2026-03-08 10:42:36', '2026-03-08 10:42:36', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 9),
(141, 'Skyline Architects Crew 1', 'crew1_10@skylinearchitects.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 10),
(142, 'Skyline Architects Crew 2', 'crew2_10@skylinearchitects.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 10),
(143, 'Skyline Architects Crew 3', 'crew3_10@skylinearchitects.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 10),
(144, 'Skyline Architects Crew 4', 'crew4_10@skylinearchitects.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 10),
(145, 'Skyline Architects Crew 5', 'crew5_10@skylinearchitects.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 10),
(146, 'Skyline Architects Crew 6', 'crew6_10@skylinearchitects.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 10),
(147, 'Skyline Architects Crew 7', 'crew7_10@skylinearchitects.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 10),
(148, 'Skyline Architects Crew 8', 'crew8_10@skylinearchitects.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 10),
(149, 'Skyline Architects Crew 9', 'crew9_10@skylinearchitects.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 10),
(150, 'Skyline Architects Crew 10', 'crew10_10@skylinearchitects.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 10),
(151, 'Skyline Architects Crew 11', 'crew11_10@skylinearchitects.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 10),
(152, 'Skyline Architects Crew 12', 'crew12_10@skylinearchitects.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 10),
(153, 'Pure Water Solutions Crew 1', 'crew1_11@purewatersolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 11),
(154, 'Pure Water Solutions Crew 2', 'crew2_11@purewatersolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 11),
(155, 'Pure Water Solutions Crew 3', 'crew3_11@purewatersolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 11),
(156, 'Pure Water Solutions Crew 4', 'crew4_11@purewatersolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 11),
(157, 'Pure Water Solutions Crew 5', 'crew5_11@purewatersolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 11),
(158, 'Pure Water Solutions Crew 6', 'crew6_11@purewatersolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 11),
(159, 'Pure Water Solutions Crew 7', 'crew7_11@purewatersolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 11),
(160, 'Pure Water Solutions Crew 8', 'crew8_11@purewatersolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 11),
(161, 'Pure Water Solutions Crew 9', 'crew9_11@purewatersolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 11),
(162, 'Pure Water Solutions Crew 10', 'crew10_11@purewatersolutions.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 11),
(163, 'NextGen Robotics Crew 1', 'crew1_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(164, 'NextGen Robotics Crew 2', 'crew2_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(165, 'NextGen Robotics Crew 3', 'crew3_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(166, 'NextGen Robotics Crew 4', 'crew4_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(167, 'NextGen Robotics Crew 5', 'crew5_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(168, 'NextGen Robotics Crew 6', 'crew6_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(169, 'NextGen Robotics Crew 7', 'crew7_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(170, 'NextGen Robotics Crew 8', 'crew8_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(171, 'NextGen Robotics Crew 9', 'crew9_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(172, 'NextGen Robotics Crew 10', 'crew10_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(173, 'NextGen Robotics Crew 11', 'crew11_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(174, 'NextGen Robotics Crew 12', 'crew12_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(175, 'NextGen Robotics Crew 13', 'crew13_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(176, 'NextGen Robotics Crew 14', 'crew14_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(177, 'NextGen Robotics Crew 15', 'crew15_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(178, 'NextGen Robotics Crew 16', 'crew16_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(179, 'NextGen Robotics Crew 17', 'crew17_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(180, 'NextGen Robotics Crew 18', 'crew18_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(181, 'NextGen Robotics Crew 19', 'crew19_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(182, 'NextGen Robotics Crew 20', 'crew20_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(183, 'NextGen Robotics Crew 21', 'crew21_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(184, 'NextGen Robotics Crew 22', 'crew22_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(185, 'NextGen Robotics Crew 23', 'crew23_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(186, 'NextGen Robotics Crew 24', 'crew24_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(187, 'NextGen Robotics Crew 25', 'crew25_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(188, 'NextGen Robotics Crew 26', 'crew26_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(189, 'NextGen Robotics Crew 27', 'crew27_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(190, 'NextGen Robotics Crew 28', 'crew28_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(191, 'NextGen Robotics Crew 29', 'crew29_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(192, 'NextGen Robotics Crew 30', 'crew30_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(193, 'NextGen Robotics Crew 31', 'crew31_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(194, 'NextGen Robotics Crew 32', 'crew32_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(195, 'NextGen Robotics Crew 33', 'crew33_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(196, 'NextGen Robotics Crew 34', 'crew34_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(197, 'NextGen Robotics Crew 35', 'crew35_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(198, 'NextGen Robotics Crew 36', 'crew36_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(199, 'NextGen Robotics Crew 37', 'crew37_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(200, 'NextGen Robotics Crew 38', 'crew38_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(201, 'NextGen Robotics Crew 39', 'crew39_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(202, 'NextGen Robotics Crew 40', 'crew40_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(203, 'NextGen Robotics Crew 41', 'crew41_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(204, 'NextGen Robotics Crew 42', 'crew42_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(205, 'NextGen Robotics Crew 43', 'crew43_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(206, 'NextGen Robotics Crew 44', 'crew44_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(207, 'NextGen Robotics Crew 45', 'crew45_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(208, 'NextGen Robotics Crew 46', 'crew46_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(209, 'NextGen Robotics Crew 47', 'crew47_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(210, 'NextGen Robotics Crew 48', 'crew48_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(211, 'NextGen Robotics Crew 49', 'crew49_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(212, 'NextGen Robotics Crew 50', 'crew50_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(213, 'NextGen Robotics Crew 51', 'crew51_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(214, 'NextGen Robotics Crew 52', 'crew52_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(215, 'NextGen Robotics Crew 53', 'crew53_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(216, 'NextGen Robotics Crew 54', 'crew54_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(217, 'NextGen Robotics Crew 55', 'crew55_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(218, 'NextGen Robotics Crew 56', 'crew56_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(219, 'NextGen Robotics Crew 57', 'crew57_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(220, 'NextGen Robotics Crew 58', 'crew58_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(221, 'NextGen Robotics Crew 59', 'crew59_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(222, 'NextGen Robotics Crew 60', 'crew60_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(223, 'NextGen Robotics Crew 61', 'crew61_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(224, 'NextGen Robotics Crew 62', 'crew62_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(225, 'NextGen Robotics Crew 63', 'crew63_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(226, 'NextGen Robotics Crew 64', 'crew64_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(227, 'NextGen Robotics Crew 65', 'crew65_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(228, 'NextGen Robotics Crew 66', 'crew66_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(229, 'NextGen Robotics Crew 67', 'crew67_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(230, 'NextGen Robotics Crew 68', 'crew68_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(231, 'NextGen Robotics Crew 69', 'crew69_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(232, 'NextGen Robotics Crew 70', 'crew70_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(233, 'NextGen Robotics Crew 71', 'crew71_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(234, 'NextGen Robotics Crew 72', 'crew72_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(235, 'NextGen Robotics Crew 73', 'crew73_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(236, 'NextGen Robotics Crew 74', 'crew74_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(237, 'NextGen Robotics Crew 75', 'crew75_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(238, 'NextGen Robotics Crew 76', 'crew76_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(239, 'NextGen Robotics Crew 77', 'crew77_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(240, 'NextGen Robotics Crew 78', 'crew78_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(241, 'NextGen Robotics Crew 79', 'crew79_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(242, 'NextGen Robotics Crew 80', 'crew80_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(243, 'NextGen Robotics Crew 81', 'crew81_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(244, 'NextGen Robotics Crew 82', 'crew82_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(245, 'NextGen Robotics Crew 83', 'crew83_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(246, 'NextGen Robotics Crew 84', 'crew84_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12);
INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role`, `created_at`, `updated_at`, `phone`, `countries`, `timezone`, `last_login`, `created_by`, `updated_by`, `fcm_notifications`, `language`, `is_developer`, `company_id`) VALUES
(247, 'NextGen Robotics Crew 85', 'crew85_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(248, 'NextGen Robotics Crew 86', 'crew86_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(249, 'NextGen Robotics Crew 87', 'crew87_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(250, 'NextGen Robotics Crew 88', 'crew88_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(251, 'NextGen Robotics Crew 89', 'crew89_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(252, 'NextGen Robotics Crew 90', 'crew90_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(253, 'NextGen Robotics Crew 91', 'crew91_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(254, 'NextGen Robotics Crew 92', 'crew92_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(255, 'NextGen Robotics Crew 93', 'crew93_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(256, 'NextGen Robotics Crew 94', 'crew94_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(257, 'NextGen Robotics Crew 95', 'crew95_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(258, 'NextGen Robotics Crew 96', 'crew96_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(259, 'NextGen Robotics Crew 97', 'crew97_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(260, 'NextGen Robotics Crew 98', 'crew98_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(261, 'NextGen Robotics Crew 99', 'crew99_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(262, 'NextGen Robotics Crew 100', 'crew100_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(263, 'NextGen Robotics Crew 101', 'crew101_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(264, 'NextGen Robotics Crew 102', 'crew102_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(265, 'NextGen Robotics Crew 103', 'crew103_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(266, 'NextGen Robotics Crew 104', 'crew104_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(267, 'NextGen Robotics Crew 105', 'crew105_12@nextgenrobotics.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 12),
(268, 'Elite Marketing Crew 1', 'crew1_13@elitemarketing.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 13),
(269, 'Elite Marketing Crew 2', 'crew2_13@elitemarketing.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 13),
(270, 'Elite Marketing Crew 3', 'crew3_13@elitemarketing.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 13),
(271, 'Elite Marketing Crew 4', 'crew4_13@elitemarketing.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 13),
(272, 'Elite Marketing Crew 5', 'crew5_13@elitemarketing.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 13),
(273, 'Elite Marketing Crew 6', 'crew6_13@elitemarketing.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 13),
(274, 'Elite Marketing Crew 7', 'crew7_13@elitemarketing.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 13),
(275, 'Elite Marketing Crew 8', 'crew8_13@elitemarketing.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 13),
(276, 'Elite Marketing Crew 9', 'crew9_13@elitemarketing.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 13),
(277, 'Elite Marketing Crew 10', 'crew10_13@elitemarketing.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 13),
(278, 'Elite Marketing Crew 11', 'crew11_13@elitemarketing.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 13),
(279, 'Elite Marketing Crew 12', 'crew12_13@elitemarketing.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 13),
(280, 'Elite Marketing Crew 13', 'crew13_13@elitemarketing.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 13),
(281, 'Elite Marketing Crew 14', 'crew14_13@elitemarketing.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 13),
(282, 'Elite Marketing Crew 15', 'crew15_13@elitemarketing.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 13),
(283, 'Elite Marketing Crew 16', 'crew16_13@elitemarketing.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 13),
(284, 'Elite Marketing Crew 17', 'crew17_13@elitemarketing.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 13),
(285, 'Elite Marketing Crew 18', 'crew18_13@elitemarketing.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 13),
(286, 'Local Grocers Crew 1', 'crew1_14@localgrocers.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 14),
(287, 'Local Grocers Crew 2', 'crew2_14@localgrocers.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 14),
(288, 'Local Grocers Crew 3', 'crew3_14@localgrocers.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 14),
(289, 'Local Grocers Crew 4', 'crew4_14@localgrocers.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 14),
(290, 'Local Grocers Crew 5', 'crew5_14@localgrocers.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 14),
(291, 'Local Grocers Crew 6', 'crew6_14@localgrocers.com', NULL, 'password123', 'Employee', '2026-03-08 10:50:25', '2026-03-08 10:50:25', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 14),
(292, 'Tech Admin', 'tech_admin@active.com', NULL, '$2b$12$YwCfnltnuQMmGx9UdgezvuhhQrXEES3m16.rO3zcb/.jhmNh0/0lW', 'Company Admin', '2026-03-08 11:17:01', '2026-03-08 11:17:01', NULL, NULL, NULL, NULL, NULL, NULL, 0, 'English', 0, 49);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `app_usages`
--
ALTER TABLE `app_usages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `company_code` (`company_code`),
  ADD UNIQUE KEY `company_code_2` (`company_code`),
  ADD UNIQUE KEY `company_code_3` (`company_code`),
  ADD UNIQUE KEY `company_code_4` (`company_code`),
  ADD UNIQUE KEY `company_code_5` (`company_code`),
  ADD UNIQUE KEY `company_code_6` (`company_code`),
  ADD UNIQUE KEY `company_code_7` (`company_code`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `company_plans`
--
ALTER TABLE `company_plans`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `escalation_histories`
--
ALTER TABLE `escalation_histories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `feedback_id` (`feedback_id`),
  ADD KEY `escalated_by` (`escalated_by`),
  ADD KEY `escalated_to` (`escalated_to`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `feedback_id` (`feedback_id`),
  ADD KEY `assigned_to` (`assigned_to`),
  ADD KEY `company_id` (`company_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `leads`
--
ALTER TABLE `leads`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `page_clicks`
--
ALTER TABLE `page_clicks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `recent_activities`
--
ALTER TABLE `recent_activities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_unique` (`name`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ticket_histories`
--
ALTER TABLE `ticket_histories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ticket_id` (`ticket_id`),
  ADD KEY `updated_by` (`updated_by`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `app_usages`
--
ALTER TABLE `app_usages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `companies`
--
ALTER TABLE `companies`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `company_plans`
--
ALTER TABLE `company_plans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `escalation_histories`
--
ALTER TABLE `escalation_histories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `leads`
--
ALTER TABLE `leads`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `page_clicks`
--
ALTER TABLE `page_clicks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `recent_activities`
--
ALTER TABLE `recent_activities`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `ticket_histories`
--
ALTER TABLE `ticket_histories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=293;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_ibfk_3` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`),
  ADD CONSTRAINT `activity_logs_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `escalation_histories`
--
ALTER TABLE `escalation_histories`
  ADD CONSTRAINT `escalation_histories_ibfk_1` FOREIGN KEY (`feedback_id`) REFERENCES `feedbacks` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `escalation_histories_ibfk_2` FOREIGN KEY (`escalated_by`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `escalation_histories_ibfk_3` FOREIGN KEY (`escalated_to`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD CONSTRAINT `feedbacks_ibfk_1` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `feedbacks_ibfk_2` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `ticket_histories`
--
ALTER TABLE `ticket_histories`
  ADD CONSTRAINT `ticket_histories_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `ticket_histories_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
