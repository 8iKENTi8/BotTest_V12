-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 18, 2022 at 10:17 AM
-- Server version: 5.7.24
-- PHP Version: 8.0.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bot_discrod`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_rec` (IN `usName` VARCHAR(70), IN `id_r` INT, IN `duration` FLOAT, IN `txt` TEXT)  NO SQL
BEGIN
DECLARE Spech TEXT;
SET usName = CONCAT(usName, " сказал: ");

SET Spech = (SELECT `records`.`speech` FROM `records` WHERE `records`.`id` =id_r);

SET Spech = CONCAT(Spech, " ",usName," ",txt,"
");

UPDATE `records` SET `records`.`speech` = Spech, `records`.`duration` = `records`.`duration` + duration
WHERE `records`.`id` = id_r;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `add_speach` (IN `id_u` VARCHAR(70), IN `txt` TEXT)  NO SQL
BEGIN
DECLARE Spech TEXT;
SET Spech = (SELECT `users`.`speech` FROM `users` WHERE `users`.`id` =id_u);

SET Spech = CONCAT(Spech, " ");
SET Spech = CONCAT(Spech, txt);

UPDATE `users` SET `speech` = Spech
WHERE `users`.`id` = id_u;

END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `id_g` int(3) UNSIGNED NOT NULL,
  `name` varchar(30) NOT NULL,
  `course` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`id_g`, `name`, `course`) VALUES
(1, 'тип-71', 4),
(2, 'тбд-21', 1),
(3, 'тип-72', 4),
(4, 'тип-82', 4),
(5, 'тип-81', 4);

-- --------------------------------------------------------

--
-- Table structure for table `records`
--

