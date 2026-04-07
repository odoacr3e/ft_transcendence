SELECT  u.id_user, u.username, u.points, COUNT(*) AS tournaments_played
FROM users u
LEFT JOIN tournament_players tp ON tp.id_user = u.id_user
GROUP BY u.id_user, u.username, u.points
ORDER BY u.points DESC;