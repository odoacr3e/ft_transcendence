select p."name" as "Name", p."cost"  as "Cost", CONCAT(a."name", ': ', a."description") as "Ability"
from pieces p
join abilities a on p.id_ability = a.id_ability;

-- lista pezzi ordinati per costo (crescente)
select p."name" as "Name", p."cost"  as "Cost", CONCAT(a."name", ': ', a."description") as "Ability"
from pieces p
join abilities a on p.id_ability = a.id_ability
order by p."cost"; -- desc per ordine decrescente