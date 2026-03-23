
-- Ricerca nella tabella Friends tutti i record che contengono una 'n' nel loro username dello user1
SELECT u1.username AS user1, u2.username AS 'Friend with', f.friendStatus AS 'Status'
FROM Friends f
JOIN Users u1 ON u1.idUser = f.idUser1 
JOIN Users u2 ON u2.idUser = f.idUser2
WHERE u1.username LIKE '%n%';

-- Ricerca nella tabella Friends tutti i record che hanno come username esattamente 'Investigatopo12' dello user1
SELECT u1.username AS user1, u2.username AS 'Friend with', f.friendStatus AS 'Status'
FROM Friends f
JOIN Users u1 ON u1.idUser = f.idUser1 
JOIN Users u2 ON u2.idUser = f.idUser2
WHERE u1.username = 'Investigatopo12';

-- Ricerca nella tabella Friends tutti i record che hanno lo stato della amicizia 'pending'
SELECT u1.username AS user1, u2.username AS 'Friend with', f.friendStatus AS 'Status'
FROM Friends f
JOIN Users u1 ON u1.idUser = f.idUser1 
JOIN Users u2 ON u2.idUser = f.idUser2
WHERE f.friendStatus = 'pending';