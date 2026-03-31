CREATE TYPE matches_round AS ENUM('F', 'SF', 'QF');
CREATE TYPE matches_outcome AS ENUM('Win', 'Lose', 'Draw');

CREATE TABLE IF NOT EXISTS matches (
	id_match integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	start_date TIMESTAMPZ DEFAULT NOW(),
	end_date TIMESTAMPZ,
	round matches_round,
	outcome matches_outcome,
	id_tournament integer
);

ALTER TABLE matches
ADD CONSTRAINT fk_id_tournament
FOREIGN KEY id_tournament REFERENCES tournaments(id_tournament)
ON UPDATE CASCADE
ON DELETE CASCADE