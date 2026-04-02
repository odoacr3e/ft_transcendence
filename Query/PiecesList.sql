select p."name" as "Name", p."cost"  as "Cost", CONCAT(a."name", ' : ', a."description") as "Ability"
from abilities a, pieces p
where p.id_ability = a.id_ability ;