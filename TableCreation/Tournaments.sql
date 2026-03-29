CREATE TABLE IF NOT EXISTS Tournaments (
	idTournament int NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`name` varchar(200),
	startDate datetime,
	endDate datetime
);