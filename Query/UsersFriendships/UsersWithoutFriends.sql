
-- seleziona tutti i campi degli utenti non presenti nella tabella friendships
SELECT *
FROM users u
WHERE NOT EXISTS (
  SELECT *
  FROM friendships f
  WHERE f.id_user1 = u.id_user
     OR f.id_user2 = u.id_user
);