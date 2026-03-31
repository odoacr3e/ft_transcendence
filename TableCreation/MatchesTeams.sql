CREATE TABLE IF NOT EXISTS matches_teams (
	id_matchteams integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	team1 JSON NOT NULL,
	team2 JSON NOT NULL,
	team3 JSON,
	team4 JSON,
	id_usermatch integer NOT NULL
);

ALTER TABLE matches_teams
ADD CONSTRAINT fk_id_usersmatch
FOREIGN KEY (id_usermatch) REFERENCES users_matches(id_usermatch)
ON UPDATE CASCADE;