
-- Ricerca nella tabella Friends tutti i record che hanno lo stato della amicizia 'pending'
SELECT CONCAT(u1.username, ' (', u1."name", ' ', u1.surname , ')') AS user1, CONCAT(u2.username, ' (', u2."name", ' ', u2.surname , ')') AS "Friendship", f.friend_status AS "Status"
FROM friendships f
JOIN users u1 ON u1.id_user = f.id_user1 
JOIN users u2 ON u2.id_user = f.id_user2
WHERE f.friend_status = 'pending';

-- Ricerca tutti i record per l'utente 4 che hanno lo stato della amicizia 'pending'
-- essendoci vincolo ID1 < ID2 andranno cercati i valori degli ID sia nel primo user che nel secondo
SELECT CONCAT(u1.username, ' (', u1."name", ' ', u1.surname , ')') AS user1, CONCAT(u2.username, ' (', u2."name", ' ', u2.surname , ')') AS "Friendship", f.friend_status AS "Status"
FROM friendships f
JOIN users u1 ON u1.id_user = f.id_user1 
JOIN users u2 ON u2.id_user = f.id_user2
WHERE f.friend_status = 'pending' AND (u1.id_user == 4 OR u2.id_user == 4);