
-- ritorna i partecipanti per torneo (senza considerare utenti di test)
select t."name" as "Tournament name", COUNT(*) as "Partecipanti"
from tournament_players tp
join users u on u.id_user = tp.id_user
join tournaments t on t.id_tournament = tp.id_tournament
where u.username not like '%test%' and u.name not like '%test%' and u.surname not like '%test%'
group by t."name"

-- ritorna la lista dei partecipanti per un torneo specifico
select u.username, CONCAT(u.name, ' ', u.surname) as "Nome vero"
from tournament_players tp
join tournaments t on t.id_tournament = tp.id_tournament
join users u on u.id_user = tp.id_user
where t."name" like '%test%'