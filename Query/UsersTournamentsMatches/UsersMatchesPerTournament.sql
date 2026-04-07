
-- a quali tornei ha partecipato un utente (ID 2) e quante partite ha fatto in ogni torneo
SELECT t.id_tournament AS "tournament_id", t.name, COUNT(*) AS matches_played
FROM tournament_players tp
JOIN tournaments t ON t.id_tournament = tp.id_tournament
LEFT JOIN matches m ON m.id_tournament = t.id_tournament
LEFT JOIN users_matches um ON um.id_match = m.id_match AND um.id_user = tp.id_user
WHERE tp.id_user = 2
GROUP BY t.id_tournament, t.name
ORDER BY t.name;