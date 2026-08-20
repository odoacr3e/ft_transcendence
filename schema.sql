--
-- PostgreSQL database dump
--

\restrict A93ZQNjayyD3myhgbMjfrmo0QBR4EiogZCmSDREnuF8L4TwDjZmfcaTYvAENHlS

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: friendships_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.friendships_status AS ENUM (
    'accepted',
    'pending'
);


--
-- Name: matches_outcome; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.matches_outcome AS ENUM (
    'Win',
    'Lose',
    'Draw'
);


--
-- Name: matches_round; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.matches_round AS ENUM (
    'F',
    'SF',
    'QF'
);


--
-- Name: notification_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.notification_status AS ENUM (
    'read',
    'not read',
    'pending'
);


--
-- Name: tournaments_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.tournaments_status AS ENUM (
    'open',
    'ongoing',
    'closed'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: abilities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.abilities (
    id_ability integer NOT NULL,
    name character varying(250) NOT NULL,
    description text NOT NULL
);


--
-- Name: abilities_id_ability_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.abilities ALTER COLUMN id_ability ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.abilities_id_ability_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: friendships; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.friendships (
    id_friendship integer NOT NULL,
    id_user1 integer NOT NULL,
    id_user2 integer NOT NULL,
    friend_status public.friendships_status NOT NULL,
    sender integer NOT NULL,
    CONSTRAINT check_order_pair CHECK ((id_user1 < id_user2))
);


--
-- Name: friendships_id_friendship_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.friendships ALTER COLUMN id_friendship ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.friendships_id_friendship_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: matches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.matches (
    id_match integer NOT NULL,
    start_date timestamp with time zone DEFAULT now(),
    end_date timestamp with time zone,
    round public.matches_round,
    id_tournament integer,
    history json
);


--
-- Name: matches_id_match_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.matches ALTER COLUMN id_match ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.matches_id_match_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id_notification integer NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    status public.notification_status DEFAULT 'not read'::public.notification_status NOT NULL,
    id_user integer NOT NULL,
    creation_date timestamp with time zone,
    id_sender integer
);


--
-- Name: notifications_id_notification_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.notifications ALTER COLUMN id_notification ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.notifications_id_notification_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: pieces; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pieces (
    id_piece integer NOT NULL,
    name character varying(250) NOT NULL,
    cost integer DEFAULT 4 NOT NULL,
    id_ability integer NOT NULL,
    info text,
    lore text,
    quote text
);


--
-- Name: pieces_id_piece_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.pieces ALTER COLUMN id_piece ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.pieces_id_piece_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: preferences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.preferences (
    id_preference integer NOT NULL,
    name character varying(250) NOT NULL
);


--
-- Name: preferences_id_preference_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.preferences ALTER COLUMN id_preference ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.preferences_id_preference_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tournament_players; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tournament_players (
    id_tournament integer NOT NULL,
    id_user integer NOT NULL
);


--
-- Name: tournaments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tournaments (
    id_tournament integer NOT NULL,
    name character varying(200) NOT NULL,
    status public.tournaments_status DEFAULT 'open'::public.tournaments_status,
    created_by integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: tournaments_id_tournament_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.tournaments ALTER COLUMN id_tournament ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tournaments_id_tournament_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id_user integer NOT NULL,
    name character varying(250) NOT NULL,
    surname character varying(250) NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(200),
    email character varying(100) NOT NULL,
    nationality character varying(50) NOT NULL,
    image text,
    points integer DEFAULT 500 NOT NULL,
    title character varying(200) DEFAULT 'Newbie'::character varying NOT NULL,
    id_preference integer DEFAULT 1 NOT NULL,
    mfa boolean DEFAULT false NOT NULL,
    google_id character varying
);


--
-- Name: users_id_user_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.users ALTER COLUMN id_user ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_user_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users_matches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users_matches (
    id_usermatch integer NOT NULL,
    id_user integer NOT NULL,
    id_match integer NOT NULL,
    outcome public.matches_outcome,
    team json DEFAULT '[
  {"type": "Sovrano", "count": 1, "cost": 0},
  {"type": "Campione", "count": 1, "cost": 10},
  {"type": "Valchiria", "count": 2, "cost": 3},
  {"type": "Minotauro", "count": 2, "cost": 5},
  {"type": "Giullare", "count": 2, "cost": 5},
  {"type": "Bastardo", "count": 8, "cost": 1}
]'::json NOT NULL
);


