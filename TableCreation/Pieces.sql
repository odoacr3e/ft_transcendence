CREATE TABLE IF NOT EXISTS pieces (
	id_piece integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	"name" varchar(250) NOT NULL,
	cost integer NOT NULL DEFAULT 4,
	upgrade text,
	"image" bytea,
	id_ability integer NOT NULL
);