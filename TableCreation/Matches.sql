CREATE TABLE IF NOT EXISTS Matches (
	idMatch int UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	startDate datetime,
	endDate datetime,
	round enum('none', 'F', 'SF', 'QF'),
	outcome enum('Win', 'Lose', 'Draw'),
	idTournament int
);

ALTER TABLE Matches
ADD CONSTRAINT fk_idTournament
FOREIGN KEY idTournament REFERENCES Tournaments(idTournament)
ON UPDATE CASCADE
ON DELETE CASCADE;