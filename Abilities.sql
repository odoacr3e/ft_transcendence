CREATE TABLE Abilities (
	`idAbility` int UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`description` text NOT NULL,
	`image` LONGBLOB
);


ALTER TABLE `Pieces`
ADD CONSTRAINT fk_idAbility
FOREIGN KEY (idAbility) REFERENCES Abilities(idAbility)
ON UPDATE CASCADE; -- server a fare update su tutti i Pieces all'UPDATE di Abilities
