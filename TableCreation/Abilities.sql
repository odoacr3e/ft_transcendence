CREATE TABLE IF NOT EXISTS Abilities (
	`idAbility` int UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`name` varchar(250) NOT NULL,
	`description` text NOT NULL,
	`image` LONGBLOB
);


ALTER TABLE `Pieces`
ADD CONSTRAINT fk_idAbility
FOREIGN KEY (idAbility) REFERENCES Abilities(idAbility)
ON UPDATE CASCADE; -- serve a fare update su tutti i Pieces all'UPDATE di Abilities
