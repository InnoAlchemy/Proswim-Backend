-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 30, 2024 at 09:55 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `proswim`
--

-- --------------------------------------------------------

--
-- Table structure for table `about_us_categories`
--

CREATE TABLE `about_us_categories` (
  `id` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `markdown_text` text NOT NULL,
  `header_image` varchar(500) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `about_us_information`
--

CREATE TABLE `about_us_information` (
  `id` varchar(255) NOT NULL,
  `category_id` varchar(255) NOT NULL,
  `markdown_text` text NOT NULL,
  `image` varchar(500) DEFAULT NULL,
  `type` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `albums`
--

CREATE TABLE `albums` (
  `id` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `album_files`
--

CREATE TABLE `album_files` (
  `id` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `album_id` varchar(255) NOT NULL,
  `collection_number` int(11) NOT NULL,
  `file` varchar(255) NOT NULL,
  `short_description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `banners`
--

CREATE TABLE `banners` (
  `id` varchar(15) NOT NULL,
  `image` varchar(255) NOT NULL,
  `title` varchar(30) NOT NULL,
  `is_active` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

CREATE TABLE `classes` (
  `id` int(11) NOT NULL,
  `class_category_id` int(11) NOT NULL,
  `markdown_text` text NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `button_text` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `class_categories`
--

CREATE TABLE `class_categories` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `header_image` varchar(500) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `core_values`
--

CREATE TABLE `core_values` (
  `id` varchar(15) NOT NULL,
  `image` varchar(255) NOT NULL,
  `title` varchar(30) NOT NULL,
  `description` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `supervisor` varchar(30) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `website` varchar(255) NOT NULL,
  `info` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lts_buttons`
--

CREATE TABLE `lts_buttons` (
  `id` varchar(15) NOT NULL,
  `image` varchar(255) NOT NULL,
  `page_link` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `otps`
--

CREATE TABLE `otps` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `otp` varchar(6) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `swim_levels`
--

CREATE TABLE `swim_levels` (
  `id` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `markdown_text` text NOT NULL,
  `header_image` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `swim_sections`
--

CREATE TABLE `swim_sections` (
  `level_id` varchar(255) NOT NULL,
  `category_id` varchar(255) NOT NULL,
  `markdown_text` text NOT NULL,
  `header_image` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `swim_section_categories`
--

CREATE TABLE `swim_section_categories` (
  `id` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(15) NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `is_verified` tinyint(1) NOT NULL,
  `role` varchar(6) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `about_us_categories`
--
ALTER TABLE `about_us_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `about_us_information`
--
ALTER TABLE `about_us_information`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `albums`
--
ALTER TABLE `albums`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `album_files`
--
ALTER TABLE `album_files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_album` (`album_id`);

--
-- Indexes for table `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `class_category_id` (`class_category_id`);

--
-- Indexes for table `class_categories`
--
ALTER TABLE `class_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `core_values`
--
ALTER TABLE `core_values`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lts_buttons`
--
ALTER TABLE `lts_buttons`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `otps`
--
ALTER TABLE `otps`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `swim_levels`
--
ALTER TABLE `swim_levels`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `swim_sections`
--
ALTER TABLE `swim_sections`
  ADD PRIMARY KEY (`level_id`,`category_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `swim_section_categories`
--
ALTER TABLE `swim_section_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `classes`
--
ALTER TABLE `classes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `class_categories`
--
ALTER TABLE `class_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `otps`
--
ALTER TABLE `otps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `about_us_information`
--
ALTER TABLE `about_us_information`
  ADD CONSTRAINT `about_us_information_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `about_us_categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `album_files`
--
ALTER TABLE `album_files`
  ADD CONSTRAINT `fk_album` FOREIGN KEY (`album_id`) REFERENCES `albums` (`id`);

--
-- Constraints for table `classes`
--
ALTER TABLE `classes`
  ADD CONSTRAINT `classes_ibfk_1` FOREIGN KEY (`class_category_id`) REFERENCES `class_categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `swim_sections`
--
ALTER TABLE `swim_sections`
  ADD CONSTRAINT `swim_sections_ibfk_1` FOREIGN KEY (`level_id`) REFERENCES `swim_levels` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `swim_sections_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `swim_section_categories` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
