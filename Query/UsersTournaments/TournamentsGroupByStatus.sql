select t.status as "Stato", COUNT(*) as "Numero tornei"
from tournaments t
group by t.status

-- ritorna tutti i tornei open (creato ma non iniziato) / ongoing (almeno con una partita fatta) con partecipante un utente
select u.username , Count(*) as "Tornei aperti"
from tournament_players tp 
join users u on u.id_user = tp.id_user
join tournaments t on t.id_tournament = tp.id_tournament
where (t.status = 'open' or t.status = 'ongoing') and u.username like '%g%' -- oppure per u.id_user
group by u.username 