-- CinemaStream database schema.
--
-- Hand-extracted (DDL only, no rows) from a production pg_dump provided
-- outside version control. Two deliberate differences from that dump:
--   1. `ALTER ... OWNER TO avnadmin` statements are omitted -- avnadmin is
--      the managed-Postgres admin role on the original hosted instance and
--      won't exist in local/CI environments; omitting them just means
--      objects are owned by whichever role runs this script.
--   2. The unused, empty `cinemastream` schema (created but never
--      referenced -- every table lives in `public`) is dropped for clarity.
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

CREATE TABLE public.genres (
    id integer NOT NULL,
    tmdb_id integer NOT NULL,
    name text NOT NULL
);

CREATE SEQUENCE public.genres_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.genres_id_seq OWNED BY public.genres.id;

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

CREATE TABLE public.movie_genres (
    movie_id integer NOT NULL,
    genre_id integer NOT NULL
);

CREATE TABLE public.movies (
    movie_id integer NOT NULL,
    tmdb_id integer,
    title character varying(255),
    description text,
    duration_minutes integer,
    is_popular boolean,
    is_recent boolean,
    average_rating numeric(3,2),
    youtube_video_id text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    poster_url text,
    release_date date,
    CONSTRAINT movies_average_rating_check CHECK (((average_rating >= (0)::numeric) AND (average_rating <= (10)::numeric)))
);

CREATE SEQUENCE public.movies_movie_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.movies_movie_id_seq OWNED BY public.movies.movie_id;

CREATE TABLE public.series (
    series_id integer NOT NULL,
    tmdb_id integer,
    name character varying(255),
    description text,
    first_air_date date,
    finale_date date,
    is_popular boolean,
    average_rating numeric(3,2),
    youtube_video_id text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    poster_url text,
    CONSTRAINT series_average_rating_check CHECK (((average_rating >= (0)::numeric) AND (average_rating <= (10)::numeric)))
);

CREATE TABLE public.series_genres (
    series_id integer NOT NULL,
    genre_id integer NOT NULL
);

CREATE SEQUENCE public.series_series_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.series_series_id_seq OWNED BY public.series.series_id;

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

ALTER TABLE ONLY public.genres ALTER COLUMN id SET DEFAULT nextval('public.genres_id_seq'::regclass);
ALTER TABLE ONLY public.login_history ALTER COLUMN id SET DEFAULT nextval('public.login_history_id_seq'::regclass);
ALTER TABLE ONLY public.movies ALTER COLUMN movie_id SET DEFAULT nextval('public.movies_movie_id_seq'::regclass);
ALTER TABLE ONLY public.series ALTER COLUMN series_id SET DEFAULT nextval('public.series_series_id_seq'::regclass);
ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);
ALTER TABLE ONLY public.watched_history ALTER COLUMN id SET DEFAULT nextval('public.watched_history_id_seq'::regclass);

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_tmdb_id_key UNIQUE (tmdb_id);

ALTER TABLE ONLY public.login_history
    ADD CONSTRAINT login_history_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.movie_genres
    ADD CONSTRAINT movie_genres_pkey PRIMARY KEY (movie_id, genre_id);

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT movies_pkey PRIMARY KEY (movie_id);

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT movies_tmdb_id_unique UNIQUE (tmdb_id);

ALTER TABLE ONLY public.series_genres
    ADD CONSTRAINT series_genres_pkey PRIMARY KEY (series_id, genre_id);

ALTER TABLE ONLY public.series
    ADD CONSTRAINT series_pkey PRIMARY KEY (series_id);

ALTER TABLE ONLY public.series
    ADD CONSTRAINT series_tmdb_id_unique UNIQUE (tmdb_id);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);

ALTER TABLE ONLY public.watched_history
    ADD CONSTRAINT watched_history_pkey PRIMARY KEY (id);

CREATE INDEX idx_users_created_at ON public.users USING btree (created_at);

CREATE TRIGGER set_role_to_guest BEFORE INSERT ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_default_role();

ALTER TABLE ONLY public.login_history
    ADD CONSTRAINT login_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);

ALTER TABLE ONLY public.movie_genres
    ADD CONSTRAINT movie_genres_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES public.genres(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.movie_genres
    ADD CONSTRAINT movie_genres_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES public.movies(movie_id) ON DELETE CASCADE;

ALTER TABLE ONLY public.series_genres
    ADD CONSTRAINT series_genres_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES public.genres(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.series_genres
    ADD CONSTRAINT series_genres_series_id_fkey FOREIGN KEY (series_id) REFERENCES public.series(series_id) ON DELETE CASCADE;