CREATE TABLE `records` (
  `id` int(4) UNSIGNED NOT NULL,
  `speech` text,
  `duration` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `records`
--

INSERT INTO `records` (`id`, `speech`, `duration`) VALUES
(1, 'sadf', 14.6),
(2, ' Алин Штирбу сказал: \"Привет как дела\"\r\n Владимир Ролдугин сказал: \"Хорошо\"\r\n Андрей Черторижский сказал: \"Что с погодой\"\r\n Алин Штирбу сказал: \n', 32.7),
(3, '', 0),
(4, ' Андрей Кузьмин сказал: \r\n Иван Стебеньков сказал: \r\n Олег Иванов сказал: \r\n', 38.3),
(5, ' Владимир Ролдугин сказал: \n', 0),
(6, ' Иван Стебеньков сказал: \r\n Привет я ваня', 12.9),
(7, ' Олег Петров сказал: \n Андрей Кузьмин сказал: \n Иван Стебеньков сказал: \n', 0),
(8, ' Олег Петров сказал:  Привет я олег\r\n  Иван Стебеньков сказал:  Привет, я ваня , как дела? \r\n  Олег Иванов сказал:  aboba\r\n', 16.9),
(16, ' Черторижский Андрей сказал:  привет меня зовут андрей\r\n Черторижский Андрей сказал:  сегодня я расскажу такую тему как программирования\r\n Черторижский Андрей сказал:  \r\n Черторижский Андрей сказал:  привет\r\n Черторижский Андрей сказал:  а что делаешь\r\n Черторижский Андрей сказал:  \r\n Иван петров сказал: как дела\r\n', 15.54),
(17, ' Черторижский Андрей сказал:  привет как дела\r\n Черторижский Андрей сказал:  у меня все хорошо\r\n Черторижский Андрей сказал:  что делаешь\r\n', 4.32),
(18, ' Черторижский Андрей сказал:  меня зовут а в попа\r\n Черторижский Андрей сказал:  только ты сказал\r\n', 3.96),
(19, ' Черторижский Андрей сказал:  сегодня я расскажу что такое программировании покажу как выглядит машина\r\n Черторижский Андрей сказал:  а также я хотел рассказать что мы сегодня будем проходить\r\n', 10.54),
(20, '', 0),
(21, '', 0),
(22, '', 0);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id_r` int(3) UNSIGNED NOT NULL,
  `Name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id_r`, `Name`) VALUES
(1, 'Студент'),
(2, 'Староста'),
(3, 'Админ'),
(4, 'Преподаватель');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id_s` int(3) UNSIGNED NOT NULL,
  `lastname` varchar(40) NOT NULL,
  `firstname` varchar(40) NOT NULL,
  `middlename` varchar(40) NOT NULL,
  `phone` varchar(11) NOT NULL,
  `id_g` int(3) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id_s`, `lastname`, `firstname`, `middlename`, `phone`, `id_g`) VALUES
(1, 'Штирбу', 'Алин', 'Ивановчи', '89150644977', 1),
(2, 'Ролдугин', 'Владимир', 'Дмитриевич', '84150644971', 2),
(3, 'Саруханова', 'Наталья', 'Петровна', '89150644911', 3),
(4, 'Черторижский', 'Андрей', 'Олегович', '89150644922', 4);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(70) NOT NULL,
  `id_s` int(3) UNSIGNED NOT NULL,
  `pass` varchar(50) NOT NULL,
  `id_r` int(3) UNSIGNED NOT NULL,
  `speech` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `id_s`, `pass`, `id_r`, `speech`) VALUES
('257871068532834304', 1, '1234f', 2, 'lex1133\", \"привет как дела\", \"11.02.2022 20:50:02\", \"1.54\"\r\nlex113343\", \"привет каыфафаык дела\", \"11.02.2022 20:50:02\", \"1.5424\" 2   козы не у меня не работает мне постоянно         в другой встанет '),
('326388023925145601', 4, '1234f', 1, ' boba 3131 fffff fffff fffff fffff привет как дела   а у тебя дела   привет как дела чем занимаешься я хочу купить арбуз да а почему привет как дела  привет  привет привет как дела але к прийти я дошёл до такого момент что я уже оптимизацию дело её в то  животные  а животное а живу козы что-нибудь что угодно скажу ты похода раз два три плохо так от неважно что я посмотрю главным что все нормально ты я поста просто версию за сорок мегабайт я не хочу на с ставить этот обработку голос который двойника весь ты семнадцать гу оперативно жрёт нахер надо этом идеально просто обрабатывает но это семнадцать гигов императива жрёт нафик не так такой что-то есть ну вот на такой кривой версии сорок мегабайт я уже пробовал за два гека она не установлено я просто включил лёгкую версии но я эти игры я просто от букв не найду такой шестнадцать африке и вест берёшься я так с работой что я хотел   или привет как дела привет как дела привет как дела чем занимаешься привет меня зовут андрей сегодня я расскажу такую тему как программирования а также хочу сказать что сегодня мы узнаем о перемен  привет а что делаешь   привет как дела у меня все хорошо что делаешь меня зовут а в попа только ты сказал сегодня я расскажу что такое программировании покажу как выглядит машина а также я хотел рассказать что мы сегодня будем проходить'),
('326388023925145602', 3, '1234f', 2, 'lex1133\", \"привет как дела\", \"11.02.2022 20:50:02\", \"1.54\" lex113343\", \"привет каыфафаык дела\", \"11.02.2022 20:50:02\", \"1.5424\"'),
('326388023925145605', 2, '1234', 1, '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id_g`);

--
-- Indexes for table `records`
--
ALTER TABLE `records`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_r`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id_s`),
  ADD KEY `id_g` (`id_g`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_s` (`id_s`),
  ADD KEY `роли` (`id_r`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `id_g` int(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `records`
--
ALTER TABLE `records`
  MODIFY `id` int(4) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id_r` int(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id_s` int(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`id_g`) REFERENCES `groups` (`id_g`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`id_s`) REFERENCES `students` (`id_s`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `роли` FOREIGN KEY (`id_r`) REFERENCES `roles` (`id_r`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
