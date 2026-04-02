CREATE TABLE IF NOT EXISTS tournament_players (
	id_tournament INTEGER NOT NULL,
	id_user INTEGER NOT NULL,
	PRIMARY KEY (id_tournament, id_user),
);

ALTER TABLE tournament_players
ADD CONSTRAINT fk_tp_tournament
FOREIGN KEY (id_tournament) REFERENCES tournaments(id_tournament)
ON DELETE CASCADE,
ADD CONSTRAINT fk_tp_user
FOREIGN KEY (id_user) REFERENCES users(id_user)
ON DELETE CASCADE;

