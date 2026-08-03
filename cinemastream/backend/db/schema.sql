-- CinemaStream database schema.
--
-- Hand-extracted (DDL only, no rows) from a production pg_dump provided
-- outside version control. Deliberate differences from that dump:
--   1. `ALTER ... OWNER TO avnadmin` statements are omitted -- avnadmin is
--      the managed-Postgres admin role on the original hosted instance and
--      won't exist in local/CI environments; omitting them just means
--      objects are owned by whichever role runs this script.
--   2. The unused, empty `cinemastream` schema (created but never
--      referenced -- every table lives in `public`) is dropped for clarity.
--   3. The `movies`, `series`, `genres`, `movie_genres`, and `series_genres`
--      tables from the original dump are dropped entirely: an audit of
--      cinemastream/backend/src/ found zero repository/controller/service
--      code referencing any of them, and seed.local.sql never populated
--      them either. All movie/series/genre data is fetched directly from
--      TMDB by the frontend (see frontend/src/api/tmdb.js) -- these tables
--      were a dead TMDB-cache layer that was never wired up.
--
-- login_history.was_successful / login_history.logout_time are NEW columns,
-- not present in the original dump: backend/api/logout.js relies on them to
-- record when a session ends, but the schema never had them, so the query
-- always failed against the real database. was_successful defaults to true
-- because login_history is only ever inserted after a successful password
-- check (see backend/api/login.js), so every existing row is retroactively
-- correct without a backfill.

CREATE FUNCTION public.set_default_role() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Set the role to 'guest' if it is not provided
    IF NEW.role IS NULL THEN
        NEW.role := 'guest';
    END IF;
    RETURN NEW;
END;
$$;

SET default_tablespace = '';
SET default_table_access_method = heap;

CREATE TABLE public.login_history (
    id integer NOT NULL,
    user_id integer,
    login_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    ip_address text,
    user_agent text,
    first_name text,
    last_name text,
    email text,
    was_successful boolean DEFAULT true,
    logout_time timestamp without time zone
);

CREATE SEQUENCE public.login_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.login_history_id_seq OWNED BY public.login_history.id;

CREATE TABLE public.users (
    user_id integer NOT NULL,
    first_name character varying(70) NOT NULL,
    last_name character varying(70) NOT NULL,
    email character varying(70) NOT NULL,
    password character varying(255) NOT NULL,
    verification_token character varying(100),
    otp_expiry timestamp with time zone,
    is_verified boolean,
    reset_token character varying(100),
    reset_token_expiry timestamp with time zone,
    role character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;

CREATE TABLE public.watched_history (
    id integer NOT NULL,
    user_id integer,
    movie_id integer,
    series_id integer,
    watched_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    movie_title character varying(255),
    series_name character varying(255)
);

CREATE SEQUENCE public.watched_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.watched_history_id_seq OWNED BY public.watched_history.id;

ALTER TABLE ONLY public.login_history ALTER COLUMN id SET DEFAULT nextval('public.login_history_id_seq'::regclass);
ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);
ALTER TABLE ONLY public.watched_history ALTER COLUMN id SET DEFAULT nextval('public.watched_history_id_seq'::regclass);

ALTER TABLE ONLY public.login_history
    ADD CONSTRAINT login_history_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);

ALTER TABLE ONLY public.watched_history
    ADD CONSTRAINT watched_history_pkey PRIMARY KEY (id);

CREATE INDEX idx_users_created_at ON public.users USING btree (created_at);

-- Both indexes below back per-user lookups that previously required a full
-- table scan: watchedHistory.repository.js's getRecentByUser() filters on
-- user_id and sorts by watched_at, and loginHistory.repository.js's
-- recordLogout() filters on user_id for still-open sessions specifically.
CREATE INDEX idx_watched_history_user_id ON public.watched_history USING btree (user_id, watched_at DESC);

CREATE INDEX idx_login_history_user_id_active ON public.login_history USING btree (user_id, login_time DESC) WHERE (logout_time IS NULL);

CREATE TRIGGER set_role_to_guest BEFORE INSERT ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_default_role();

ALTER TABLE ONLY public.login_history
    ADD CONSTRAINT login_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);
