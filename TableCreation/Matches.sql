CREATE TABLE IF NOT EXISTS Matches (
	idMatch int UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	matchType enum('single', 'tournament')
);
