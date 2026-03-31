CREATE TYPE friendships_status AS ENUM('done', 'pending');

CREATE TABLE IF NOT EXISTS friendships (
	id_friendship integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_user1 INT NOT NULL,
    id_user2 INT NOT NULL,
	friend_status friendships_status NOT NULL,
	CONSTRAINT unique_user_pair UNIQUE (id_user1, id_user2),
	CONSTRAINT check_order_pair CHECK (id_user1 < id_user2)
);

ALTER TABLE friendships
ADD CONSTRAINT fk_id_friend1
FOREIGN KEY (id_user1) REFERENCES users(id_user)
ON UPDATE CASCADE
ON DELETE CASCADE,
ADD CONSTRAINT fk_id_friend2
FOREIGN KEY (id_user2) REFERENCES users(id_user)
ON UPDATE CASCADE
ON DELETE CASCADE;