-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 12 Agu 2025 pada 05.14
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

START TRANSACTION;

SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */
;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */
;
/*!40101 SET NAMES utf8mb4 */
;

--
-- Database: `butyl`
--
CREATE DATABASE IF NOT EXISTS `butyl` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE `butyl`;

-- --------------------------------------------------------

--
-- Struktur dari tabel `inspection_logic`
--

DROP TABLE IF EXISTS `inspection_logic`;

CREATE TABLE `inspection_logic` (
    `id` int(11) NOT NULL,
    `description` varchar(255) NOT NULL,
    `label` varchar(255) NOT NULL,
    `inputType` varchar(255) NOT NULL DEFAULT 'text'
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

--
-- Dumping data untuk tabel `inspection_logic`
--

INSERT INTO
    `inspection_logic` (
        `id`,
        `description`,
        `label`,
        `inputType`
    )
VALUES (
        1,
        'Options that provide OK/NG buttons for determining the inspection result.',
        'OK/NG Option',
        'buttonToggle'
    ),
    (
        2,
        'Uses a range standard to determine if the input value falls within the specified minimum and maximum limits.',
        'Number Range',
        'number'
    ),
    (
        3,
        'Determines the result by checking if the input value is greater than the defined minimum standard.',
        'Larger Than (>)',
        'number'
    ),
    (
        4,
        'Compares the input value against a maximum threshold, and passes only if the value is below the defined limit.',
        'Less Than (<)',
        'number'
    ),
    (
        5,
        'Compares the input value to a defined target with upper and lower tolerance limits. The result is OK if the input falls within the range of (target - lower) to (target + upper).',
        'Upper and Lower Limit (xxx, +x, -x)',
        'number'
    ),
    (
        6,
        'Compares the input value against a minimum threshold. The result is OK if the input is greater than or equal to the specified value.',
        '≥ target',
        'number'
    ),
    (
        7,
        'Compares the input value against a maximum threshold. The result is OK if the input is less than or equal to the specified value.',
        '≤ target',
        'number'
    ),
    (
        8,
        'Performs a case-insensitive comparison between the input text and the defined standard. The result is OK if the strings match regardless of letter casing.',
        'Match Text',
        'text'
    ),
    (
        9,
        'Performs a strict comparison between the input number and the expected value. The result is OK only if both values are numerically identical.',
        'Match Number',
        'number'
    ),
    (
        10,
        'Checks if the input value is not equal to the specified value.',
        'Not Equal',
        'text'
    ),
    (
        16,
        'Options that provide OK/NG buttons for determining the inspection result, but with custom standard text.',
        'Custom OK/NG',
        'buttonToggle'
    ),
    (
        17,
        'Compares the input value to a defined target with ± tolerance limits. The result is OK if the input falls within the range of (target - lower) to (target + upper).',
        'Target ± Tolerance',
        'number'
    );

-- --------------------------------------------------------

--
-- Struktur dari tabel `t_insitem`
--

DROP TABLE IF EXISTS `t_insitem`;

CREATE TABLE `t_insitem` (
    `id` int(11) NOT NULL,
    `inspectionLable` varchar(255) NOT NULL,
    `logic` int(11) NOT NULL,
    `method` int(11) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

--
-- Dumping data untuk tabel `t_insitem`
--

INSERT INTO
    `t_insitem` (
        `id`,
        `inspectionLable`,
        `logic`,
        `method`
    )
VALUES (3, 'Specific Gravity', 17, 1),
    (4, 'Penetration  ', 2, 2),
    (5, 'Elongation', 8, 3),
    (6, 'Shape', 16, 7),
    (7, 'Thickness', 5, 4),
    (8, 'Width', 17, 5),
    (9, 'Length', 17, 6),
    (10, 'Appearance', 16, 7),
    (11, 'Peel Strength', 1, 16),
    (12, 'Weight / Sheet', 2, 12),
    (13, 'Dispersibility', 16, 7),
    (
        14,
        'Adhesive surface ',
        16,
        7
    ),
    (
        15,
        'High-temperature Properties',
        1,
        13
    ),
    (16, 'Ball-tac', 1, 14),
    (
        17,
        'Adhesion T-Form Peeling',
        1,
        17
    ),
    (
        18,
        'Adhesive surface 1',
        16,
        15
    ),
    (
        19,
        'Adhesive surface 2 ',
        16,
        7
    ),
    (20, 'warna', 16, 7),
    (21, 'Penetration', 17, 2),
    (
        22,
        'High-temperature Properties',
        7,
        13
    );

-- --------------------------------------------------------

--
-- Struktur dari tabel `t_inspection`
--

DROP TABLE IF EXISTS `t_inspection`;

CREATE TABLE `t_inspection` (
    `insId` int(11) NOT NULL,
    `insData` longtext NOT NULL,
    `headerData` longtext NOT NULL,
    `judgement` tinyint(1) DEFAULT NULL,
    `partNumber` varchar(255) NOT NULL,
    `inspectionStep` text NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `t_method`
--

DROP TABLE IF EXISTS `t_method`;

CREATE TABLE `t_method` (
    `id` int(11) NOT NULL,
    `romaji` varchar(255) NOT NULL,
    `japanese` varchar(255) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

--
-- Dumping data untuk tabel `t_method`
--

INSERT INTO
    `t_method` (`id`, `romaji`, `japanese`)
VALUES (
        1,
        'Digital Scale/SG Bottle',
        '電子天秤/比重瓶'
    ),
    (
        2,
        'Peneration Test Tool',
        '針入度計'
    ),
    (
        3,
        'Elongation Test Tool',
        '伸長度計'
    ),
    (
        4,
        'Thickness Gauge',
        'シックネスゲージ'
    ),
    (5, 'CONVEX', 'コンベックス'),
    (6, 'Roller Meter Counter', ''),
    (7, 'Visual check', '目視'),
    (10, 'Convex/Ruler', ' 凸型/定規'),
    (
        12,
        'Digital Scale',
        'デジタルスケール'
    ),
    (
        13,
        'Thermostatic Chamber',
        ' 恒温槽'
    ),
    (
        14,
        'Ball-tac Test Tool',
        'ボールタックテストツール'
    ),
    (
        15,
        'Contact Check with Cotton',
        'コットンで接触確認'
    ),
    (
        16,
        'Peel Strength Test Tool',
        ''
    ),
    (
        17,
        'Tensile Strength  Test Tool',
        ''
    );

-- --------------------------------------------------------

--
-- Struktur dari tabel `t_part`
--

DROP TABLE IF EXISTS `t_part`;

CREATE TABLE `t_part` (
    `partId` int(11) NOT NULL,
    `customer` tinytext NOT NULL,
    `partType` int(11) NOT NULL,
    `partName` tinytext NOT NULL,
    `partNumber` tinytext NOT NULL,
    `thickness` decimal(10, 3) NOT NULL,
    `width` decimal(10, 3) NOT NULL,
    `length` decimal(10, 3) NOT NULL,
    `sg` decimal(10, 3) NOT NULL,
    `headers` text NOT NULL,
    `kneadingType` tinytext NOT NULL,
    `kneadingItems` longtext NOT NULL,
    `heaterCheck` tinyint(1) NOT NULL,
    `extrudingType` tinytext NOT NULL,
    `extrudingItems` longtext NOT NULL,
    `pressOn` tinyint(1) NOT NULL,
    `pressItems` longtext DEFAULT NULL,
    `outgoingOn` tinyint(1) NOT NULL,
    `outgoingItems` longtext DEFAULT NULL,
    `extAppStd` longtext NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `t_role`
--

DROP TABLE IF EXISTS `t_role`;

CREATE TABLE `t_role` (
    `roleId` int(11) NOT NULL,
    `roleName` varchar(255) NOT NULL,
    `homePage` varchar(255) NOT NULL,
    `akses` longtext NOT NULL,
    `inspectionAccess` longtext NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

--
-- Dumping data untuk tabel `t_role`
--

INSERT INTO
    `t_role` (
        `roleId`,
        `roleName`,
        `homePage`,
        `akses`,
        `inspectionAccess`
    )
VALUES (
        1,
        'IT Developer',
        '/dashboard/newinspection',
        '[\"/setup/accounts\",\"/setup/role\",\"/setup/parts\",\"/dashboard/newinspection\",\"/setup/inspectionlogic\",\"/setup/methods\",\"/dashboard/nginspection\",\"/dashboard/finishinspection\",\"/dashboard/approval\",\"/setup/type\",\"/setup/inspectionitem\"]',
        '[\"extruding\",\"press\",\"outgoing\",\"kneading\"]'
    ),
    (
        10,
        'Administrator',
        '/dashboard/newinspection',
        '[\"/setup/role\",\"/setup/accounts\",\"/dashboard/newinspection\",\"/setup/parts\",\"/setup/inspectionlogic\",\"/dashboard/nginspection\",\"/dashboard/finishinspection\",\"/dashboard/approval\",\"/setup/methods\",\"/setup/inspectionitem\",\"/setup/type\"]',
        '[\"kneading\",\"extruding\",\"press\",\"outgoing\"]'
    ),
    (
        14,
        'test',
        '/dashboard/newinspection',
        '[\"kneading\",\"/dashboard/newinspection\"]',
        ''
    );

-- --------------------------------------------------------

--
-- Struktur dari tabel `t_types`
--

DROP TABLE IF EXISTS `t_types`;

CREATE TABLE `t_types` (
    `id` int(11) NOT NULL,
    `typeNumber` varchar(255) NOT NULL,
    `kneadingType` tinytext NOT NULL,
    `extrudingType` tinytext NOT NULL,
    `headerType` tinytext NOT NULL,
    `pressOn` tinyint(1) NOT NULL,
    `outGoingOn` tinyint(1) NOT NULL,
    `heaterOn` tinyint(1) NOT NULL,
    `kneadingItems` longtext NOT NULL,
    `extrudingItems` longtext NOT NULL,
    `pressItems` longtext NOT NULL,
    `outgoingItems` longtext NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

--
-- Dumping data untuk tabel `t_types`
--

INSERT INTO
    `t_types` (
        `id`,
        `typeNumber`,
        `kneadingType`,
        `extrudingType`,
        `headerType`,
        `pressOn`,
        `outGoingOn`,
        `heaterOn`,
        `kneadingItems`,
        `extrudingItems`,
        `pressItems`,
        `outgoingItems`
    )
VALUES (
        1,
        'Butyl Roll Type 2 (HN-15)',
        'a',
        'a',
        'a',
        0,
        0,
        0,
        '[3,4,5]',
        '[6,7,8,9,10]',
        '[]',
        '[]'
    ),
    (
        2,
        'Butyl Roll Type 1 (HN-15)',
        'b',
        'a',
        'a',
        0,
        0,
        0,
        '[3,4,5]',
        '[6,7,8,9,10]',
        '[]',
        '[]'
    ),
    (
        3,
        'SP-27D',
        'a',
        'b',
        'a',
        1,
        1,
        0,
        '[3,4,5,11]',
        '[6,7,8,9,10,12,13]',
        '[8,9]',
        '[14]'
    ),
    (
        4,
        'SP-15',
        'a',
        'b',
        'a',
        1,
        1,
        0,
        '[3,4,15,16]',
        '[6,7,8,9,10,12,13]',
        '[8,9]',
        '[14]'
    ),
    (
        5,
        'SP-21',
        'a',
        'b',
        'a',
        1,
        1,
        0,
        '[3,4,17,13]',
        '[6,7,8,9,10,12,13]',
        '[8,9]',
        '[14]'
    ),
    (
        6,
        'TH-15',
        'a',
        'c',
        'b',
        1,
        1,
        0,
        '[3,4,15,16]',
        '[6,7,8,9,10,12,13]',
        '[8,9]',
        '[14]'
    ),
    (
        7,
        'TF-26S',
        'a',
        'b',
        'b',
        1,
        1,
        0,
        '[3,4,15,16]',
        '[6,7,8,9,10,12,13]',
        '[8,9]',
        '[14]'
    ),
    (
        8,
        'TF-15',
        'a',
        'b',
        'b',
        1,
        1,
        1,
        '[3,4,15,16]',
        '[6,7,8,9,10,12,13]',
        '[8,9]',
        '[14,4,15]'
    ),
    (
        9,
        'TF-26',
        'a',
        'b',
        'b',
        1,
        1,
        1,
        '[3,4,15,16]',
        '[6,7,8,9,10,12,13]',
        '[8,9]',
        '[18,19,4,15]'
    );

-- --------------------------------------------------------

--
-- Struktur dari tabel `t_user`
--

DROP TABLE IF EXISTS `t_user`;

CREATE TABLE `t_user` (
    `userNik` varchar(255) NOT NULL,
    `userPass` varchar(1024) NOT NULL,
    `userRole` int(11) NOT NULL,
    `userName` varchar(255) NOT NULL,
    `userId` int(11) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

--
-- Dumping data untuk tabel `t_user`
--

INSERT INTO
    `t_user` (
        `userNik`,
        `userPass`,
        `userRole`,
        `userName`,
        `userId`
    )
VALUES (
        'system',
        'U2FsdGVkX19e0Sbt0KSrqCFffZpslzLskXuowH8+8A8=',
        1,
        'Adnan Fauzi Ahmad',
        1
    ),
    (
        'admin',
        'U2FsdGVkX18UN0IiGrV8Ms2ZUdJbpHWTgHKUNv5GSbM=',
        10,
        'admin utama',
        8
    );

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `inspection_logic`
--
ALTER TABLE `inspection_logic` ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `t_insitem`
--
ALTER TABLE `t_insitem` ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `t_inspection`
--
ALTER TABLE `t_inspection` ADD PRIMARY KEY (`insId`);

--
-- Indeks untuk tabel `t_method`
--
ALTER TABLE `t_method` ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `t_part`
--
ALTER TABLE `t_part` ADD PRIMARY KEY (`partId`);

--
-- Indeks untuk tabel `t_role`
--
ALTER TABLE `t_role` ADD PRIMARY KEY (`roleId`);

--
-- Indeks untuk tabel `t_types`
--
ALTER TABLE `t_types` ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `t_user`
--
ALTER TABLE `t_user` ADD PRIMARY KEY (`userId`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `inspection_logic`
--
ALTER TABLE `inspection_logic`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 18;

--
-- AUTO_INCREMENT untuk tabel `t_insitem`
--
ALTER TABLE `t_insitem`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 23;

--
-- AUTO_INCREMENT untuk tabel `t_inspection`
--
ALTER TABLE `t_inspection`
MODIFY `insId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `t_method`
--
ALTER TABLE `t_method`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 18;

--
-- AUTO_INCREMENT untuk tabel `t_part`
--
ALTER TABLE `t_part`
MODIFY `partId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `t_role`
--
ALTER TABLE `t_role`
MODIFY `roleId` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 15;

--
-- AUTO_INCREMENT untuk tabel `t_types`
--
ALTER TABLE `t_types`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 10;

--
-- AUTO_INCREMENT untuk tabel `t_user`
--
ALTER TABLE `t_user`
MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 11;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;