CREATE TABLE IF NOT EXISTS UsersMatches (
	idUsersMatch int UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	startDate datetime NOT NULL,
	endDate datetime NOT NULL,
	round enum('none', 'F', 'SF', 'QF'),
	idUser int UNSIGNED NOT NULL,
	idMatch int UNSIGNED NOT NULL
);

ALTER TABLE UsersMatches
ADD CONSTRAINT fk_idUser
FOREIGN KEY (idUser) REFERENCES Users(idUser)
ON UPDATE CASCADE,
ADD CONSTRAINT fk_idMatch
FOREIGN KEY (idMatch) REFERENCES Matches(idMatch)
ON UPDATE CASCADE;