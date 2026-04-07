
-- ritorna i partecipanti per torneo (senza considerare utenti di test)
select t."name" as "Tournament name", COUNT(*) as "Partecipanti"
from tournament_players tp
join users u on u.id_user = tp.id_user
join tournaments t on t.id_tournament = tp.id_tournament
where u.username not like '%test%'
group by t."name"