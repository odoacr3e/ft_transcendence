SELECT u.username, t."name"
FROM users u
JOIN tournament_players tp ON tp.id_user = u.id_user
join tournaments t on t.id_tournament = tp.id_tournament
WHERE tp.id_tournament = 1
AND NOT EXISTS (
    SELECT 1
    FROM users_matches um
    JOIN matches m ON m.id_match = um.id_match
    WHERE um.id_user = u.id_user
    AND m.id_tournament = tp.id_tournament
);