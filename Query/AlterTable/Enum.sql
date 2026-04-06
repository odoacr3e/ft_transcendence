-- rinomina il valore x di un enum dichiarato precedentemente
ALTER TYPE friendships_status RENAME VALUE 'done' TO 'accepted';

-- aggiunge il valore all'enum dichiarato precedentemente
ALTER TYPE friendships_status ADD VALUE 'blocked';

-- aggiunge il valore all'enum dichiarato precedentemente in una posizione specifica
ALTER TYPE friendships_status ADD VALUE 'blocked' AFTER 'accepted';

-- eliminazione campo di un enum -> non diretto, da fare rigirio

-- 1. Crei un nuovo enum senza il valore
CREATE TYPE friendships_status_new AS ENUM ('accepted', 'pending');

-- 2. Cambi la colonna
ALTER TABLE friendships
ALTER COLUMN status TYPE friendships_status_new
USING status::text::friendships_status_new;

-- 3. Elimini il vecchio enum
DROP TYPE friendships_status;

-- 4. Rinomini quello nuovo
ALTER TYPE friendships_status_new RENAME TO friendships_status;

-- 5. Se il valore che rimuovi e presente nei dati prima va rinominato
UPDATE matches
SET round = 'quarter'
WHERE round = 'semi';