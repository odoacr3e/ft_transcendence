CREATE TABLE IF NOT EXISTS abilities (
	id_ability integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	name varchar(250) NOT NULL,
	description text NOT NULL,
	image bytea
);


ALTER TABLE pieces
ADD CONSTRAINT fk_id_ability
FOREIGN KEY (id_ability) REFERENCES abilities(id_ability)
ON UPDATE CASCADE; -- serve a fare update su tutti i Pieces all'UPDATE di Abilities

