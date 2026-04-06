
-- conta quanti amici ha ogni utente
select u1.id_user, CONCAT(u1.username, ' (', u1."name", ' ', u1.surname , ')') AS user, count(*)
from friendships f 
join users u1 on u1.id_user = f.id_user1
join users u2 on u2.id_user = f.id_user2
group by u1.id_user, u1.username, u1."name", u1.surname
order by count(*) desc

-- conta quanti amici ha un singolo utente (scelto tramite ID oppure per corrispondenza di username)
select u1.id_user, CONCAT(u1.username, ' (', u1."name", ' ', u1.surname , ')') AS user, count(*)
from friendships f 
join users u1 on u1.id_user = f.id_user1
join users u2 on u2.id_user = f.id_user2
where u1.id_user = 1 -- oppure u1.username LIKE '%topo%'
group by u1.id_user, u1.username, u1."name", u1.surname
order by count(*) desc