
-- Numero di notifiche non lette di un utente (ID 1)
select n.title, n.description, n.status
from notifications n
join users u on u.id_user = n.id_user
where u.id_user = 1 and n.status = 'not read'