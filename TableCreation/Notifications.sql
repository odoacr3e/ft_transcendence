CREATE TYPE notification_status AS ENUM('read', 'not read', 'pending');

CREATE TABLE IF NOT EXISTS notifications (
	id_notification integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	title varchar(255) NOT NULL,
	"description" text NOT NULL,
	"status" notification_status NOT NULL,
	data_creazione date,
	ora_creazione time,
	id_user int NOT NULL,

	CONSTRAINT fk_id_notifications
	FOREIGN KEY (id_user) REFERENCES users(id_user)
	ON UPDATE CASCADE
	ON DELETE CASCADE
);
