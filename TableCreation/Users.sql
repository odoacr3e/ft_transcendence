CREATE TABLE IF NOT EXISTS users (
	id_user integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	"name" varchar(250) NOT NULL,
	surname varchar(250) NOT NULL,
	username varchar(50) NOT NULL UNIQUE,
	"password" varchar(200) NOT NULL,
	email varchar(100) NOT NULL,
	nationality varchar(50) NOT NULL,
	"image" bytea,
	preferences JSONB NOT NULL DEFAULT '{
		"theme": "light",
		"colors": {
			"primary": "#420404",
			"secondary": "#06b6d4",
			"background": "#F2F3F4",
			"text": "#6b1b1b"
		}
	}'
);

