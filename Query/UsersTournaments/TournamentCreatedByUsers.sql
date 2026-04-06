
-- ritorna i tornei che sono stati creati da un utente specifico (selezionato qui tramite ID)
select t.name, t.status
from tournaments t
join users u on u.id_user = t.created_by
where u.id_user = 1