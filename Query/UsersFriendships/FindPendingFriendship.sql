
-- Ricerca nella tabella Friends tutti i record che hanno lo stato della amicizia 'pending'
SELECT u1.username AS user1, u2.username AS "Friend with", f.friend_status AS "Status"
FROM friendships f
JOIN users u1 ON u1.id_user = f.id_user1 
JOIN users u2 ON u2.id_user = f.id_user2
WHERE f.friend_status = "pending" AND u1.username LIKE "%s%";