CREATE TYPE tournaments_status AS ENUM('open', 'ongoing', 'closed');

CREATE TABLE IF NOT EXISTS tournaments (
	id_tournament integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	name varchar(200) NOT NULL,
	status tournaments_status DEFAULT 'open',
	created_by integer NOT NULL,
	created_at TIMESTAMP DEFAULT now()
);

ALTER TABLE tournaments
ADD CONSTRAINT fk_tournament_created_by
FOREIGN KEY created_by REFERENCES users(id_users)
ON UPDATE CASCADE