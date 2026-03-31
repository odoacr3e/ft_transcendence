CREATE TABLE IF NOT EXISTS abilities (
	id_ability integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	name varchar(250) NOT NULL,
	description text NOT NULL,
	image bytea
);
