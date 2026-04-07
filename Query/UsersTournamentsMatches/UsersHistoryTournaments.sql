
SELECT t.id_tournament, t.name AS tournament_name, m.id_match, m.round, um.outcome
FROM users u
JOIN tournament_players tp ON tp.id_user = u.id_user
JOIN tournaments t ON t.id_tournament = tp.id_tournament
LEFT JOIN matches m ON m.id_tournament = t.id_tournament
LEFT JOIN users_matches um ON um.id_match = m.id_match AND um.id_user = u.id_user
WHERE u.id_user = 3 AND um.id_match IS NOT NULL
ORDER BY t.id_tournament, m.round;