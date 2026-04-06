
-- ritorna tutti i tornei con i campi formattati (la data di creazione e formattata come sotto)
-- e ordinati dal piu recente al meno recente
select t."name" as "Nome Torneo", t.status as "Stato",
TO_CHAR(t.created_at, 'DD/MM/YYYY HH24:MI:SS') as "Creato il", u.username as "Creato da"
from tournaments t
join users u on t.created_by = u.id_user
order by created_at DESC