--
-- Name: users_matches_id_usermatch_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.users_matches ALTER COLUMN id_usermatch ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_matches_id_usermatch_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: abilities abilities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.abilities
    ADD CONSTRAINT abilities_pkey PRIMARY KEY (id_ability);


--
-- Name: friendships friendships_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.friendships
    ADD CONSTRAINT friendships_pkey PRIMARY KEY (id_friendship);


--
-- Name: matches matches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_pkey PRIMARY KEY (id_match);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id_notification);


--
-- Name: pieces pieces_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pieces
    ADD CONSTRAINT pieces_pkey PRIMARY KEY (id_piece);


--
-- Name: preferences preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.preferences
    ADD CONSTRAINT preferences_pkey PRIMARY KEY (id_preference);


--
-- Name: tournament_players tournament_players_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tournament_players
    ADD CONSTRAINT tournament_players_pkey PRIMARY KEY (id_tournament, id_user);


--
-- Name: tournaments tournaments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tournaments
    ADD CONSTRAINT tournaments_pkey PRIMARY KEY (id_tournament);


--
-- Name: users unique_email; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_email UNIQUE (email);


--
-- Name: friendships unique_user_pair; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.friendships
    ADD CONSTRAINT unique_user_pair UNIQUE (id_user1, id_user2);


--
-- Name: users_matches users_matches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_matches
    ADD CONSTRAINT users_matches_pkey PRIMARY KEY (id_usermatch);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id_user);


--
-- Name: users users_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_unique UNIQUE (google_id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: pieces fk_id_ability; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pieces
    ADD CONSTRAINT fk_id_ability FOREIGN KEY (id_ability) REFERENCES public.abilities(id_ability) ON UPDATE CASCADE;


--
-- Name: friendships fk_id_friend1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.friendships
    ADD CONSTRAINT fk_id_friend1 FOREIGN KEY (id_user1) REFERENCES public.users(id_user) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: friendships fk_id_friend2; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.friendships
    ADD CONSTRAINT fk_id_friend2 FOREIGN KEY (id_user2) REFERENCES public.users(id_user) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users_matches fk_id_match; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_matches
    ADD CONSTRAINT fk_id_match FOREIGN KEY (id_match) REFERENCES public.matches(id_match) ON UPDATE CASCADE;


--
-- Name: notifications fk_id_notifications; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk_id_notifications FOREIGN KEY (id_user) REFERENCES public.users(id_user) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notifications fk_id_sender; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk_id_sender FOREIGN KEY (id_sender) REFERENCES public.users(id_user) ON DELETE SET NULL;


--
-- Name: matches fk_id_tournament; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT fk_id_tournament FOREIGN KEY (id_tournament) REFERENCES public.tournaments(id_tournament) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users_matches fk_id_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_matches
    ADD CONSTRAINT fk_id_user FOREIGN KEY (id_user) REFERENCES public.users(id_user) ON UPDATE CASCADE;


--
-- Name: users fk_preference; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_preference FOREIGN KEY (id_preference) REFERENCES public.preferences(id_preference);


--
-- Name: tournaments fk_tournaments_created_by; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tournaments
    ADD CONSTRAINT fk_tournaments_created_by FOREIGN KEY (created_by) REFERENCES public.users(id_user) ON UPDATE CASCADE;


--
-- Name: tournament_players fk_tp_tournament; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tournament_players
    ADD CONSTRAINT fk_tp_tournament FOREIGN KEY (id_tournament) REFERENCES public.tournaments(id_tournament) ON DELETE CASCADE;


--
-- Name: tournament_players fk_tp_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tournament_players
    ADD CONSTRAINT fk_tp_user FOREIGN KEY (id_user) REFERENCES public.users(id_user) ON DELETE CASCADE;


--
-- Name: friendships friendships_sender_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.friendships
    ADD CONSTRAINT friendships_sender_fkey FOREIGN KEY (sender) REFERENCES public.users(id_user) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: abilities; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.abilities ENABLE ROW LEVEL SECURITY;

--
-- Name: friendships; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

--
-- Name: matches; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

--
-- Name: notifications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

--
-- Name: pieces; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.pieces ENABLE ROW LEVEL SECURITY;

--
-- Name: preferences; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.preferences ENABLE ROW LEVEL SECURITY;

--
-- Name: tournament_players; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.tournament_players ENABLE ROW LEVEL SECURITY;

--
-- Name: tournaments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

--
-- Name: users_matches; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.users_matches ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--

\unrestrict A93ZQNjayyD3myhgbMjfrmo0QBR4EiogZCmSDREnuF8L4TwDjZmfcaTYvAENHlS

