CREATE TABLE IF NOT EXISTS pieces (
	id_piece integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	"name" varchar(250) NOT NULL,
	cost integer NOT NULL DEFAULT 4,
	"image" bytea,
	id_ability integer NOT NULL
);

ALTER TABLE pieces
ADD CONSTRAINT fk_id_ability
FOREIGN KEY (id_ability) REFERENCES abilities(id_ability)
ON UPDATE CASCADE;