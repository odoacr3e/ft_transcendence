select t.status as "Stato", COUNT(*) as "Numero tornei"
from tournaments t
group by t.status