-- New users default to preference id 1. Ensure that row exists even when
-- PostgreSQL is using an existing volume created before this bootstrap was added.
INSERT INTO "preferences" ("id_preference", "name")
VALUES (1, 'Default')
ON CONFLICT ("id_preference") DO NOTHING;

-- Keep the generated id sequence in sync after explicitly ensuring id 1.
SELECT setval(
  pg_get_serial_sequence('preferences', 'id_preference'),
  GREATEST((SELECT COALESCE(MAX("id_preference"), 1) FROM "preferences"), 1),
  true
);
