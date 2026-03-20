CREATE TABLE Users (
	`idUser` int UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`name` varchar(250) NOT NULL,
	`surname` varchar(250) NOT NULL,
	`username` varchar(50) NOT NULL UNIQUE,
	`password` varchar(200) NOT NULL,
	`email` varchar(100) NOT NULL,
	`nationality` varchar(50) NOT NULL,
	`image` LONGBLOB 
);
