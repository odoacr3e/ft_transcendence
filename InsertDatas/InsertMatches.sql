INSERT INTO matches (start_date, end_date, round, id_tournament) VALUES
-- Match singoli
(NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days' + INTERVAL '1 hour', NULL, NULL),
(NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '14 minutes', NULL, NULL),
(NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '12 minutes', NULL, NULL),
(NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '10 minutes', NULL, NULL),
-- Match torneo 
(NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '2 minutes', 'QF', 1);