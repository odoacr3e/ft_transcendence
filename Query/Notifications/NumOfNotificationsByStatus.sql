
-- Numero di notifiche per ogni stato per ogni utente
select n.status, COUNT(*) as "Numero notifiche"
from notifications n
join users u on u.id_user = n.id_user
where u.id_user = 1
group by n.status