CREATE TABLE IF NOT EXISTS users (
	id_user integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	"name" varchar(250) NOT NULL,
	surname varchar(250) NOT NULL,
	username varchar(50) NOT NULL UNIQUE,
	"password" varchar(200) NOT NULL,
	email varchar(100) NOT NULL,
	nationality varchar(50) NOT NULL,
	"image" bytea,
	id_preference int NOT NULL DEFAULT 1
);

