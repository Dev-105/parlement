-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 07, 2026 at 11:46 AM
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
-- Database: `parlement`
--

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
-- Table structure for table `demandes`
--

CREATE TABLE `demandes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `type` enum('stage','presse','bibliotheque','visite') NOT NULL,
  `status` enum('pending','in_review','accepted','rejected') NOT NULL DEFAULT 'pending',
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `submitted_at` timestamp NULL DEFAULT NULL,
  `processed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `demandes`
--

INSERT INTO `demandes` (`id`, `user_id`, `type`, `status`, `title`, `message`, `submitted_at`, `processed_at`, `created_at`, `updated_at`) VALUES
(1, 2, 'stage', 'accepted', 'demande de stage', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid, neque. Assumenda quae recusandae facilis nam fugiat saepe quia accusantium ducimus.', '2026-05-07 08:08:03', '2026-05-07 08:09:03', '2026-05-07 08:08:03', '2026-05-07 08:09:03');

-- --------------------------------------------------------

--
-- Table structure for table `demande_bibliotheques`
--

CREATE TABLE `demande_bibliotheques` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `demande_id` bigint(20) UNSIGNED NOT NULL,
  `research_topic` varchar(255) NOT NULL,
  `institution` varchar(255) NOT NULL,
  `visit_date` date DEFAULT NULL,
  `duration` varchar(255) DEFAULT NULL,
  `purpose` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `demande_presses`
--

CREATE TABLE `demande_presses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `demande_id` bigint(20) UNSIGNED NOT NULL,
  `media_name` varchar(255) NOT NULL,
  `organization` varchar(255) NOT NULL,
  `supporting_document` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `demande_stages`
--

CREATE TABLE `demande_stages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `demande_id` bigint(20) UNSIGNED NOT NULL,
  `cv_file` varchar(255) DEFAULT NULL,
  `school_name` varchar(255) NOT NULL,
  `field_of_study` varchar(255) NOT NULL,
  `motivation_letter` text DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `demande_stages`
--

INSERT INTO `demande_stages` (`id`, `demande_id`, `cv_file`, `school_name`, `field_of_study`, `motivation_letter`, `start_date`, `end_date`, `created_at`, `updated_at`) VALUES
(1, 1, 'cvs/LzL23PuAI6gcijR9EEP6UuFxFN1z17L4y43M0uZ1.pdf', 'cmc', 'dev', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit iste nisi reprehenderit doloribus adipisci veniam, earum quod in iure error, obcaecati inventore veritatis enim eos. Distinctio eaque perspiciatis velit. Cum itaque eaque animi voluptate quod, facere possimus iure consectetur temporibus omnis enim earum a rem expedita facilis. Sequi, adipisci, illo ea rem harum reiciendis dicta temporibus quas laudantium illum quia reprehenderit quam dignissimos est. Sint vero culpa incidunt voluptate. Itaque culpa enim delectus iure, illum error amet quis velit atque?', '2026-06-01', '2026-07-01', '2026-05-07 08:08:04', '2026-05-07 08:08:04');

-- --------------------------------------------------------

--
-- Table structure for table `demande_visites`
--

CREATE TABLE `demande_visites` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `demande_id` bigint(20) UNSIGNED NOT NULL,
  `school_name` varchar(255) NOT NULL,
  `number_of_students` int(11) NOT NULL,
  `grade_level` varchar(255) NOT NULL,
  `visit_date` date DEFAULT NULL,
  `supervisor_name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(4, '2026_04_14_140548_create_personal_access_tokens_table', 1),
(5, '2026_04_14_150000_create_demandes_table', 1),
(6, '2026_04_14_150001_create_demande_stages_table', 1),
(7, '2026_04_14_150002_create_demande_presses_table', 1),
(8, '2026_04_14_150003_create_demande_bibliotheques_table', 1),
(9, '2026_04_14_150004_create_demande_visites_table', 1),
(10, '2026_04_14_223232_create_notifications_table', 1),
(11, '2026_04_15_000001_add_cin_to_users_table', 1),
(12, '2026_04_15_145148_drop_press_card_number_from_demande_presses_table', 1),
(13, '2026_04_15_151042_create_user_reviews_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` char(36) NOT NULL,
  `type` varchar(255) NOT NULL,
  `notifiable_type` varchar(255) NOT NULL,
  `notifiable_id` bigint(20) UNSIGNED NOT NULL,
  `data` text NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `type`, `notifiable_type`, `notifiable_id`, `data`, `read_at`, `created_at`, `updated_at`) VALUES
('1f612dfc-4df0-4273-80c1-32ed271a5b02', 'App\\Notifications\\AdminMessageNotification', 'App\\Models\\User', 2, '{\"title\":\"Mise \\u00e0 jour de votre demande - Accept\\u00e9e\",\"message\":\"F\\u00e9licitations! Votre demande a \\u00e9t\\u00e9 accept\\u00e9e.\",\"type\":\"admin_message\",\"sent_by\":1,\"sent_at\":\"2026-05-07T09:09:03.126446Z\"}', NULL, '2026-05-07 08:09:03', '2026-05-07 08:09:03'),
('9351e1c7-a424-4cac-b64d-c492e94332dd', 'App\\Notifications\\AdminMessageNotification', 'App\\Models\\User', 1, '{\"title\":\"Bienvenue sur Parlement\",\"message\":\"Bienvenue dans la plateforme Parlement ! Nous sommes ravis de vous compter parmi nous. Vous pouvez maintenant soumettre des demandes et suivre leur progression depuis votre espace personnel.\",\"type\":\"admin_message\",\"sent_by\":null,\"sent_at\":\"2026-05-07T08:59:23.474966Z\"}', NULL, '2026-05-07 07:59:23', '2026-05-07 07:59:23');

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
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(3, 'App\\Models\\User', 1, 'auth_token', '036ee0c86f057120075bebc472a6b772d4e361f579bbc112654627beea53fb0d', '[\"*\"]', '2026-05-07 08:45:50', NULL, '2026-05-07 08:08:54', '2026-05-07 08:45:50'),
(5, 'App\\Models\\User', 2, 'auth_token', 'ab31920b5099caba2dc901c99c421671df2da2cc4563d13b9d47e5d5b145cff0', '[\"*\"]', '2026-05-07 08:45:50', NULL, '2026-05-07 08:11:37', '2026-05-07 08:45:50');

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

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `cin` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `nationality` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `address_line` varchar(255) DEFAULT NULL,
  `postal_code` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `banner_image` varchar(255) DEFAULT NULL,
  `cv_file` varchar(255) DEFAULT NULL,
  `role` enum('stagiaire','journaliste','chercheur','ecole','admin') NOT NULL DEFAULT 'stagiaire',
  `status` enum('active','pending','suspended') NOT NULL DEFAULT 'pending',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `cin`, `email`, `password`, `phone`, `date_of_birth`, `nationality`, `country`, `city`, `address_line`, `postal_code`, `description`, `profile_image`, `banner_image`, `cv_file`, `role`, `status`, `email_verified_at`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin', 'ae000000', 'admin@gmail.com', '$2y$12$sQGf/K.gtnjZZm7ZwYSxyuSHMhxpWMdFRxcXz7/BX3mpEHI8qF3K6', '00000000', '2026-05-01', 'Moroccan', 'Morocco', 'rabat', 'rabat', NULL, NULL, NULL, NULL, NULL, 'admin', '', NULL, NULL, '2026-05-07 07:59:20', '2026-05-07 07:59:20'),
(2, 'hamza', 'alami', 'ae123456', 'hamzaalami@gmail.com', '$2y$12$sQGf/K.gtnjZZm7ZwYSxyuSHMhxpWMdFRxcXz7/BX3mpEHI8qF3K6', '0612345678', '2006-05-01', 'Moroccan', 'Morocco', 'rabat', 'agdal', '11000', NULL, NULL, NULL, NULL, 'stagiaire', 'pending', NULL, NULL, '2026-05-07 07:59:20', '2026-05-07 07:59:20');

-- --------------------------------------------------------

--
-- Table structure for table `user_reviews`
--

CREATE TABLE `user_reviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_reviews`
--

INSERT INTO `user_reviews` (`id`, `user_id`, `rating`, `comment`, `created_at`, `updated_at`) VALUES
(1, 2, 4, 'thanks for your services', '2026-05-07 08:08:32', '2026-05-07 08:08:32');

--
-- Indexes for dumped tables
--

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
-- Indexes for table `demandes`
--
ALTER TABLE `demandes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `demandes_user_id_foreign` (`user_id`);

--
-- Indexes for table `demande_bibliotheques`
--
ALTER TABLE `demande_bibliotheques`
  ADD PRIMARY KEY (`id`),
  ADD KEY `demande_bibliotheques_demande_id_foreign` (`demande_id`);

--
-- Indexes for table `demande_presses`
--
ALTER TABLE `demande_presses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `demande_presses_demande_id_foreign` (`demande_id`);

--
-- Indexes for table `demande_stages`
--
ALTER TABLE `demande_stages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `demande_stages_demande_id_foreign` (`demande_id`);

--
-- Indexes for table `demande_visites`
--
ALTER TABLE `demande_visites`
  ADD PRIMARY KEY (`id`),
  ADD KEY `demande_visites_demande_id_foreign` (`demande_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

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
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_notifiable_type_notifiable_id_index` (`notifiable_type`,`notifiable_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_cin_unique` (`cin`);

--
-- Indexes for table `user_reviews`
--
ALTER TABLE `user_reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_reviews_user_id_unique` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `demandes`
--
ALTER TABLE `demandes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `demande_bibliotheques`
--
ALTER TABLE `demande_bibliotheques`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `demande_presses`
--
ALTER TABLE `demande_presses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `demande_stages`
--
ALTER TABLE `demande_stages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `demande_visites`
--
ALTER TABLE `demande_visites`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_reviews`
--
ALTER TABLE `user_reviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `demandes`
--
ALTER TABLE `demandes`
  ADD CONSTRAINT `demandes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `demande_bibliotheques`
--
ALTER TABLE `demande_bibliotheques`
  ADD CONSTRAINT `demande_bibliotheques_demande_id_foreign` FOREIGN KEY (`demande_id`) REFERENCES `demandes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `demande_presses`
--
ALTER TABLE `demande_presses`
  ADD CONSTRAINT `demande_presses_demande_id_foreign` FOREIGN KEY (`demande_id`) REFERENCES `demandes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `demande_stages`
--
ALTER TABLE `demande_stages`
  ADD CONSTRAINT `demande_stages_demande_id_foreign` FOREIGN KEY (`demande_id`) REFERENCES `demandes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `demande_visites`
--
ALTER TABLE `demande_visites`
  ADD CONSTRAINT `demande_visites_demande_id_foreign` FOREIGN KEY (`demande_id`) REFERENCES `demandes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_reviews`
--
ALTER TABLE `user_reviews`
  ADD CONSTRAINT `user_reviews_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
