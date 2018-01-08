CREATE DATABASE IF NOT EXISTS mydb;

USE mydb;



# Dump of table User
# ------------------------------------------------------------

DROP TABLE IF EXISTS `User`;

CREATE TABLE `User` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table talk
# ------------------------------------------------------------

DROP TABLE IF EXISTS `talk`;

CREATE TABLE `talk` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `description` text NOT NULL,
  `author` int(11) unsigned NOT NULL,
  `duration` enum('30','60','180') NOT NULL DEFAULT '60',
  `title` varchar(50) NOT NULL DEFAULT '',
  `kind` enum('request','proposal') NOT NULL DEFAULT 'request',
  `scheduled_at` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_talk_user` (`author`),
  CONSTRAINT `FK_talk_user` FOREIGN KEY (`author`) REFERENCES `User` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table like
# ------------------------------------------------------------

DROP TABLE IF EXISTS `like`;

CREATE TABLE `like` (
  `user` int(11) unsigned NOT NULL,
  `talk` int(11) unsigned NOT NULL,
  PRIMARY KEY (`user`,`talk`),
  KEY `FK_like_talk` (`talk`),
  CONSTRAINT `FK_like_talk` FOREIGN KEY (`talk`) REFERENCES `talk` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_like_user` FOREIGN KEY (`user`) REFERENCES `User` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table speak
# ------------------------------------------------------------

DROP TABLE IF EXISTS `speak`;

CREATE TABLE `speak` (
  `user` int(11) unsigned NOT NULL,
  `talk` int(11) unsigned NOT NULL,
  PRIMARY KEY (`user`,`talk`),
  KEY `FK_speak_talk` (`talk`),
  CONSTRAINT `FK_speak_talk` FOREIGN KEY (`talk`) REFERENCES `talk` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_speak_user` FOREIGN KEY (`user`) REFERENCES `User` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;