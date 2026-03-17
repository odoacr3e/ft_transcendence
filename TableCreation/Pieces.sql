CREATE TABLE Pieces (
	`idPiece` int UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`name` varchar(250) NOT NULL,
	`cost` int NOT NULL,
	`upgrade` text,
	`image` LONGBLOB,
	`idAbility` int UNSIGNED NOT NULL
);
