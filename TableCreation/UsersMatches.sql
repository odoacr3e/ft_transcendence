CREATE TABLE IF NOT EXISTS users_matches (
	idUsersMatch integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	idUser int UNSIGNED NOT NULL,
	idMatch int UNSIGNED NOT NULL,
	team JSON not null DEFAULT '{
	"team": [
		{
			"type": "Sovrano",
			"count": 1,
			"cost": 0
		},
		{
			"type": "Campione",
			"count": 1,
			"cost": 10
		},
		{
			"type": "Valchiria",
			"count": 2,
			"cost": 3
		},
		{
			"type": "Minotauro",
			"count": 2,
			"cost": 5
		},
		{
			"type": "Giullare",
			"count": 2,
			"cost": 5
		},
		{
			"type": "Bastardo",
			"count": 8,
			"cost": 1
		}
	]
	}'
);

ALTER TABLE users_matches
ADD CONSTRAINT fk_id_user
FOREIGN KEY (id_user) REFERENCES Users(id_user)
ON UPDATE CASCADE,
ADD CONSTRAINT fk_id_match
FOREIGN KEY (id_match) REFERENCES matches(id_match)
ON UPDATE CASCADE;