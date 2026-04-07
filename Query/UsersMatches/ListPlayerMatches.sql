
-- ritorna l'elenco delle partite di un utente (id 2) con avversario e squadra annesse
select u.username as "Player", u2.username as "Opponent", um.outcome as "Result", um.team as "Player Team"
from users_matches um
join users u on u.id_user = um.id_user
join matches m on m.id_match = um.id_match
join users_matches um2  on um.id_match = um2.id_match and um.id_user <> um2.id_user
join users u2 on u2.id_user = um2.id_user 
where u.id_user = 2