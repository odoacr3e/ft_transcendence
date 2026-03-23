CREATE TABLE IF NOT EXISTS Pieces (
	`idPiece` int UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`name` varchar(250) NOT NULL,
	`cost` int NOT NULL DEFAULT 4,
	`upgrade` text,
	`image` LONGBLOB,
	`idAbility` int UNSIGNED NOT NULL
);