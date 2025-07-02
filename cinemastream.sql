--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13 (Ubuntu 15.13-1.pgdg24.04+1)
-- Dumped by pg_dump version 15.13 (Ubuntu 15.13-1.pgdg24.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: cinemastream; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA cinemastream;


ALTER SCHEMA cinemastream OWNER TO postgres;

--
-- Name: set_default_role(); Type: FUNCTION; Schema: public; Owner: postgres
--

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


ALTER FUNCTION public.set_default_role() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: genres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.genres (
    id integer NOT NULL,
    tmdb_id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.genres OWNER TO postgres;

--
-- Name: genres_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.genres_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.genres_id_seq OWNER TO postgres;

--
-- Name: genres_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.genres_id_seq OWNED BY public.genres.id;


--
-- Name: login_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.login_history (
    id integer NOT NULL,
    user_id integer,
    login_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    ip_address text,
    user_agent text,
    first_name text,
    last_name text,
    email text
);


ALTER TABLE public.login_history OWNER TO postgres;

--
-- Name: login_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.login_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.login_history_id_seq OWNER TO postgres;

--
-- Name: login_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.login_history_id_seq OWNED BY public.login_history.id;


--
-- Name: movie_genres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movie_genres (
    movie_id integer NOT NULL,
    genre_id integer NOT NULL
);


ALTER TABLE public.movie_genres OWNER TO postgres;

--
-- Name: movies; Type: TABLE; Schema: public; Owner: postgres
--

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


ALTER TABLE public.movies OWNER TO postgres;

--
-- Name: movies_movie_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.movies_movie_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.movies_movie_id_seq OWNER TO postgres;

--
-- Name: movies_movie_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.movies_movie_id_seq OWNED BY public.movies.movie_id;


--
-- Name: series; Type: TABLE; Schema: public; Owner: postgres
--

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


ALTER TABLE public.series OWNER TO postgres;

--
-- Name: series_genres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.series_genres (
    series_id integer NOT NULL,
    genre_id integer NOT NULL
);


ALTER TABLE public.series_genres OWNER TO postgres;

--
-- Name: series_series_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.series_series_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.series_series_id_seq OWNER TO postgres;

--
-- Name: series_series_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.series_series_id_seq OWNED BY public.series.series_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

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


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_user_id_seq OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: watched_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.watched_history (
    id integer NOT NULL,
    user_id integer,
    movie_id integer,
    series_id integer,
    watched_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    movie_title character varying(255),
    series_name character varying(255)
);


ALTER TABLE public.watched_history OWNER TO postgres;

--
-- Name: watched_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.watched_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.watched_history_id_seq OWNER TO postgres;

--
-- Name: watched_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.watched_history_id_seq OWNED BY public.watched_history.id;


--
-- Name: genres id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genres ALTER COLUMN id SET DEFAULT nextval('public.genres_id_seq'::regclass);


--
-- Name: login_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_history ALTER COLUMN id SET DEFAULT nextval('public.login_history_id_seq'::regclass);


--
-- Name: movies movie_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies ALTER COLUMN movie_id SET DEFAULT nextval('public.movies_movie_id_seq'::regclass);


--
-- Name: series series_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.series ALTER COLUMN series_id SET DEFAULT nextval('public.series_series_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Name: watched_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.watched_history ALTER COLUMN id SET DEFAULT nextval('public.watched_history_id_seq'::regclass);


--
-- Data for Name: genres; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.genres (id, tmdb_id, name) FROM stdin;
1	28	Action
2	12	Adventure
3	16	Animation
4	35	Comedy
5	80	Crime
6	99	Documentary
7	18	Drama
8	10751	Family
9	14	Fantasy
10	36	History
11	27	Horror
12	10402	Music
13	9648	Mystery
14	10749	Romance
15	878	Science Fiction
16	10770	TV Movie
17	53	Thriller
18	10752	War
19	37	Western
\.


--
-- Data for Name: login_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.login_history (id, user_id, login_time, ip_address, user_agent, first_name, last_name, email) FROM stdin;
1	\N	2025-07-01 00:35:44.352758	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	Keiketlile	Maboe	maboekeiketlile@gmail.com
2	\N	2025-07-01 07:09:42.47864	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	Keiketlile	Maboe	maboekeiketlile@gmail.com
3	\N	2025-07-01 07:13:06.332685	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	Siphesihle	Mdebuka	mmdebuka@datacentrix.co.za
4	48	2025-07-01 07:15:10.507008	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	Keiketlile	Maboe	maboekeiketlile@gmail.com
5	48	2025-07-02 06:55:25.431213	45.220.174.6	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	Keiketlile	Maboe	maboekeiketlile@gmail.com
6	49	2025-07-02 06:57:47.580457	104.28.197.140	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	Siphesihle	Mdebuka	mmdebuka@datacentrix.co.za
7	51	2025-07-02 06:58:31.619634	104.28.197.140	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	Wandile	Sbiya	lchauke@datacentrix.co.za
8	51	2025-07-02 06:59:19.550683	104.28.197.140	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	Wandile	Sbiya	lchauke@datacentrix.co.za
9	51	2025-07-02 07:22:10.592474	45.220.174.6	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	Wandile	Sbiya	lchauke@datacentrix.co.za
10	48	2025-07-02 07:23:10.064314	45.220.174.6	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	Keiketlile	Maboe	maboekeiketlile@gmail.com
11	51	2025-07-02 07:30:23.682365	45.220.174.6	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	Wandile	Sbiya	lchauke@datacentrix.co.za
12	51	2025-07-02 08:01:54.778803	45.220.174.6	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	Wandile	Sbiya	lchauke@datacentrix.co.za
13	51	2025-07-02 08:08:29.281481	45.220.174.6	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	Wandile	Sbiya	lchauke@datacentrix.co.za
14	51	2025-07-02 08:12:33.426219	45.220.174.6	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	Wandile	Sbiya	lchauke@datacentrix.co.za
15	51	2025-07-02 08:17:29.976442	45.220.174.6	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	Wandile	Sbiya	lchauke@datacentrix.co.za
16	51	2025-07-02 08:25:17.859638	45.220.174.6	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	Wandile	Sbiya	lchauke@datacentrix.co.za
17	51	2025-07-02 08:38:12.929841	45.220.174.6	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	Wandile	Sbiya	lchauke@datacentrix.co.za
18	51	2025-07-02 08:50:35.991992	45.220.174.6	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	Wandile	Sbiya	lchauke@datacentrix.co.za
19	51	2025-07-02 08:56:20.841253	45.220.174.6	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	Wandile	Sbiya	lchauke@datacentrix.co.za
20	147	2025-07-02 09:41:06.374167	45.220.174.6	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	vuyo	Elvis	VMpondo@datacentrix.co.za
21	51	2025-07-02 09:41:23.911533	45.220.174.6	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	Wandile	Sbiya	lchauke@datacentrix.co.za
22	148	2025-07-02 09:44:44.749517	45.220.174.6	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	Lewela	Makgato	lmakgato@datacentrix.co.za
23	147	2025-07-02 09:50:21.172082	45.220.175.146	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	vuyo	Elvis	VMpondo@datacentrix.co.za
24	147	2025-07-02 09:50:53.318689	45.220.175.146	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	vuyo	Elvis	VMpondo@datacentrix.co.za
25	51	2025-07-02 09:51:08.490462	45.220.175.146	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	Wandile	Sbiya	lchauke@datacentrix.co.za
26	51	2025-07-02 10:04:41.650649	45.220.174.6	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	Wandile	Sbiya	lchauke@datacentrix.co.za
27	51	2025-07-02 10:13:28.721703	45.220.174.6	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	Wandile	Sbiya	lchauke@datacentrix.co.za
28	51	2025-07-02 10:16:47.399248	45.220.174.6	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	Wandile	Sbiya	lchauke@datacentrix.co.za
29	51	2025-07-02 10:21:06.565912	45.220.174.6	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	Wandile	Sbiya	lchauke@datacentrix.co.za
30	51	2025-07-02 10:25:19.002212	45.220.174.6	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	Wandile	Sbiya	lchauke@datacentrix.co.za
31	48	2025-07-02 10:39:57.358353	45.220.174.6	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	Keiketlile	Maboe	maboekeiketlile@gmail.com
32	149	2025-07-02 10:59:03.644469	45.220.174.6	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	Garsen	Subramoney	gsubramoney@datacentrix.co.za
33	51	2025-07-02 11:00:42.595792	45.220.174.6	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	Wandile	Sbiya	lchauke@datacentrix.co.za
34	49	2025-07-02 11:02:20.81526	45.220.174.6	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	Siphesihle	Mdebuka	mmdebuka@datacentrix.co.za
35	150	2025-07-02 11:15:32.077857	45.220.174.6	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	Chand	Tjingaete	ctjingaete@datacentrix.co.za
36	51	2025-07-02 11:17:44.170912	45.220.174.6	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	Wandile	Sbiya	lchauke@datacentrix.co.za
37	49	2025-07-02 11:18:18.910955	45.220.174.6	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	Siphesihle	Mdebuka	mmdebuka@datacentrix.co.za
38	151	2025-07-02 11:46:24.858277	45.220.174.6	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	Sudeshen	Chetty	schetty@datacentrix.co.za
39	51	2025-07-02 11:48:21.070048	45.220.174.6	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	Wandile	Sbiya	lchauke@datacentrix.co.za
40	49	2025-07-02 11:48:37.365462	45.220.174.6	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	Siphesihle	Mdebuka	mmdebuka@datacentrix.co.za
\.


--
-- Data for Name: movie_genres; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movie_genres (movie_id, genre_id) FROM stdin;
1	11
1	13
2	8
2	15
2	4
2	2
3	1
3	17
3	11
5	1
5	2
5	11
6	9
6	8
6	1
7	15
7	4
7	1
8	17
8	1
9	17
9	7
9	5
10	1
11	1
11	17
12	11
12	17
12	15
13	3
13	1
13	15
14	13
14	5
14	17
15	1
15	4
15	5
16	11
16	9
16	17
17	9
17	1
17	4
17	3
17	12
18	8
18	4
18	2
18	9
19	1
19	7
19	17
20	13
20	17
20	1
20	15
21	11
22	1
22	5
22	7
22	17
22	4
23	2
23	3
23	8
24	1
24	7
24	2
25	1
25	2
25	17
26	1
26	17
27	11
27	7
28	1
28	17
28	5
29	11
29	17
29	15
30	1
30	5
30	17
31	11
31	4
31	9
31	7
32	3
32	8
32	9
33	8
33	9
34	4
34	14
35	11
35	4
36	9
36	2
36	3
36	8
37	3
37	2
37	8
37	4
38	1
38	15
38	2
39	8
39	4
39	2
39	3
39	15
40	18
40	1
41	1
41	7
41	17
42	17
42	7
43	1
43	17
43	15
44	9
44	1
44	2
44	3
44	4
44	8
45	11
45	13
46	1
46	2
46	7
47	4
48	11
48	17
48	15
49	11
49	1
49	2
49	17
50	1
50	15
50	4
50	8
51	14
51	7
52	7
52	14
53	1
53	2
53	17
53	5
54	3
54	8
54	2
55	7
56	1
56	9
56	2
57	11
58	3
58	8
58	4
59	1
59	2
60	5
60	17
60	1
61	1
61	2
61	15
62	15
62	2
62	1
63	1
63	7
64	4
64	7
65	2
65	8
65	3
66	1
66	7
67	14
67	7
68	7
68	10
68	18
69	3
69	2
69	4
69	9
69	8
69	12
70	11
70	4
71	7
71	17
72	14
72	15
72	17
73	1
73	15
73	2
74	4
74	7
74	14
75	1
75	4
75	15
76	3
76	2
76	4
76	8
77	1
77	17
78	2
78	8
78	6
79	8
79	9
79	2
80	1
80	4
81	2
81	3
81	7
81	8
82	17
82	1
83	15
83	14
83	4
84	14
84	7
85	6
86	3
86	15
86	8
87	11
87	13
88	2
88	1
88	4
88	9
89	14
90	8
90	9
91	7
91	11
91	15
92	8
92	4
92	3
92	15
93	1
93	5
93	17
94	14
94	7
95	2
95	7
95	15
96	7
96	14
97	3
97	9
97	2
98	7
99	11
99	13
100	3
100	2
100	9
180	14
180	4
195	1
195	17
197	11
199	1
199	2
199	7
200	11
200	15
200	17
206	5
206	17
206	1
212	6
13	11
13	17
13	2
219	8
219	3
219	4
219	2
16	1
222	1
222	15
222	17
226	11
228	6
231	11
231	7
234	2
234	4
240	11
240	4
244	7
244	14
248	7
248	10
248	1
263	1
265	7
270	3
270	8
270	10
275	7
279	7
200	14
285	7
285	10
288	7
288	14
288	17
291	7
291	14
97	1
295	3
295	8
295	1
295	4
295	2
295	9
298	15
298	2
\.


--
-- Data for Name: movies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movies (movie_id, tmdb_id, title, description, duration_minutes, is_popular, is_recent, average_rating, youtube_video_id, created_at, poster_url, release_date) FROM stdin;
12	1100988	28 Years Later	\N	\N	\N	\N	\N	mcvLKldPM08	2025-06-22 21:24:42.039521	https://image.tmdb.org/t/p/original/361hRZoG91Nw6qXaIKuGoogQjix.jpg	2025-06-18
6	1087192	How to Train Your Dragon	\N	\N	\N	\N	\N	22w7z_lT6YM	2025-06-22 21:24:39.605496	https://image.tmdb.org/t/p/original/q5pXRYTycaeW6dEgsCrd4mYPmxM.jpg	2025-06-06
3	1442776	Crazy Lizard	\N	\N	\N	\N	\N	PTsv3OONI2Y	2025-06-22 21:24:38.241623	https://image.tmdb.org/t/p/original/9TFaFsSXedaALXTzba349euDeoY.jpg	2024-03-27
8	1087891	The Amateur	\N	\N	\N	\N	\N	DCWcK4c-F8Q	2025-06-22 21:24:40.483568	https://image.tmdb.org/t/p/original/SNEoUInCa5fAgwuEBMIMBGvkkh.jpg	2025-04-09
17	803796	KPop Demon Hunters	\N	\N	\N	\N	\N	AzCAwdp1uIQ	2025-06-22 21:24:44.317507	https://image.tmdb.org/t/p/original/jfS5KEfiwsS35ieZvdUdJKkwLlZ.jpg	2025-06-20
11	1127110	Diablo	\N	\N	\N	\N	\N	ANKPsCTh0Og	2025-06-22 21:24:41.659567	https://image.tmdb.org/t/p/original/uFQduVyYIinJy3eLjozgfl6Xtcn.jpg	2025-06-13
5	1181039	Candle in the Tomb: The Worm Valley	\N	\N	\N	\N	\N	l6svTz8L76E	2025-06-22 21:24:39.114295	https://image.tmdb.org/t/p/original/7Hk1qxAvZi9H9cfBb4iHkoGjapH.jpg	2023-09-22
18	950387	A Minecraft Movie	\N	\N	\N	\N	\N	wJO_vIDZn-I	2025-06-22 21:24:44.899691	https://image.tmdb.org/t/p/original/yFHHfHcUgGAxziP1C3lLt0q2T4s.jpg	2025-03-31
47	968171	Sex Education Mistresses	\N	\N	\N	\N	\N	UNB1V2DWjRo	2025-06-22 21:24:58.079502	https://image.tmdb.org/t/p/original/xghWMg0pkBOdLHCTESyeyHU68wl.jpg	1973-11-20
7	605722	Distant	\N	\N	\N	\N	\N	GsiU3uweE4I	2025-06-22 21:24:40.047538	https://image.tmdb.org/t/p/original/czh8HOhsbBUKoKsmRmLQMCLHUev.jpg	2024-07-12
16	1233413	Sinners	\N	\N	\N	\N	\N	bKGxHflevuk	2025-06-22 21:24:43.867626	https://image.tmdb.org/t/p/original/yqsCU5XOP2mkbFamzAqbqntmfav.jpg	2025-04-16
14	870028	The Accountant²	\N	\N	\N	\N	\N	3wRCOqyDI6E	2025-06-22 21:24:42.945515	https://image.tmdb.org/t/p/original/kMDUS7VmFhb2coRfVBoGLR8ADBt.jpg	2025-04-23
13	1376434	Predator: Killer of Killers	\N	\N	\N	\N	\N	fbddYji1F8s	2025-06-22 21:24:42.463548	https://image.tmdb.org/t/p/original/2XDQa6EmFHSA37j1t0w88vpWqj9.jpg	2025-06-05
25	575265	Mission: Impossible - The Final Reckoning	\N	\N	\N	\N	\N	fsQgc9pCyDU	2025-06-22 21:24:48.271457	https://image.tmdb.org/t/p/original/z53D72EAOxGRqdr7KXXWp9dJiDe.jpg	2025-05-17
34	1403735	Laila	\N	\N	\N	\N	\N	FyhFBHpTh6Y	2025-06-22 21:24:52.133933	https://image.tmdb.org/t/p/original/l4gsNxFPGpzbq0D6QK1a8vO1lBz.jpg	2025-02-14
35	1026542	Baby Blue	\N	\N	\N	\N	\N	1Xz_xV7pSh8	2025-06-22 21:24:52.531677	https://image.tmdb.org/t/p/original/pC6j3tSoneNbe4pjjtGOcWWxGMU.jpg	2023-04-16
33	447273	Snow White	\N	\N	\N	\N	\N	iV46TJKL8cU	2025-06-22 21:24:51.753653	https://image.tmdb.org/t/p/original/xWWg47tTfparvjK0WJNX4xL8lW2.jpg	2025-03-12
10	1240475	Hunt the Wicked	\N	\N	\N	\N	\N	4xkxRFjP0t0	2025-06-22 21:24:41.335627	https://image.tmdb.org/t/p/original/m5UBHbEjQJx3AkRZWRY6A4l4ZDT.jpg	2024-02-12
40	1241436	Warfare	\N	\N	\N	\N	\N	JER0Fkyy3tw	2025-06-22 21:24:54.883517	https://image.tmdb.org/t/p/original/srj9rYrjefyWqkLc6l2xjTGeBGO.jpg	2025-04-09
23	666154	Kayara	\N	\N	\N	\N	\N	Rvd0zxANttM	2025-06-22 21:24:47.417448	https://image.tmdb.org/t/p/original/tpZdjnoJ6Z3NsSxI6HjAIggrcEv.jpg	2025-01-02
24	1450599	K.O.	\N	\N	\N	\N	\N	7ECPKBH88No	2025-06-22 21:24:47.829507	https://image.tmdb.org/t/p/original/qcM2sUiAeP4zXwx4ADSvgc9S58k.jpg	2025-06-05
19	1289601	Life After Fighting	\N	\N	\N	\N	\N	KMdiYlC_cA8	2025-06-22 21:24:45.515713	https://image.tmdb.org/t/p/original/uKWAk4BHzyEOMmLKUDXoIAPhH36.jpg	2024-06-07
29	170	28 Days Later	\N	\N	\N	\N	\N	mWEhfF27O0c	2025-06-22 21:24:49.893636	https://image.tmdb.org/t/p/original/sQckQRt17VaWbo39GIu0TMOiszq.jpg	2002-10-31
21	1152619	Possessions	\N	\N	\N	\N	\N	-Tx9Op945bQ	2025-06-22 21:24:46.483682	https://image.tmdb.org/t/p/original/39a7zYZvkGfs7EOVVK3dQlWyYJ0.jpg	2024-04-12
39	1022787	Elio	\N	\N	\N	\N	\N	ETVi5_cnnaE	2025-06-22 21:24:54.363781	https://image.tmdb.org/t/p/original/w2ARwtc1zoh0pyfwmyhpZHwuXgK.jpg	2025-06-18
44	82702	How to Train Your Dragon 2	\N	\N	\N	\N	\N	2BP38770KNo	2025-06-22 21:24:56.635819	https://image.tmdb.org/t/p/original/d13Uj86LdbDLrfDoHR5aDOFYyJC.jpg	2014-06-05
49	1232933	Fear Below	\N	\N	\N	\N	\N	\N	2025-06-22 21:24:58.783589	https://image.tmdb.org/t/p/original/obK2G8huZWeAQEgOz1I47AkzHYh.jpg	2025-05-02
26	1315988	Mikaela	\N	\N	\N	\N	\N	iAJcJqPY4zI	2025-06-22 21:24:48.739658	https://image.tmdb.org/t/p/original/xG8olkWOmoW78GbozKbS2UxYGEo.jpg	2025-01-31
22	1017163	The Roundup: Punishment	\N	\N	\N	\N	\N	0phxk3pV6hI	2025-06-22 21:24:46.797464	https://image.tmdb.org/t/p/original/yk38mNoJpsswmk9o7i7eLhO4mc.jpg	2024-04-24
53	7451	xXx	\N	\N	\N	\N	\N	NgPdDDzVhkA	2025-06-22 21:25:00.553691	https://image.tmdb.org/t/p/original/xeEw3eLeSFmJgXZzmF2Efww0q3s.jpg	2002-08-09
37	1241982	Moana 2	\N	\N	\N	\N	\N	hDZ7y8RP5HE	2025-06-22 21:24:53.389722	https://image.tmdb.org/t/p/original/aLVkiINlIeCkcZIzb7XHzPYgO6L.jpg	2024-11-21
27	1180648	Mudbrick	\N	\N	\N	\N	\N	jJ7LHu4W4u8	2025-06-22 21:24:49.109474	https://image.tmdb.org/t/p/original/paVJNyxq5odaAHC9YlmNUlceQpu.jpg	2024-10-10
48	1562	28 Weeks Later	\N	\N	\N	\N	\N	0gGbaXqbAVo	2025-06-22 21:24:58.374292	https://image.tmdb.org/t/p/original/oix0aNv1lvW3nUGspUyvSIBlpbs.jpg	2007-04-26
41	757725	Shadow Force	\N	\N	\N	\N	\N	M7LhGytiHFM	2025-06-22 21:24:55.35765	https://image.tmdb.org/t/p/original/7IEW24vBiZerZrDlgLVSUU3oT1C.jpg	2025-05-01
43	822119	Captain America: Brave New World	\N	\N	\N	\N	\N	1pHDWnXmK7Y	2025-06-22 21:24:56.20991	https://image.tmdb.org/t/p/original/pzIddUEMWhWzfvLI3TwxUG2wGoi.jpg	2025-02-12
36	10191	How to Train Your Dragon	\N	\N	\N	\N	\N	22w7z_lT6YM	2025-06-22 21:24:52.875621	https://image.tmdb.org/t/p/original/ygGmAO60t8GyqUo9xYeYxSZAR3b.jpg	2010-03-18
45	1232546	Until Dawn	\N	\N	\N	\N	\N	2b3vBaINZ7w	2025-06-22 21:24:57.273537	https://image.tmdb.org/t/p/original/juA4IWO52Fecx8lhAsxmDgy3M3.jpg	2025-04-23
50	939243	Sonic the Hedgehog 3	\N	\N	\N	\N	\N	qSu6i2iFMO0	2025-06-22 21:24:59.27	https://image.tmdb.org/t/p/original/d8Ryb8AunYAuycVKDp5HpdWPKgC.jpg	2024-12-19
52	715287	Stepmom's Desire	\N	\N	\N	\N	\N	\N	2025-06-22 21:25:00.131635	https://image.tmdb.org/t/p/original/rYC6UyML4CU4zYiZVbDMrwnGyWW.jpg	2020-05-29
15	1239193	Deep Cover	\N	\N	\N	\N	\N	1x--MaHsbEc	2025-06-22 21:24:43.387674	https://image.tmdb.org/t/p/original/euM8fJvfH28xhjGy25LiygxfkWc.jpg	2025-06-12
56	324544	In the Lost Lands	\N	\N	\N	\N	\N	\N	2025-06-22 21:25:01.855658	https://image.tmdb.org/t/p/original/dDlfjR7gllmr8HTeN6rfrYhTdwX.jpg	2025-02-27
32	1449951	Snow White	\N	\N	\N	\N	\N	iV46TJKL8cU	2025-06-22 21:24:51.275826	https://image.tmdb.org/t/p/original/ilFLHU1OxUS1YDvUMCr8K3hW28r.jpg	2025-03-07
31	1284120	The Ugly Stepsister	\N	\N	\N	\N	\N	\N	2025-06-22 21:24:50.74559	https://image.tmdb.org/t/p/original/crX9rSg9EohybhkEe8iTQUCe55y.jpg	2025-03-07
46	1011477	Karate Kid: Legends	\N	\N	\N	\N	\N	\N	2025-06-22 21:24:57.667572	https://image.tmdb.org/t/p/original/c90Lt7OQGsOmhv6x4JoFdoHzw5l.jpg	2025-05-08
54	166428	How to Train Your Dragon: The Hidden World	\N	\N	\N	\N	\N	\N	2025-06-22 21:25:01.101898	https://image.tmdb.org/t/p/original/xvx4Yhf0DVH8G4LzNISpMfFBDy2.jpg	2019-01-03
28	541671	Ballerina	\N	\N	\N	\N	\N	0FSwsrFpkbw	2025-06-22 21:24:49.463599	https://image.tmdb.org/t/p/original/mKp4euM5Cv3m2U1Vmby3OGwcD5y.jpg	2025-06-04
42	1097311	Echo Valley	\N	\N	\N	\N	\N	KQiZ5zMhliw	2025-06-22 21:24:55.822004	https://image.tmdb.org/t/p/original/3Ey3HuqZdrx1rfxRkfiOXDFtvtl.jpg	2025-06-13
55	1395724	Chijin no Ai	\N	\N	\N	\N	\N	3lLD5BB7APY	2025-06-22 21:25:01.562633	https://image.tmdb.org/t/p/original/fKNBwFKX4VMC73hJr81GpsoUsQO.jpg	2024-11-29
2	552524	Lilo & Stitch	\N	\N	\N	\N	\N	VWqJifMMgZE	2025-06-22 21:24:37.486807	https://image.tmdb.org/t/p/original/c32TsWLES7kL1uy6fF03V67AIYX.jpg	2025-05-17
95	157336	Interstellar	\N	\N	\N	\N	\N	\N	2025-06-22 21:25:18.883292	https://image.tmdb.org/t/p/original/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg	2014-11-05
96	1092506	On Swift Horses	\N	\N	\N	\N	\N	\N	2025-06-22 21:25:19.320732	https://image.tmdb.org/t/p/original/qs2AeWbLklk9I5UbI8bllZVfF2V.jpg	2025-04-24
98	967160	Claudia	\N	\N	\N	\N	\N	\N	2025-06-22 21:25:20.187648	https://image.tmdb.org/t/p/original/d8NYTygRU6ztSuvCdx6VoM5qQpF.jpg	1985-12-12
99	1001414	Fear Street: Prom Queen	\N	\N	\N	\N	\N	\N	2025-06-22 21:25:20.486546	https://image.tmdb.org/t/p/original/gevScWYkF8l5i9NjFSXo8HfPNyy.jpg	2025-05-23
100	823219	Flow	\N	\N	\N	\N	\N	\N	2025-06-22 21:25:20.809482	https://image.tmdb.org/t/p/original/imKSymKBK7o73sajciEmndJoVkR.jpg	2024-08-29
9	1426776	STRAW	\N	\N	\N	\N	\N	k1vWhii4tkE	2025-06-22 21:24:40.84556	https://image.tmdb.org/t/p/original/t3cmnXYtxJb9vVL1ThvT2CWSe1n.jpg	2025-06-05
38	986056	Thunderbolts*	\N	\N	\N	\N	\N	-sAOWhvheK8	2025-06-22 21:24:53.913567	https://image.tmdb.org/t/p/original/hBH50Mkcrc4m8x73CovLmY7vBx1.jpg	2025-04-30
57	1199974	Párvulos: Children of the Apocalypse	\N	\N	\N	\N	\N	mVLk9eTqwUw	2025-06-22 21:25:02.255471	https://image.tmdb.org/t/p/original/pHehmoG3gbTb5RsKWOdxqLmnhpD.jpg	2024-10-18
92	519182	Despicable Me 4	\N	\N	\N	\N	\N	\N	2025-06-22 21:25:17.536683	https://image.tmdb.org/t/p/original/wWba3TaojhK7NdycRhoQpsG0FaH.jpg	2024-06-20
68	1001435	The Future Awaits	\N	\N	\N	\N	\N	GjCXAIOGWEo	2025-06-22 21:25:06.68758	https://image.tmdb.org/t/p/original/nwdpbiDOBumlj5vBMIRQDe2aBBk.jpg	2025-02-26
62	1234821	Jurassic World Rebirth	\N	\N	\N	\N	\N	jan5CFWs9ic	2025-06-22 21:25:04.229508	https://image.tmdb.org/t/p/original/q0fGCmjLu42MPlSO9OYWpI5w86I.jpg	2025-07-01
91	933260	The Substance	\N	\N	\N	\N	\N	\N	2025-06-22 21:25:17.089499	https://image.tmdb.org/t/p/original/cGm2qnmXx9tFabmzEIkJZjCJdQd.jpg	2024-09-07
65	762509	Mufasa: The Lion King	\N	\N	\N	\N	\N	\N	2025-06-22 21:25:05.424928	https://image.tmdb.org/t/p/original/lurEK87kukWNaHd0zYnsi3yzJrs.jpg	2024-12-18
72	950396	The Gorge	\N	\N	\N	\N	\N	\N	2025-06-22 21:25:08.693511	https://image.tmdb.org/t/p/original/7iMBZzVZtG0oBug4TfqDb9ZxAOa.jpg	2025-02-13
73	912649	Venom: The Last Dance	\N	\N	\N	\N	\N	\N	2025-06-22 21:25:09.262983	https://image.tmdb.org/t/p/original/vGXptEdgZIhPg3cGlc7e8sNPC2e.jpg	2024-10-22
89	259872	Skin. Like. Sun.	\N	\N	\N	\N	\N	\N	2025-06-22 21:25:16.345795	https://image.tmdb.org/t/p/original/uCkANtG6ezb7hjRKVudY3PUcbvn.jpg	2009-10-10
94	1156593	Your Fault	\N	\N	\N	\N	\N	\N	2025-06-22 21:25:18.494703	https://image.tmdb.org/t/p/original/1sQA7lfcF9yUyoLYC0e6Zo3jmxE.jpg	2024-12-26
71	975615	Words of War	\N	\N	\N	\N	\N	EZe1lnGXsnM	2025-06-22 21:25:08.228612	https://image.tmdb.org/t/p/original/fszN3PSB40FYsFzkHvNZrXLes0M.jpg	2025-05-02
59	1411773	The Last Stand of Ellen Cole	\N	\N	\N	\N	\N	\N	2025-06-22 21:25:02.999647	https://image.tmdb.org/t/p/original/oq1pGVQ2t3Cy4v7sA4LRhNjtZuJ.jpg	2024-10-18
70	1124620	The Monkey	\N	\N	\N	\N	\N	\N	2025-06-22 21:25:07.835643	https://image.tmdb.org/t/p/original/yYa8Onk9ow7ukcnfp2QWVvjWYel.jpg	2025-02-14
86	1184918	The Wild Robot	\N	\N	\N	\N	\N	\N	2025-06-22 21:25:15.035647	https://image.tmdb.org/t/p/original/wTnV3PCVW5O92JMrFvvrRcV39RU.jpg	2024-09-12
79	896536	The Legend of Ochi	\N	\N	\N	\N	\N	_jTFLg3arYU	2025-06-22 21:25:12.145756	https://image.tmdb.org/t/p/original/wVujUVvY4qvKARAslItQ4ARKqtz.jpg	2025-04-18
77	977294	Tin Soldier	\N	\N	\N	\N	\N	7To77DrOWDM	2025-06-22 21:25:11.317527	https://image.tmdb.org/t/p/original/lFFDrFLXywFhy6khHes1LCFVMsL.jpg	2025-05-22
64	947891	My Old Ass	\N	\N	\N	\N	\N	Yvks3SeCDOs	2025-06-22 21:25:05.049906	https://image.tmdb.org/t/p/original/yUs4Sw9AyTg2sA1qWBkNpD2mGSj.jpg	2024-09-13
87	568770	The Containment	\N	\N	\N	\N	\N	DQABsTClMPs	2025-06-22 21:25:15.483525	https://image.tmdb.org/t/p/original/nHNwBOccmQ7rK9yQI1HUSnHm1Ny.jpg	2025-06-05
66	1257960	Sikandar	\N	\N	\N	\N	\N	\N	2025-06-22 21:25:05.91951	https://image.tmdb.org/t/p/original/41s42CRXafa3OuRGvCtfYPEBmse.jpg	2025-03-29
82	1233069	Exterritorial	\N	\N	\N	\N	\N	tlLsFEDHtWs	2025-06-22 21:25:13.477444	https://image.tmdb.org/t/p/original/qWTfHG8KdXwr0bqypYbNZLenh0J.jpg	2025-04-29
80	1160956	Panda Plan	\N	\N	\N	\N	\N	ksls6lIiSPg	2025-06-22 21:25:12.55894	https://image.tmdb.org/t/p/original/8iMPQl13q89jQhaA5nXb6UiT0t0.jpg	2024-10-01
180	1428264	Semi-Soeter	\N	\N	\N	\N	\N	vCir0XLyoBw	2025-06-24 12:37:27.526969	https://image.tmdb.org/t/p/original/xTJXvW3u16MwMwGYnG1k2R96zYS.jpg	2025-06-19
85	1040159	My Massive Cock	\N	\N	\N	\N	\N	\N	2025-06-22 21:25:14.741681	https://image.tmdb.org/t/p/original/9JQHViS8uugeWKfFsnEj3xTB2dZ.jpg	2022-10-24
69	1421982	Kiff Lore of the Ring Light	\N	\N	\N	\N	\N	jC79CcFGqi4	2025-06-22 21:25:07.16264	https://image.tmdb.org/t/p/original/tfdzBx8on6mHdXusi08ZEEPSFqx.jpg	2025-01-21
81	589018	Savages	\N	\N	\N	\N	\N	jDZSt_MhU4Q	2025-06-22 21:25:12.941469	https://image.tmdb.org/t/p/original/qC6yrKvmIEnkFVjpp0U7u02SiDQ.jpg	2024-10-16
60	1396122	Taandob	\N	\N	\N	\N	\N	2S8x4hIbbK4	2025-06-22 21:25:03.361553	https://image.tmdb.org/t/p/original/iplMLlXU1BgmTz4xviILTOlECYL.jpg	2025-06-07
83	1426680	Our Times	\N	\N	\N	\N	\N	R-i2dtOSqKA	2025-06-22 21:25:13.893569	https://image.tmdb.org/t/p/original/t0AEaR2N7ZqMJuROWTYShOOkm3o.jpg	2025-06-09
75	533535	Deadpool & Wolverine	\N	\N	\N	\N	\N	\N	2025-06-22 21:25:10.213605	https://image.tmdb.org/t/p/original/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg	2024-07-24
74	1219555	Wunderschöner	\N	\N	\N	\N	\N	jqNtBSk3wfg	2025-06-22 21:25:09.691615	https://image.tmdb.org/t/p/original/aPJVxNLNffSeiEgJPo1b3yAkZP2.jpg	2025-02-13
90	1241894	Woodwalkers	\N	\N	\N	\N	\N	_Z1iwECnjeA	2025-06-22 21:25:16.721573	https://image.tmdb.org/t/p/original/bC1r04ohuxv5feaGDzQ0lXz7Bbl.jpg	2024-10-17
93	668489	Havoc	\N	\N	\N	\N	\N	\N	2025-06-22 21:25:18.043555	https://image.tmdb.org/t/p/original/ubP2OsF3GlfqYPvXyLw9d78djGX.jpg	2025-04-25
97	980477	Ne Zha 2	\N	\N	\N	\N	\N	\N	2025-06-22 21:25:19.729557	https://image.tmdb.org/t/p/original/293Mo4GWf7Tl0TfAr5NFghqeMy7.jpg	2025-01-29
84	1136867	Materialists	\N	\N	\N	\N	\N	4A_kmjtsJ7c	2025-06-22 21:25:14.381508	https://image.tmdb.org/t/p/original/eDo0pNruy0Qgj6BdTyHIR4cxHY8.jpg	2025-06-12
88	1303162	Cells at Work!	\N	\N	\N	\N	\N	VKzbpeFLXTk	2025-06-22 21:25:15.855561	https://image.tmdb.org/t/p/original/kr67sOdZFPimMYLAmg6eTembFVQ.jpg	2024-12-13
58	11544	Lilo & Stitch	\N	\N	\N	\N	\N	\N	2025-06-22 21:25:02.563578	https://image.tmdb.org/t/p/original/d73UqZWyw3MUMpeaFcENgLZ2kWS.jpg	2002-06-21
78	1094473	Bambi: A Life in the Woods	\N	\N	\N	\N	\N	\N	2025-06-22 21:25:11.677508	https://image.tmdb.org/t/p/original/vWNVHtwOhcoOEUSrY1iHRGbgH8O.jpg	2024-10-16
76	1022789	Inside Out 2	\N	\N	\N	\N	\N	\N	2025-06-22 21:25:10.833498	https://image.tmdb.org/t/p/original/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg	2024-06-11
63	911430	F1 The Movie	\N	\N	\N	\N	\N	CT2_P2DZBR0	2025-06-22 21:25:04.647933	https://image.tmdb.org/t/p/original/9JePWGvgg1t4BOojyZEVQdOWjXO.jpg	2025-06-23
20	1379587	Utopia	\N	\N	\N	\N	\N	Jz9YG3xGXOw	2025-06-22 21:24:45.949155	https://image.tmdb.org/t/p/original/yef0tY1Nw3BX8PJTfBLieqHj5Hw.jpg	2024-12-09
30	1197306	A Working Man	\N	\N	\N	\N	\N	zTbgNC42Ops	2025-06-22 21:24:50.329562	https://image.tmdb.org/t/p/original/6FRFIogh3zFnVWn7Z6zcYnIbRcX.jpg	2025-03-26
67	611251	Jokōsei torio: seikan shiken	\N	\N	\N	\N	\N	J4_XKYtukz8	2025-06-22 21:25:06.321746	https://image.tmdb.org/t/p/original/9GSLrU0aoR6Pi2FQ0ttXV2thSxJ.jpg	1977-02-23
51	1010581	My Fault	\N	\N	\N	\N	\N	PaB7cGBuCP0	2025-06-22 21:24:59.733535	https://image.tmdb.org/t/p/original/w46Vw536HwNnEzOa7J24YH9DPRS.jpg	2023-06-08
61	1061474	Superman	\N	\N	\N	\N	\N	\N	2025-06-22 21:25:03.765493	https://image.tmdb.org/t/p/original/ombsmhYUqR4qqOLOxAyr5V8hbyv.jpg	2025-07-09
195	1126166	Flight Risk	\N	\N	\N	\N	\N	ojC9JBuccJA	2025-06-24 12:37:36.735085	https://image.tmdb.org/t/p/original/q0bCG4NX32iIEsRFZqRtuvzNCyZ.jpg	2025-01-22
197	1297028	Rosario	\N	\N	\N	\N	\N	73VIABLRw2k	2025-06-24 12:37:38.076584	https://image.tmdb.org/t/p/original/beLZhuHT97849WkWgty2X1hkWUa.jpg	2025-05-01
199	558449	Gladiator II	\N	\N	\N	\N	\N	4rgYUipGJNo	2025-06-24 12:37:39.294841	https://image.tmdb.org/t/p/original/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg	2024-11-13
1	574475	Final Destination Bloodlines	\N	\N	\N	\N	\N	UWMzKXsY9A4	2025-06-22 21:24:37.099848	https://image.tmdb.org/t/p/original/6WxhEvFsauuACfv8HyoVX6mZKFj.jpg	2025-05-14
206	1090007	First Shift	\N	\N	\N	\N	\N	j9NVJ8Cbm-s	2025-06-30 09:33:32.666332	https://image.tmdb.org/t/p/original/ajsGI4JYaciPIe3gPgiJ3Vw5Vre.jpg	2024-08-30
212	1412113	Squid Game: Making Season 2	\N	\N	\N	\N	\N	Ed1sGgHUo88	2025-06-30 09:33:39.140859	https://image.tmdb.org/t/p/original/yQGaui0bQ5Ai3KIFBB45nTeIqad.jpg	2025-01-02
218	1408248	Squid Game: Fireplace	\N	\N	\N	\N	\N	yw1U8J2lRr0	2025-06-30 09:33:46.021228	https://image.tmdb.org/t/p/original/cIIMvxLztRs1MbXH0oqaw3SGV0q.jpg	2024-12-12
219	82690	Wreck-It Ralph	\N	\N	\N	\N	\N	87E6N7ToCxs	2025-06-30 09:33:46.746821	https://image.tmdb.org/t/p/original/zWoIgZ7mgmPkaZjG0102BSKFIqQ.jpg	2012-11-01
222	1071585	M3GAN 2.0	\N	\N	\N	\N	\N	IYLHdEzsk1s	2025-06-30 09:33:50.341047	https://image.tmdb.org/t/p/original/lHChxm7sv3gWR2qz5PwjdxcXQf7.jpg	2025-06-25
226	1363224	Fear Cabin: The Last Weekend of Summer	\N	\N	\N	\N	\N	5U_RjQ-43hw	2025-06-30 09:33:55.146059	https://image.tmdb.org/t/p/original/gaSqrnpSnTq5oYno0KnDyDXAF5r.jpg	2024-09-27
228	1214667	Making Squid Game: The Challenge	\N	\N	\N	\N	\N	oaWKP2XKqHU	2025-06-30 09:33:56.666386	https://image.tmdb.org/t/p/original/78yTLvtsMntVN1cLfzBuZj870pe.jpg	2023-12-06
231	1018990	Continent	\N	\N	\N	\N	\N	y3FzXBkCUAg	2025-06-30 09:33:59.621718	https://image.tmdb.org/t/p/original/eZnG8rLgRDAbDxnw5nDDp7dJZ43.jpg	2024-07-18
234	1137350	The Phoenician Scheme	\N	\N	\N	\N	\N	GEuMnPl2WI4	2025-06-30 09:34:02.820844	https://image.tmdb.org/t/p/original/jtEqpy0K1iVuCebRwWqT6BZ6jLN.jpg	2025-05-23
240	1470736	Open	\N	\N	\N	\N	\N	JIdV-YurOJM	2025-06-30 09:34:09.871512	https://image.tmdb.org/t/p/original/A7TXvimVRgGiKsviUopqPLr3fY1.jpg	2025-06-14
244	1470086	Ligaw	\N	\N	\N	\N	\N	TgrKFwL4mUk	2025-06-30 09:34:14.101178	https://image.tmdb.org/t/p/original/yc8V3KEnhvPrzXpdYTXdTvjpOb5.jpg	2025-05-09
248	584855	Fierce Town	\N	\N	\N	\N	\N	-2e8SYmofZM	2025-06-30 09:34:17.545862	https://image.tmdb.org/t/p/original/vYiq2eZKASt3YAbiVX8xpolZisG.jpg	2025-01-30
263	812455	Victoria	\N	\N	\N	\N	\N	Kp8wcV3GjW0	2025-06-30 09:34:35.465953	https://image.tmdb.org/t/p/original/aOSTW7ZitFAff06mZVXUnktejHY.jpg	2021-01-16
265	1380682	The Last Rodeo	\N	\N	\N	\N	\N	\N	2025-06-30 09:34:36.906273	https://image.tmdb.org/t/p/original/cpATW9o83IwYqPkiT7WLqL2jxlF.jpg	2025-05-22
270	1245399	Hola Frida!	\N	\N	\N	\N	\N	\N	2025-06-30 09:34:40.505912	https://image.tmdb.org/t/p/original/hY8TslXAaJD0cytxifrhy6h5cJl.jpg	2025-02-12
275	1414272	Belyas	\N	\N	\N	\N	\N	\N	2025-06-30 09:34:44.821617	https://image.tmdb.org/t/p/original/zPIaNQaQKtCIOs95x4GmaJ6omco.jpg	2025-02-07
279	1377424	Victoria	\N	\N	\N	\N	\N	\N	2025-06-30 09:34:47.546119	https://image.tmdb.org/t/p/original/hw09PdM2o7pF1zxn1pM8NTMPzno.jpg	2024-12-14
200	1084199	Companion	\N	\N	\N	\N	\N	\N	2025-06-24 12:37:39.911728	https://image.tmdb.org/t/p/original/oCoTgC3UyWGfyQ9thE10ulWR7bn.jpg	2025-01-22
285	872585	Oppenheimer	\N	\N	\N	\N	\N	\N	2025-06-30 09:34:51.86109	https://image.tmdb.org/t/p/original/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg	2023-07-19
287	1365103	Marriage Unplugged	\N	\N	\N	\N	\N	\N	2025-06-30 09:34:53.301147	https://image.tmdb.org/t/p/original/3H99Wl52sBPRqXZ3LJjgODOLfwX.jpg	2024-10-28
288	462183	Wild Awakening	\N	\N	\N	\N	\N	\N	2025-06-30 09:34:53.621188	https://image.tmdb.org/t/p/original/jD9MILmkIeBBoFJbOjHAaCQ3sEA.jpg	2016-10-23
291	1477114	Sorority	\N	\N	\N	\N	\N	\N	2025-06-30 09:34:55.702099	https://image.tmdb.org/t/p/original/zibf9SwgiEW7Od5kwdRLSoQygRd.jpg	2025-06-20
295	1011985	Kung Fu Panda 4	\N	\N	\N	\N	\N	\N	2025-06-30 09:34:59.060764	https://image.tmdb.org/t/p/original/nqXsAaQsKw2gKpkfhIgjXNDRqg7.jpg	2024-03-02
298	617126	The Fantastic Four: First Steps	\N	\N	\N	\N	\N	\N	2025-06-30 09:35:02.101119	https://image.tmdb.org/t/p/original/x26MtUlwtWD26d0G0FXcppxCJio.jpg	2025-07-23
\.


--
-- Data for Name: series; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.series (series_id, tmdb_id, name, description, first_air_date, finale_date, is_popular, average_rating, youtube_video_id, created_at, poster_url) FROM stdin;
50	18165	The Vampire Diaries	\N	2009-09-10	\N	\N	\N	\N	2025-06-22 21:25:41.08591	https://image.tmdb.org/t/p/original/b3vl6wV1W8PBezFfntKTrhrehCY.jpg
6	61818	Late Night with Seth Meyers	\N	2014-02-25	\N	\N	\N	\N	2025-06-22 21:25:24.875561	https://image.tmdb.org/t/p/original/rw0QaegwgKbRoB2CZe2lfewltT9.jpg
9	63770	The Late Show with Stephen Colbert	\N	2015-09-08	\N	\N	\N	\N	2025-06-22 21:25:25.838082	https://image.tmdb.org/t/p/original/9jkThAGYj2yp8jsS6Nriy5mzKFT.jpg
29	1966	Horizon	\N	1964-02-04	\N	\N	\N	\N	2025-06-22 21:25:32.761514	https://image.tmdb.org/t/p/original/uX8pic7asQBdnwMB9QjPvTsn1Dw.jpg
52	14944	Robert Montgomery Presents	\N	1950-01-30	\N	\N	\N	\N	2025-06-22 21:25:41.667462	https://image.tmdb.org/t/p/original/jZLS9pS4JGltYIB43c2UvXhqZqW.jpg
15	4385	The Colbert Report	\N	2005-10-17	\N	\N	\N	\N	2025-06-22 21:25:27.808509	https://image.tmdb.org/t/p/original/pn2CVXjOlR8kY5MgOTJjZ71IM0Q.jpg
40	3670	Cops	\N	1989-03-11	\N	\N	\N	\N	2025-06-22 21:25:37.360619	https://image.tmdb.org/t/p/original/nUsdcwmoYP4DiZtJcAWkpxjRnay.jpg
5	59941	The Tonight Show Starring Jimmy Fallon	\N	2014-02-17	\N	\N	\N	\N	2025-06-22 21:25:24.548427	https://image.tmdb.org/t/p/original/g4amxJvtpnY79J77xeamnAEUO8r.jpg
13	72879	Tomorrow Is Ours	\N	2017-07-17	\N	\N	\N	\N	2025-06-22 21:25:27.038718	https://image.tmdb.org/t/p/original/zMWldNZF0wS3L5XkDVFHxYhclcL.jpg
3	2224	The Daily Show	\N	1996-07-22	\N	\N	\N	\N	2025-06-22 21:25:23.807463	https://image.tmdb.org/t/p/original/ixcfyK7it6FjRM36Te4OdblAq4X.jpg
44	279060	Chespirito: Not Really on Purpose	\N	2025-06-05	\N	\N	\N	\N	2025-06-22 21:25:38.903451	https://image.tmdb.org/t/p/original/gNc8wna9IjIDUxtSeqLrjOjCpRe.jpg
18	32726	Bob's Burgers	\N	2011-01-09	\N	\N	\N	\N	2025-06-22 21:25:28.795578	https://image.tmdb.org/t/p/original/yVz5foNr6nCfathj0igg8RLVGfn.jpg
49	112470	Ici tout commence	\N	2020-11-02	\N	\N	\N	\N	2025-06-22 21:25:40.743608	https://image.tmdb.org/t/p/original/x9HeaagUAyyGl1fQ6exQcpELBxP.jpg
2	22980	Watch What Happens Live with Andy Cohen	\N	2009-07-16	\N	\N	\N	\N	2025-06-22 21:25:23.424087	https://image.tmdb.org/t/p/original/onSD9UXfJwrMXWhq7UY7hGF2S1h.jpg
27	12415	Egoli: Place of Gold	\N	1992-04-06	\N	\N	\N	\N	2025-06-22 21:25:32.1257	https://image.tmdb.org/t/p/original/5X0SWyNJ5IjN9YSXlbHBOVMzh1G.jpg
11	30957	The Amazing Race	\N	2001-09-05	\N	\N	\N	\N	2025-06-22 21:25:26.495805	https://image.tmdb.org/t/p/original/x1jq0atcQg6UkaZpco0kFL6QHuM.jpg
12	70558	NPR Tiny Desk Concerts	\N	2008-04-22	\N	\N	\N	\N	2025-06-22 21:25:26.77773	https://image.tmdb.org/t/p/original/sJ6HdzajIVkC5G2kRROhNu8at43.jpg
48	32798	Hawaii Five-0	\N	2010-09-20	\N	\N	\N	\N	2025-06-22 21:25:40.389523	https://image.tmdb.org/t/p/original/sIdCKlmM2nU4akIvFQaAIiU8YES.jpg
24	3508	Anderson Cooper 360°	\N	2003-09-08	\N	\N	\N	\N	2025-06-22 21:25:31.000492	https://image.tmdb.org/t/p/original/fi7KWbkJq3MirP32nsYOPQIc3oJ.jpg
35	60572	Pokémon	\N	1997-04-01	\N	\N	\N	\N	2025-06-22 21:25:35.317348	https://image.tmdb.org/t/p/original/rOuGm07PxBhEsK9TaGPRQVJQm1X.jpg
23	62223	The Late Late Show with James Corden	\N	2015-03-23	\N	\N	\N	\N	2025-06-22 21:25:30.749431	https://image.tmdb.org/t/p/original/qPmVoG8G9tc1nN8ZwGV2zYcknit.jpg
28	68921	WWE 205 Live	\N	2016-11-29	\N	\N	\N	\N	2025-06-22 21:25:32.421616	https://image.tmdb.org/t/p/original/f6NlvoEJH8KxQI58ecTBkcsbQVF.jpg
34	4606	Garfield and Friends	\N	1988-09-17	\N	\N	\N	\N	2025-06-22 21:25:34.889545	https://image.tmdb.org/t/p/original/3HyTfZ9sSCoZPYrYHMffhRVm3Af.jpg
30	236443	Getroud met Rugby: Die Sepie	\N	2016-04-04	\N	\N	\N	\N	2025-06-22 21:25:33.066443	https://image.tmdb.org/t/p/original/sBp8JBN38AanXyuX4yT3SDuoieY.jpg
33	45140	Teen Titans Go!	\N	2013-04-23	\N	\N	\N	\N	2025-06-22 21:25:34.3671	https://image.tmdb.org/t/p/original/udaLIJ6Na7GOHjvTlyP9JFPTccv.jpg
37	952	The Adventures of Ozzie and Harriet	\N	1952-10-03	\N	\N	\N	\N	2025-06-22 21:25:36.167241	https://image.tmdb.org/t/p/original/h9Kqsng08I3CtA5m2GVq52NVUIL.jpg
31	153485	Sazae-san	\N	1969-10-14	\N	\N	\N	\N	2025-06-22 21:25:33.319471	https://image.tmdb.org/t/p/original/sR3tqK13hhpohIfnpd2z3HkpnUb.jpg
51	14750	Na Wspólnej	\N	2003-01-27	\N	\N	\N	\N	2025-06-22 21:25:41.403157	https://image.tmdb.org/t/p/original/uksRhdaOn64bO5d33d7rcTbrhJI.jpg
43	1220	The Graham Norton Show	\N	2007-02-22	\N	\N	\N	\N	2025-06-22 21:25:38.539453	https://image.tmdb.org/t/p/original/vrbqaBXB8AALynQzpWz6JdCPEJS.jpg
39	37606	The Amazing World of Gumball	\N	2011-05-03	\N	\N	\N	\N	2025-06-22 21:25:36.819196	https://image.tmdb.org/t/p/original/VYnnyA2hyxi3VUPgCA71mMtt69.jpg
19	4057	Criminal Minds	\N	2005-09-22	\N	\N	\N	\N	2025-06-22 21:25:29.187534	https://image.tmdb.org/t/p/original/wLMQebhTApmn4F6Fzg6FovdwVvL.jpg
41	79744	The Rookie	\N	2018-10-16	\N	\N	\N	\N	2025-06-22 21:25:37.655346	https://image.tmdb.org/t/p/original/bL1mwXDnH5fCxqc4S2n40hoVyoe.jpg
38	11366	Big Brother	\N	2000-07-18	\N	\N	\N	\N	2025-06-22 21:25:36.546384	https://image.tmdb.org/t/p/original/cx0YldpEMh1EBpwwdgY1Awcg6ty.jpg
36	41149	Die Rosenheim-Cops	\N	2002-01-09	\N	\N	\N	\N	2025-06-22 21:25:35.757473	https://image.tmdb.org/t/p/original/kAhi0xY6gIEMvHtmChC44pBwOWG.jpg
32	65733	Doraemon	\N	2005-04-22	\N	\N	\N	\N	2025-06-22 21:25:33.727315	https://image.tmdb.org/t/p/original/9ZN1P32SHviL3SV51qLivxycvcx.jpg
4	498	Late Show with David Letterman	\N	1993-08-30	\N	\N	\N	\N	2025-06-22 21:25:24.167778	https://image.tmdb.org/t/p/original/fTBC5EpsgKmli9VQcJMtqQ08Qj4.jpg
17	82873	The Kelly Clarkson Show	\N	2019-09-09	\N	\N	\N	\N	2025-06-22 21:25:28.527174	https://image.tmdb.org/t/p/original/sBix25bie9UQFzbarN51DpFO5ky.jpg
46	132791	SUPERKID	\N	1983-04-04	\N	\N	\N	\N	2025-06-22 21:25:39.541535	https://image.tmdb.org/t/p/original/lCGbsqKiOvRICllC4AgZ67zjrSL.jpg
25	1399	Game of Thrones	\N	2011-04-17	\N	\N	\N	\N	2025-06-22 21:25:31.297713	https://image.tmdb.org/t/p/original/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg
21	331	America's Next Top Model	\N	2003-05-20	\N	\N	\N	\N	2025-06-22 21:25:30.035886	https://image.tmdb.org/t/p/original/47EIfjYrT80AOfpAIkvSxdpwGOv.jpg
20	224	Match of the Day	\N	1964-08-22	\N	\N	\N	\N	2025-06-22 21:25:29.673756	https://image.tmdb.org/t/p/original/paRFRd11WlFOxVbGnzjjCBym7FW.jpg
14	2261	The Tonight Show Starring Johnny Carson	\N	1962-10-01	\N	\N	\N	\N	2025-06-22 21:25:27.437458	https://image.tmdb.org/t/p/original/uSvET5YUvHNDIeoCpErrbSmasFb.jpg
53	502	Sesame Street	\N	1969-11-10	\N	\N	\N	\N	2025-06-22 21:25:41.959805	https://image.tmdb.org/t/p/original/14k9BfZ2p4rQBMeJ5crKTfUZVwD.jpg
45	8621	Late Night with Jimmy Fallon	\N	2009-03-02	\N	\N	\N	\N	2025-06-22 21:25:39.269547	https://image.tmdb.org/t/p/original/l8WzbOr7vg3WDlB3hoy32wZDxwj.jpg
7	65701	Good Mythical Morning	\N	2012-01-09	\N	\N	\N	\N	2025-06-22 21:25:25.197934	https://image.tmdb.org/t/p/original/jMpBQr2aNOFAI6wsC47zsOG6qOh.jpg
22	2394	This Old House	\N	1979-01-01	\N	\N	\N	\N	2025-06-22 21:25:30.427565	https://image.tmdb.org/t/p/original/ecAOX4esywAXLF5I4X2gaTmhmAG.jpg
26	1431	CSI: Crime Scene Investigation	\N	2000-10-06	\N	\N	\N	\N	2025-06-22 21:25:31.647638	https://image.tmdb.org/t/p/original/i5hmoRjHNWady4AtAGICTUXknKH.jpg
10	14981	The Late Late Show with Craig Ferguson	\N	2005-01-03	\N	\N	\N	\N	2025-06-22 21:25:26.149566	https://image.tmdb.org/t/p/original/gGC7zSDgG0FY0MbM1pjfhTCWQBI.jpg
42	32415	Conan	\N	2010-11-08	\N	\N	\N	\N	2025-06-22 21:25:38.111403	https://image.tmdb.org/t/p/original/oQxrvUhP3ycwnlxIrIMQ9Z3kleq.jpg
8	1416	Grey's Anatomy	\N	2005-03-27	\N	\N	\N	\N	2025-06-22 21:25:25.501498	https://image.tmdb.org/t/p/original/7jEVqXC14bhfAzSPgr896dMdDv6.jpg
71	115992	The Damage Report with John Iadarola	\N	2018-11-28	\N	\N	\N	\N	2025-06-22 21:25:48.159488	https://image.tmdb.org/t/p/original/ckJWPg2f9F0oJSvjInHi4Mk6Lrz.jpg
74	46952	The Blacklist	\N	2013-09-23	\N	\N	\N	\N	2025-06-22 21:25:49.174511	https://image.tmdb.org/t/p/original/4HTfd1PhgFUenJxVuBDNdLmdr0c.jpg
77	10534	The Red Skelton Show	\N	1951-09-30	\N	\N	\N	\N	2025-06-22 21:25:50.271472	https://image.tmdb.org/t/p/original/6e54gnblIDcwDGOGhzPyV0fB6Rw.jpg
82	106	The Andy Griffith Show	\N	1960-10-03	\N	\N	\N	\N	2025-06-22 21:25:52.331545	https://image.tmdb.org/t/p/original/smOam7qXPnqlfDlMx4I0UxK5ULB.jpg
84	64190	Volle Kanne	\N	1999-08-30	\N	\N	\N	\N	2025-06-22 21:25:52.973559	\N
85	1877	Phineas and Ferb	\N	2007-08-17	\N	\N	\N	\N	2025-06-22 21:25:53.279508	https://image.tmdb.org/t/p/original/g6TidT7be954rrzPPBTIXkSmfXj.jpg
86	15226	C.I.D.	\N	1998-01-21	\N	\N	\N	\N	2025-06-22 21:25:53.769534	https://image.tmdb.org/t/p/original/26uEr3docGiJVEDlqepAjf99Vlq.jpg
88	14686	Alles was zählt	\N	2006-09-04	\N	\N	\N	\N	2025-06-22 21:25:54.669365	https://image.tmdb.org/t/p/original/2qup6w78HhDiSii7v8vYgfEsz6E.jpg
92	2122	King of the Hill	\N	1997-01-12	\N	\N	\N	\N	2025-06-22 21:25:56.39959	https://image.tmdb.org/t/p/original/3MnkwPdqQ4if7HL4rYTy6eUyq8q.jpg
93	61923	Star vs. the Forces of Evil	\N	2015-01-18	\N	\N	\N	\N	2025-06-22 21:25:56.88456	https://image.tmdb.org/t/p/original/dKFL1AOdKNoazqZDg1zq2z69Lx1.jpg
94	580	Star Trek: Deep Space Nine	\N	1993-01-03	\N	\N	\N	\N	2025-06-22 21:25:57.403568	https://image.tmdb.org/t/p/original/vE6138ykaEXQkCSEHyuBIgfGlUZ.jpg
95	44006	Chicago Fire	\N	2012-10-10	\N	\N	\N	\N	2025-06-22 21:25:57.789474	https://image.tmdb.org/t/p/original/8IN24YxfyHMBhY1RNw7ctGUZ1JI.jpg
96	57532	PAW Patrol	\N	2013-08-12	\N	\N	\N	\N	2025-06-22 21:25:58.112502	https://image.tmdb.org/t/p/original/9S65uEjDqepU7d71CNmxIBHHdo.jpg
97	32390	The Real Housewives of Beverly Hills	\N	2010-10-14	\N	\N	\N	\N	2025-06-22 21:25:58.515756	https://image.tmdb.org/t/p/original/gHZmEmtQzobW9PVdpGrYP7SU9RH.jpg
100	112527	Obake no Q-tarō	\N	1985-04-01	\N	\N	\N	\N	2025-06-22 21:25:59.360281	https://image.tmdb.org/t/p/original/acb9g0rlsFhy3LBPDvMF7Tso9Q0.jpg
56	20598	White Lies	\N	1997-10-27	\N	\N	\N	\N	2025-06-22 21:25:42.938456	\N
91	63069	The Johannes B. Kerner Show	\N	1998-01-22	\N	\N	\N	\N	2025-06-22 21:25:56.117517	\N
72	2304	Thomas & Friends	\N	1984-10-09	\N	\N	\N	\N	2025-06-22 21:25:48.445823	https://image.tmdb.org/t/p/original/ovJvWQ8E8aYShcRlTwpqKhuq7FA.jpg
162	37678	The Voice	\N	2011-04-26	\N	\N	\N	\N	2025-06-24 12:37:58.858568	https://image.tmdb.org/t/p/original/8jgjykcCuQ5rYreyqba4mazNKYd.jpg
55	1622	Supernatural	\N	2005-09-13	\N	\N	\N	\N	2025-06-22 21:25:42.547472	https://image.tmdb.org/t/p/original/KoYWXbnYuS3b0GyQPkbuexlVK9.jpg
63	17610	NCIS: Los Angeles	\N	2009-09-22	\N	\N	\N	\N	2025-06-22 21:25:45.347469	https://image.tmdb.org/t/p/original/TIIgcznwNfNr3KOZvxn26eKV99.jpg
144	60554	Star Wars Rebels	\N	2014-10-13	\N	\N	\N	\N	2025-06-24 12:37:53.636689	https://image.tmdb.org/t/p/original/jmgR8330sKEJehr27rQ3bODnrlP.jpg
59	2637	Come Dine with Me	\N	2005-01-10	\N	\N	\N	\N	2025-06-22 21:25:43.938486	https://image.tmdb.org/t/p/original/enFfviWZwnIKn9DhyMa7cXqKx6Q.jpg
57	1025	The Bullwinkle Show	\N	1959-11-19	\N	\N	\N	\N	2025-06-22 21:25:43.207518	https://image.tmdb.org/t/p/original/cAMWBJyYynFWxJNrIvVnHlN2e9P.jpg
60	36062	Best Friends	\N	2007-09-03	\N	\N	\N	\N	2025-06-22 21:25:44.222193	https://image.tmdb.org/t/p/original/2bH7QQ7WQfnbt1CWiX8BE5E2V4t.jpg
69	4384	Frontline	\N	1983-01-17	\N	\N	\N	\N	2025-06-22 21:25:47.405532	https://image.tmdb.org/t/p/original/5Va5SzbaJe5Wd64caWfzspSA92L.jpg
78	6489	Klan	\N	1997-09-22	\N	\N	\N	\N	2025-06-22 21:25:50.697703	https://image.tmdb.org/t/p/original/vuSKqHmKLrKG2AYFOyQ4Ci9wTAj.jpg
159	4238	The King of Queens	\N	1998-09-21	\N	\N	\N	\N	2025-06-24 12:37:57.934455	https://image.tmdb.org/t/p/original/vXs300Yvjy4Kr0iHgBtajHkYbAt.jpg
98	14447	L for Love	\N	2000-11-04	\N	\N	\N	\N	2025-06-22 21:25:58.789643	\N
70	10536	The Mike Douglas Show	\N	1961-12-11	\N	\N	\N	\N	2025-06-22 21:25:47.745391	https://image.tmdb.org/t/p/original/qNk97cbF3dZyhkfIcJhjFDD64sM.jpg
153	14658	Survivor	\N	2000-05-31	\N	\N	\N	\N	2025-06-24 12:37:56.296995	https://image.tmdb.org/t/p/original/1usR1nanbDvnc0LJlWd5TOylT9M.jpg
62	4496	Meet the Press	\N	1947-11-06	\N	\N	\N	\N	2025-06-22 21:25:45.035554	https://image.tmdb.org/t/p/original/lisjDmT2xTykSZxCNvd7E3gQ9AI.jpg
166	79917	Bares für Rares	\N	2013-08-04	\N	\N	\N	\N	2025-06-24 12:37:59.878924	https://image.tmdb.org/t/p/original/j9SzcU00nl64FdgLs4otaHBfRkj.jpg
167	2288	Prison Break	\N	2005-08-29	\N	\N	\N	\N	2025-06-24 12:38:00.190222	https://image.tmdb.org/t/p/original/5E1BhkCgjLBlqx557Z5yzcN0i88.jpg
99	9890	The Dick Cavett Show	\N	1968-06-06	\N	\N	\N	\N	2025-06-22 21:25:59.066126	https://image.tmdb.org/t/p/original/uDkndfnwbEGeSY4YmZbTRg4U5RQ.jpg
76	22073	Good Day Live	\N	2001-09-17	\N	\N	\N	\N	2025-06-22 21:25:49.989609	\N
89	456	The Simpsons	\N	1989-12-17	\N	\N	\N	\N	2025-06-22 21:25:55.08247	https://image.tmdb.org/t/p/original/vHqeLzYl3dEAutojCO26g0LIkom.jpg
90	1408	House	\N	2004-11-16	\N	\N	\N	\N	2025-06-22 21:25:55.61375	https://image.tmdb.org/t/p/original/3Cz7ySOQJmqiuTdrc6CY0r65yDI.jpg
66	651	60 Minutes	\N	1968-09-24	\N	\N	\N	\N	2025-06-22 21:25:46.347555	https://image.tmdb.org/t/p/original/qDSKxeHoN9pvVChXXc2YZN4KwBJ.jpg
75	2691	Two and a Half Men	\N	2003-09-22	\N	\N	\N	\N	2025-06-22 21:25:49.661511	https://image.tmdb.org/t/p/original/xgfjxyV3g1S68opzuvG6G87muDp.jpg
81	1027	The Carol Burnett Show	\N	1967-09-11	\N	\N	\N	\N	2025-06-22 21:25:51.982433	https://image.tmdb.org/t/p/original/dGd9pG4PGzpJbdbPEnFxKrJ24z8.jpg
58	291	Coronation Street	\N	1960-12-09	\N	\N	\N	\N	2025-06-22 21:25:43.677678	https://image.tmdb.org/t/p/original/5x1HXqYqPyYw7oc7Isu1lvVmwRP.jpg
79	5368	Lassie	\N	1954-09-12	\N	\N	\N	\N	2025-06-22 21:25:51.019372	https://image.tmdb.org/t/p/original/vqbVr4fYRZb28ywczaidn29JJTA.jpg
87	1434	Family Guy	\N	1999-01-31	\N	\N	\N	\N	2025-06-22 21:25:54.231856	https://image.tmdb.org/t/p/original/8o8kiBkWFK3gVytHdyzEWUBXVfK.jpg
1	50821	Among Friends	\N	1998-10-26	\N	\N	\N	\N	2025-06-22 21:25:23.02758	https://image.tmdb.org/t/p/original/kBBbSgNchtMvsgD6z1oI1RRluHP.jpg
68	4614	NCIS	\N	2003-09-23	\N	\N	\N	\N	2025-06-22 21:25:47.009507	https://image.tmdb.org/t/p/original/mBcu8d6x6zB1el3MPNl7cZQEQ31.jpg
16	46825	Rooster Teeth Animated Adventures	\N	2011-09-28	\N	\N	\N	\N	2025-06-22 21:25:28.12721	https://image.tmdb.org/t/p/original/xrcOsjmuBcmf1YhqyQ6qrGCcsvE.jpg
80	68073	The Loud House	\N	2016-05-02	\N	\N	\N	\N	2025-06-22 21:25:51.498031	https://image.tmdb.org/t/p/original/v0xMCeZIkgBUQtiije0IDc8ReHr.jpg
65	17887	7de Laan	\N	2000-04-04	\N	\N	\N	\N	2025-06-22 21:25:46.091557	https://image.tmdb.org/t/p/original/vQcC4Kcx0ZEXxmj0gUrfkFR14LU.jpg
64	549	Law & Order	\N	1990-09-13	\N	\N	\N	\N	2025-06-22 21:25:45.757605	https://image.tmdb.org/t/p/original/6vFL8S6Cci8s7SHWXz60xOisGBC.jpg
67	1636	Top of the Pops	\N	1964-01-01	\N	\N	\N	\N	2025-06-22 21:25:46.733454	https://image.tmdb.org/t/p/original/jjfTTjVYWyD6rGHVbnC44IrsJ7P.jpg
61	2912	Jeopardy!	\N	1984-09-10	\N	\N	\N	\N	2025-06-22 21:25:44.627661	https://image.tmdb.org/t/p/original/11rWvQOEZBouD7wet0sWHwu7NDs.jpg
150	2734	Law & Order: Special Victims Unit	\N	1999-09-20	\N	\N	\N	\N	2025-06-24 12:37:55.476057	https://image.tmdb.org/t/p/original/abWOCrIo7bbAORxcQyOFNJdnnmR.jpg
83	11890	Goede Tijden, Slechte Tijden	\N	1990-10-01	\N	\N	\N	\N	2025-06-22 21:25:52.695514	https://image.tmdb.org/t/p/original/p1oXgtJ0q0wAcEp3tHA5DpiynxL.jpg
54	2225	Who Wants to Be a Millionaire?	\N	1999-08-16	\N	\N	\N	\N	2025-06-22 21:25:42.281459	https://image.tmdb.org/t/p/original/oZ7fBwLRgKYyJcliFOfp03xv6Mk.jpg
169	5022	The Real World	\N	1992-05-21	\N	\N	\N	\N	2025-06-24 12:38:00.698832	https://image.tmdb.org/t/p/original/pqeqlmK1KEBfEfABnPjEr7oXjWL.jpg
171	83319	BANGTAN BOMB	\N	2013-06-19	\N	\N	\N	\N	2025-06-24 12:38:01.313751	https://image.tmdb.org/t/p/original/i01uYYJoovqILhexlYA6E1CHh56.jpg
177	46195	Monogatari	\N	2009-07-03	\N	\N	\N	\N	2025-06-24 12:38:02.98892	https://image.tmdb.org/t/p/original/zCEjjb1NH3LLsWeZx47wOeqkezf.jpg
182	1400	Seinfeld	\N	1989-07-05	\N	\N	\N	\N	2025-06-24 12:38:04.375766	https://image.tmdb.org/t/p/original/aCw8ONfyz3AhngVQa1E2Ss4KSUQ.jpg
187	116958	Being The Elite	\N	2016-05-05	\N	\N	\N	\N	2025-06-24 12:38:05.818384	https://image.tmdb.org/t/p/original/yt018aeDWJjZA3uxo5Rvr0N03i.jpg
190	841	Newsnight	\N	1980-01-30	\N	\N	\N	\N	2025-06-24 12:38:06.641029	https://image.tmdb.org/t/p/original/t5WG6kBLS58hQmmCBxCC7FxGHOI.jpg
193	64614	En mode Salvail	\N	2013-10-28	\N	\N	\N	\N	2025-06-24 12:38:07.44345	https://image.tmdb.org/t/p/original/60LW30jI1P86aNRYzn3fk6UumBN.jpg
195	128078	Justice with Judge Mablean	\N	2014-09-15	\N	\N	\N	\N	2025-06-24 12:38:07.867299	https://image.tmdb.org/t/p/original/8JPHiitwbMUigXqsuqRSFRGbE7g.jpg
196	15287	Saan Ka Man Naroroon	\N	1999-04-12	\N	\N	\N	\N	2025-06-24 12:38:08.172244	https://image.tmdb.org/t/p/original/dqHTgBZsDEz02Q2FendRE1fd3VP.jpg
198	1402	The Walking Dead	\N	2010-10-31	\N	\N	\N	\N	2025-06-24 12:38:08.682021	https://image.tmdb.org/t/p/original/ng3cMtxYKt1OSQYqFlnKWnVsqNO.jpg
200	95226	Champs-Elysées	\N	1982-01-16	\N	\N	\N	\N	2025-06-24 12:38:09.198435	https://image.tmdb.org/t/p/original/uA6Waea7ozD7OEXNGaSqPtydPdd.jpg
201	93405	Squid Game	\N	2021-09-17	\N	\N	\N	\N	2025-06-30 09:35:06.901157	https://image.tmdb.org/t/p/original/1QdXdRYfktUSONkl1oD5gc6Be0s.jpg
47	60694	Last Week Tonight with John Oliver	\N	2014-04-27	\N	\N	\N	\N	2025-06-22 21:25:40.051562	https://image.tmdb.org/t/p/original/b12eM3FXNjN7yM7XYTIdmeQRud9.jpg
216	33765	My Little Pony: Friendship Is Magic	\N	2010-10-10	\N	\N	\N	\N	2025-06-30 09:35:15.551936	https://image.tmdb.org/t/p/original/fwW7WgJIjhBsnzk87Gyh6g9187m.jpg
219	14814	Keeping Up with the Kardashians	\N	2007-10-14	\N	\N	\N	\N	2025-06-30 09:35:17.780932	https://image.tmdb.org/t/p/original/nddXOC8wYpIDv7giLzjjqIg8WDA.jpg
220	43689	Be Careful With My Heart	\N	2012-07-09	\N	\N	\N	\N	2025-06-30 09:35:18.181138	https://image.tmdb.org/t/p/original/kJlUmgQh6chfGsHgwcrtjNmg2t1.jpg
222	3365	Grange Hill	\N	1978-02-08	\N	\N	\N	\N	2025-06-30 09:35:19.541136	https://image.tmdb.org/t/p/original/8SziJYek4dEumfweUY9GnnOtcJS.jpg
225	6744	The Merv Griffin Show	\N	1962-10-01	\N	\N	\N	\N	2025-06-30 09:35:21.786648	https://image.tmdb.org/t/p/original/pF9rFdF6Gd4dNJ0Rh4mFsaFTi3m.jpg
227	45789	Sturm der Liebe	\N	2005-09-26	\N	\N	\N	\N	2025-06-30 09:35:22.66109	https://image.tmdb.org/t/p/original/jfFNydakwvbeACEwSd2Gh8UWtba.jpg
199	60698	Comedy Nights with Kapil	\N	2013-06-22	\N	\N	\N	\N	2025-06-24 12:38:08.890651	https://image.tmdb.org/t/p/original/9rScFaEadiT3r46LuT9wWOkh3fo.jpg
188	607	The Powerpuff Girls	\N	1998-11-18	\N	\N	\N	\N	2025-06-24 12:38:06.125931	https://image.tmdb.org/t/p/original/4CMPCuP6ihU5UvTStv23aGEEMuC.jpg
240	41974	Monster High	\N	2010-05-05	\N	\N	\N	\N	2025-06-30 09:35:30.980924	https://image.tmdb.org/t/p/original/4GenvQm0oZxfwO79cP2izi0JtQd.jpg
243	64196	Overlord	\N	2015-07-07	\N	\N	\N	\N	2025-06-30 09:35:32.661771	https://image.tmdb.org/t/p/original/K8ZUjxaj9F0t3AwJDz8ypzBynM.jpg
244	34163	Urusei Yatsura	\N	1981-10-14	\N	\N	\N	\N	2025-06-30 09:35:33.300872	https://image.tmdb.org/t/p/original/bs0Q5TMYVUTNXCPbuPBNylzqrxk.jpg
248	1419	Castle	\N	2009-03-09	\N	\N	\N	\N	2025-06-30 09:35:35.706097	https://image.tmdb.org/t/p/original/diXBeMzvfJb2iJg3G0kCUaMCzEc.jpg
249	70672	Men on a Mission	\N	2015-12-05	\N	\N	\N	\N	2025-06-30 09:35:36.340833	https://image.tmdb.org/t/p/original/2jIi55JtYKJTL1km8qHMuUilOWo.jpg
251	81329	Chronicles of the Sun	\N	2018-08-27	\N	\N	\N	\N	2025-06-30 09:35:37.30139	https://image.tmdb.org/t/p/original/t6jVlbPMtZOJoAOfeoR4yQmnjXM.jpg
254	65270	Radio Star	\N	2007-05-30	\N	\N	\N	\N	2025-06-30 09:35:39.066752	https://image.tmdb.org/t/p/original/uRUZDsvUfIP3JUEgOC8ReBlQQUU.jpg
256	32913	Pauw & Witteman	\N	2006-09-04	\N	\N	\N	\N	2025-06-30 09:35:40.114083	https://image.tmdb.org/t/p/original/dXEuVWU3ZaY9iKc4zUGO9QyjBlw.jpg
258	64198	Blaze and the Monster Machines	\N	2014-10-13	\N	\N	\N	\N	2025-06-30 09:35:41.071586	https://image.tmdb.org/t/p/original/5DzjYIdgoePjMlmS7RCyUYWhpIK.jpg
259	47480	The Tom and Jerry Show	\N	2014-04-09	\N	\N	\N	\N	2025-06-30 09:35:41.941468	https://image.tmdb.org/t/p/original/41EWXLXTZO4MLb2BL28mWZuydyq.jpg
260	15511	Ikaw Lang Ang Mamahalin	\N	2001-03-26	\N	\N	\N	\N	2025-06-30 09:35:42.825768	\N
261	102758	Off Camera with Sam Jones	\N	2014-02-06	\N	\N	\N	\N	2025-06-30 09:35:43.306013	https://image.tmdb.org/t/p/original/wFzCudeLabyjvwh0n5C9rEtCqVy.jpg
264	12337	The Life and Legend of Wyatt Earp	\N	1955-09-06	\N	\N	\N	\N	2025-06-30 09:35:44.740941	https://image.tmdb.org/t/p/original/sq7meZ5XvxFKZmsTcM54q28IqHp.jpg
179	60735	The Flash	\N	2014-10-07	\N	\N	\N	\N	2025-06-24 12:38:03.62768	https://image.tmdb.org/t/p/original/yZevl2vHQgmosfwUdVNzviIfaWS.jpg
266	15260	Adventure Time	\N	2010-04-05	\N	\N	\N	\N	2025-06-30 09:35:45.946331	https://image.tmdb.org/t/p/original/qk3eQ8jW4opJ48gFWYUXWaMT4l.jpg
267	235484	Suidooster	\N	2015-11-16	\N	\N	\N	\N	2025-06-30 09:35:46.665775	https://image.tmdb.org/t/p/original/naCgSiacvV685kait6fBvhVhdce.jpg
270	1606	Ghost Whisperer	\N	2005-09-23	\N	\N	\N	\N	2025-06-30 09:35:48.586018	https://image.tmdb.org/t/p/original/23oIfiF2wdbvIJh87c90QYhOtbw.jpg
273	5092	Infinite Challenge	\N	2005-04-23	\N	\N	\N	\N	2025-06-30 09:35:50.58573	https://image.tmdb.org/t/p/original/3ZIPTvMnzI5ThmdGeEYQFxJV5Sg.jpg
274	12971	Dragon Ball Z	\N	1989-04-26	\N	\N	\N	\N	2025-06-30 09:35:51.145942	https://image.tmdb.org/t/p/original/i1lMlxir5E4jyeLlqS2bK1Cn3Tt.jpg
276	204082	Squid Game: The Challenge	\N	2023-11-22	\N	\N	\N	\N	2025-06-30 09:35:52.585987	https://image.tmdb.org/t/p/original/y85L9DWoaM2MYNg1p8QRywxXJsa.jpg
277	80885	Ninja Hattori-kun	\N	1981-09-28	\N	\N	\N	\N	2025-06-30 09:35:52.981011	https://image.tmdb.org/t/p/original/zVSx7lXxRKqXiQMgN6QNGgNyF5R.jpg
278	4673	The Secret Storm	\N	1954-02-01	\N	\N	\N	\N	2025-06-30 09:35:53.946124	\N
279	3690	Tyler Perry's House of Payne	\N	2007-06-06	\N	\N	\N	\N	2025-06-30 09:35:54.346471	https://image.tmdb.org/t/p/original/2NdUdJnZnwI6skvm6OXWrK2D42U.jpg
281	85948	Star Trek: Lower Decks	\N	2020-08-06	\N	\N	\N	\N	2025-06-30 09:35:55.306134	https://image.tmdb.org/t/p/original/i7Em3r7KCyNfkOwMkyqN8UMvK8S.jpg
282	4601	Law & Order: Criminal Intent	\N	2001-09-30	\N	\N	\N	\N	2025-06-30 09:35:56.025862	https://image.tmdb.org/t/p/original/zgBg8gTCELQg73awE7qAuV06c4Z.jpg
283	5291	Homicide	\N	1964-10-20	\N	\N	\N	\N	2025-06-30 09:35:56.501374	https://image.tmdb.org/t/p/original/vL44ejhfQ7xmEDXwvugeNdM4E0b.jpg
285	59599	Trail of Lies	\N	2013-05-20	\N	\N	\N	\N	2025-06-30 09:35:57.701114	https://image.tmdb.org/t/p/original/h8i9XWOXNMgOHixobXIU76fnfmw.jpg
286	46260	Naruto	\N	2002-10-03	\N	\N	\N	\N	2025-06-30 09:35:58.50123	https://image.tmdb.org/t/p/original/xppeysfvDKVx775MFuH8Z9BlpMk.jpg
287	13840	Castle Einstein	\N	1998-09-04	\N	\N	\N	\N	2025-06-30 09:35:59.381017	https://image.tmdb.org/t/p/original/svzRA70GpGnV9p5EBrCZpqyidpQ.jpg
288	127635	Spidey and His Amazing Friends	\N	2021-08-06	\N	\N	\N	\N	2025-06-30 09:36:00.031293	https://image.tmdb.org/t/p/original/etO5jDS5WgR4Y1lTyXhQcilJ6u2.jpg
289	4429	Timon and Pumbaa	\N	1995-09-08	\N	\N	\N	\N	2025-06-30 09:36:00.741393	https://image.tmdb.org/t/p/original/sn9PTOwI6ktLHZcysCrP8cqOw1b.jpg
235	46707	WWE Main Event	\N	2012-10-03	\N	\N	\N	\N	2025-06-30 09:35:27.145894	https://image.tmdb.org/t/p/original/yVZdqmVMI09F7GzFvDJCc36oBkT.jpg
73	2140	Everybody Loves Raymond	\N	1996-09-13	\N	\N	\N	\N	2025-06-22 21:25:48.807883	https://image.tmdb.org/t/p/original/dcCnVVggEBfNpzHrqzDJqhE6tGP.jpg
292	88810	Des squelettes dans le placard	\N	2006-05-01	\N	\N	\N	\N	2025-06-30 09:36:02.666995	https://image.tmdb.org/t/p/original/oUO508CUtXGeUdEtr4fUQAdydml.jpg
293	70047	Rapunzel's Tangled Adventure	\N	2017-03-24	\N	\N	\N	\N	2025-06-30 09:36:02.991336	https://image.tmdb.org/t/p/original/s12Z2uGrvjj5sA7LsBStTtfTYjC.jpg
294	80350	New Amsterdam	\N	2018-09-25	\N	\N	\N	\N	2025-06-30 09:36:03.711053	https://image.tmdb.org/t/p/original/jsH4AeGZn5Q6h314A3OTUHKxHhR.jpg
295	12500	Rainbow	\N	1972-10-16	\N	\N	\N	\N	2025-06-30 09:36:04.181082	https://image.tmdb.org/t/p/original/cAORJWMV0ufuYrYSFrznDTh22AU.jpg
297	4448	America's Funniest Home Videos	\N	1989-11-26	\N	\N	\N	\N	2025-06-30 09:36:05.460814	https://image.tmdb.org/t/p/original/7jedS7U08F1wF3MJTTEVu0vZrS2.jpg
175	897	The Grim Adventures of Billy and Mandy	\N	2001-08-24	\N	\N	\N	\N	2025-06-24 12:38:02.570457	https://image.tmdb.org/t/p/original/gxdTn5UwvriN1EzDSNnWr5AAQN7.jpg
301	\N	mpondo	\N	\N	\N	\N	\N	\N	2025-06-30 09:46:09.411675	\N
302	\N	Who Wants To Be A Millionare	\N	\N	\N	\N	\N	\N	2025-06-30 09:46:46.531519	\N
\.


--
-- Data for Name: series_genres; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.series_genres (series_id, genre_id) FROM stdin;
1	7
1	8
2	4
3	4
4	4
5	4
6	4
7	4
8	7
9	4
10	4
13	5
13	7
15	4
16	3
16	4
18	3
18	4
19	5
19	7
19	13
22	6
25	7
26	5
26	7
26	13
28	7
29	6
31	3
31	4
31	8
32	3
32	4
32	8
33	3
33	4
33	8
34	3
34	4
35	3
36	5
36	4
37	4
37	8
39	3
39	8
39	4
41	5
41	7
41	4
42	4
43	4
44	7
44	4
46	3
46	4
46	8
47	4
48	5
48	7
49	7
50	7
52	7
53	4
55	7
55	13
57	3
57	4
57	8
60	4
60	7
61	8
63	7
63	5
63	13
64	5
64	7
68	5
68	7
69	6
70	4
72	3
73	4
74	7
74	5
74	13
75	4
77	4
77	8
79	7
79	8
79	4
80	3
80	4
80	8
80	13
81	4
81	8
82	4
82	8
85	3
85	4
85	8
86	5
86	7
86	13
87	3
87	4
88	7
89	8
89	3
89	4
90	7
90	13
90	4
92	3
92	4
92	8
93	3
93	4
93	8
94	7
95	7
96	3
100	3
100	4
144	3
150	5
150	7
150	13
159	4
166	6
167	5
167	7
175	3
175	4
177	3
177	4
177	7
177	13
179	7
182	4
187	6
187	4
188	3
188	4
188	8
193	4
195	7
196	7
196	8
198	7
199	4
201	13
201	7
216	3
216	4
220	4
220	7
222	7
227	7
235	7
240	4
240	3
243	3
244	3
244	4
244	7
248	7
248	5
249	4
258	3
258	8
258	4
259	8
259	3
259	4
260	7
264	7
264	19
266	3
266	4
270	13
270	7
273	4
274	3
277	3
277	4
277	8
279	4
281	3
281	4
282	7
283	7
283	5
285	7
285	8
286	3
287	8
287	7
288	3
288	4
289	3
289	4
289	8
293	3
293	4
294	7
295	4
297	4
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, first_name, last_name, email, password, verification_token, otp_expiry, is_verified, reset_token, reset_token_expiry, role, created_at) FROM stdin;
48	Keiketlile	Maboe	maboekeiketlile@gmail.com	$2b$10$Y/8a4TVaKr5J6O4GT0P0eOp01yuvGjf9oUdWQ5zK639d/1IyDZCI.	\N	\N	t	295037	2025-06-18 08:02:13.809+00	guest	2025-06-21 13:06:37.509649
51	Wandile	Sbiya	lchauke@datacentrix.co.za	$2b$10$weOSSueClffMEEZqDfNcHeZo7EF.Xe6hIV.RQiytc1d4i6NOJEFkW	\N	\N	t	\N	\N	admin	2025-06-21 13:06:37.509649
49	Siphesihle	Mdebuka	mmdebuka@datacentrix.co.za	$2b$10$8/713USBPWwW3kRDYJfgS.Go.Dm9yO2bhN01ttU1p1HvYMpOHnOFu	\N	\N	t	\N	\N	guest	2025-06-21 13:06:37.509649
52	John	Doe	john.doe@example.com	password123	\N	\N	t	\N	\N	guest	2024-09-01 10:00:00
53	Jane	Smith	jane.smith@example.com	qwerty123	\N	\N	t	\N	\N	guest	2024-09-02 11:30:00
54	Alice	Johnson	alice.johnson@example.com	abc12345	\N	\N	t	\N	\N	guest	2024-09-03 09:15:00
55	Bob	Brown	bob.brown@example.com	mypassword	\N	\N	t	\N	\N	guest	2024-09-04 14:45:00
56	Charlie	Davis	charlie.davis@example.com	letmein123	\N	\N	t	\N	\N	guest	2024-09-05 08:20:00
57	Diana	Miller	diana.miller@example.com	12345678	\N	\N	t	\N	\N	guest	2024-09-06 12:00:00
58	Eve	Wilson	eve.wilson@example.com	password1	\N	\N	t	\N	\N	guest	2024-09-07 15:30:00
59	Frank	Moore	frank.moore@example.com	secret123	\N	\N	t	\N	\N	guest	2024-09-08 10:10:00
60	Grace	Taylor	grace.taylor@example.com	letmein!	\N	\N	t	\N	\N	guest	2024-09-09 11:50:00
61	Hank	Anderson	hank.anderson@example.com	welcome123	\N	\N	t	\N	\N	guest	2024-09-10 09:30:00
62	Ivy	Thomas	ivy.thomas@example.com	mypassword1	\N	\N	t	\N	\N	guest	2024-09-11 10:00:00
63	Jack	Jackson	jack.jackson@example.com	password@123	\N	\N	t	\N	\N	guest	2024-09-12 11:30:00
64	Kathy	White	kathy.white@example.com	1234abcd	\N	\N	t	\N	\N	guest	2024-09-13 09:15:00
65	Leo	Harris	leo.harris@example.com	qwertyuiop	\N	\N	t	\N	\N	guest	2024-09-14 14:45:00
66	Mia	Martin	mia.martin@example.com	password1234	\N	\N	t	\N	\N	guest	2024-09-15 08:20:00
67	Nina	Thompson	nina.thompson@example.com	letmein1234	\N	\N	t	\N	\N	guest	2024-09-16 12:00:00
68	Oscar	Garcia	oscar.garcia@example.com	123456789	\N	\N	t	\N	\N	guest	2024-09-17 15:30:00
69	Paula	Martinez	paula.martinez@example.com	password!@#	\N	\N	t	\N	\N	guest	2024-09-18 10:10:00
70	Quinn	Robinson	quinn.robinson@example.com	mysecret	\N	\N	t	\N	\N	guest	2024-09-19 11:50:00
71	Ray	Clark	ray.clark@example.com	letmein123!	\N	\N	t	\N	\N	guest	2024-09-20 09:30:00
72	Sara	Rodriguez	sara.rodriguez@example.com	welcome@123	\N	\N	t	\N	\N	guest	2024-09-21 10:00:00
73	Tom	Lewis	tom.lewis@example.com	mypassword2	\N	\N	t	\N	\N	guest	2024-09-22 11:30:00
74	Uma	Lee	uma.lee@example.com	password12345	\N	\N	t	\N	\N	guest	2024-09-23 09:15:00
75	Vera	Walker	vera.walker@example.com	qwerty1234	\N	\N	t	\N	\N	guest	2024-09-24 14:45:00
76	Will	Hall	will.hall@example.com	abcde12345	\N	\N	t	\N	\N	guest	2024-09-25 08:20:00
77	Xena	Allen	xena.allen@example.com	password1!	\N	\N	t	\N	\N	guest	2024-09-26 12:00:00
78	Yara	Young	yara.young@example.com	letmein12345	\N	\N	t	\N	\N	guest	2024-09-27 15:30:00
79	Zane	King	zane.king@example.com	secret@123	\N	\N	t	\N	\N	guest	2024-09-28 10:10:00
80	Amy	Scott	amy.scott@example.com	mypassword3	\N	\N	t	\N	\N	guest	2024-09-29 11:50:00
81	Ben	Green	ben.green@example.com	password123!	\N	\N	t	\N	\N	guest	2024-09-30 09:30:00
82	Cathy	Adams	cathy.adams@example.com	qwertyuiop1	\N	\N	t	\N	\N	guest	2024-10-01 10:00:00
83	Derek	Baker	derek.baker@example.com	1234abcd!	\N	\N	t	\N	\N	guest	2024-10-02 11:30:00
84	Ella	Gonzalez	ella.gonzalez@example.com	letmein@1234	\N	\N	t	\N	\N	guest	2024-10-03 09:15:00
85	Fred	Nelson	fred.nelson@example.com	mypassword4	\N	\N	t	\N	\N	guest	2024-10-04 14:45:00
86	Gina	Carter	gina.carter@example.com	password123456	\N	\N	t	\N	\N	guest	2024-10-05 08:20:00
87	Hugo	Mitchell	hugo.mitchell@example.com	welcome1234	\N	\N	t	\N	\N	guest	2024-10-06 12:00:00
88	Iris	Perez	iris.perez@example.com	secret1234	\N	\N	t	\N	\N	guest	2024-10-07 15:30:00
89	Jake	Roberts	jake.roberts@example.com	letmein123456	\N	\N	t	\N	\N	guest	2024-10-08 10:10:00
90	Kara	Turner	kara.turner@example.com	mypassword5	\N	\N	t	\N	\N	guest	2024-10-09 11:50:00
91	Liam	Phillips	liam.phillips@example.com	password!@#123	\N	\N	t	\N	\N	guest	2024-10-10 09:30:00
92	Mona	Campbell	mona.campbell@example.com	qwerty12345	\N	\N	t	\N	\N	guest	2024-10-11 10:00:00
93	Nate	Parker	nate.parker@example.com	abc123456	\N	\N	t	\N	\N	guest	2024-10-12 11:30:00
94	Olivia	Evans	olivia.evans@example.com	password123!	\N	\N	t	\N	\N	guest	2024-10-13 09:15:00
95	Paul	Edwards	paul.edwards@example.com	letmein1234567	\N	\N	t	\N	\N	guest	2024-10-14 14:45:00
96	Quincy	Collins	quincy.collins@example.com	mypassword6	\N	\N	t	\N	\N	guest	2024-10-15 08:20:00
97	Rita	Stewart	rita.stewart@example.com	password@1234	\N	\N	t	\N	\N	guest	2024-10-16 12:00:00
98	Sam	Sanchez	sam.sanchez@example.com	secret12345	\N	\N	t	\N	\N	guest	2024-10-17 15:30:00
99	Tina	Morris	tina.morris@example.com	letmein12345678	\N	\N	t	\N	\N	guest	2024-10-18 10:10:00
100	Ursula	Rogers	ursula.rogers@example.com	mypassword7	\N	\N	t	\N	\N	guest	2024-10-19 11:50:00
101	Victor	Reed	victor.reed@example.com	password1234567	\N	\N	t	\N	\N	guest	2024-10-20 09:30:00
102	Wendy	Cook	wendy.cook@example.com	qwerty123456	\N	\N	t	\N	\N	guest	2024-10-21 10:00:00
103	Xander	Morgan	xander.morgan@example.com	abcde123456	\N	\N	t	\N	\N	guest	2024-10-22 11:30:00
104	Yvonne	Bell	yvonne.bell@example.com	password12345678	\N	\N	t	\N	\N	guest	2024-10-23 09:15:00
105	Zach	Murphy	zach.murphy@example.com	letmein123456789	\N	\N	t	\N	\N	guest	2024-10-24 14:45:00
106	Ava	Rivera	ava.rivera@example.com	mypassword8	\N	\N	t	\N	\N	guest	2024-10-25 08:20:00
107	Brian	Cooper	brian.cooper@example.com	password123456789	\N	\N	t	\N	\N	guest	2024-10-26 12:00:00
108	Cathy	Richardson	cathy.richardson@example.com	qwertyuiop123	\N	\N	t	\N	\N	guest	2024-10-27 15:30:00
109	Derek	Hughes	derek.hughes@example.com	secret@1234	\N	\N	t	\N	\N	guest	2024-10-28 10:10:00
110	Ella	Price	ella.price@example.com	letmein1234567890	\N	\N	t	\N	\N	guest	2024-10-29 11:50:00
111	Frank	Bennett	frank.bennett@example.com	mypassword9	\N	\N	t	\N	\N	guest	2024-10-30 09:30:00
112	Gina	Wood	gina.wood@example.com	password!@#456	\N	\N	t	\N	\N	guest	2024-10-31 10:00:00
113	Hank	James	hank.james@example.com	qwerty1234567	\N	\N	t	\N	\N	guest	2024-11-01 11:30:00
114	Ivy	Watson	ivy.watson@example.com	abc1234567	\N	\N	t	\N	\N	guest	2024-11-02 09:15:00
115	Jack	Brooks	jack.brooks@example.com	mypassword10	\N	\N	t	\N	\N	guest	2024-11-03 14:45:00
116	Kathy	Kelly	kathy.kelly@example.com	password123456789	\N	\N	t	\N	\N	guest	2024-11-04 08:20:00
117	Leo	Sanders	leo.sanders@example.com	letmein12345678901	\N	\N	t	\N	\N	guest	2024-11-05 12:00:00
118	Mia	Price	mia.price@example.com	mypassword11	\N	\N	t	\N	\N	guest	2024-11-06 15:30:00
119	Nina	Harrison	nina.harrison@example.com	password1234567890	\N	\N	t	\N	\N	guest	2024-11-07 10:10:00
120	Oscar	Hughes	oscar.hughes@example.com	secret123456	\N	\N	t	\N	\N	guest	2024-11-08 11:50:00
121	Paula	Hernandez	paula.hernandez@example.com	letmein123456789012	\N	\N	t	\N	\N	guest	2024-11-09 09:30:00
122	Quinn	Gonzalez	quinn.gonzalez@example.com	mypassword12	\N	\N	t	\N	\N	guest	2024-11-10 10:00:00
123	Ray	Foster	ray.foster@example.com	password12345678901	\N	\N	t	\N	\N	guest	2024-11-11 11:30:00
124	Sara	Bryant	sara.bryant@example.com	qwertyuiop1234	\N	\N	t	\N	\N	guest	2024-11-12 09:15:00
125	Tom	Alexander	tom.alexander@example.com	mypassword13	\N	\N	t	\N	\N	guest	2024-11-13 14:45:00
126	Uma	Russell	uma.russell@example.com	password123456789012	\N	\N	t	\N	\N	guest	2024-11-14 08:20:00
127	Vera	Griffin	vera.griffin@example.com	letmein1234567890123	\N	\N	t	\N	\N	guest	2024-11-15 12:00:00
128	Will	Diaz	will.diaz@example.com	mypassword14	\N	\N	t	\N	\N	guest	2024-11-16 15:30:00
129	Xena	Hawkins	xena.hawkins@example.com	password12345678901234	\N	\N	t	\N	\N	guest	2024-11-17 10:10:00
130	Yara	Harrison	yara.harrison@example.com	letmein123456789012345	\N	\N	t	\N	\N	guest	2024-11-18 11:50:00
131	Zane	Harris	zane.harris@example.com	mypassword15	\N	\N	t	\N	\N	guest	2024-11-19 09:30:00
132	Sarah	Jones	sarah.jones4539@example.com	464ac68b2a7e75fa08a694882a4e1000	\N	\N	\N	\N	\N	guest	2025-05-06 08:00:47
133	Sarah	Moore	sarah.moore5134@example.com	408ca1c1412e2e47f2928aa5327d38c8	\N	\N	\N	\N	\N	guest	2025-03-06 06:14:26
134	Barbara	Wilson	barbara.wilson6831@example.com	4ef7d5c5732091ad081fb3c207a34745	\N	\N	\N	\N	\N	guest	2025-06-13 11:38:41
135	Michael	White	michael.white655@example.com	70322b183db518028cc59c47bf753304	\N	\N	\N	\N	\N	guest	2025-02-06 19:51:50
136	James	Jackson	james.jackson4838@example.com	c5bf53692761189bd1e59124a98c65b6	\N	\N	\N	\N	\N	guest	2025-02-25 12:51:02
137	Charles	Martinez	charles.martinez6649@example.com	c0e74ae437318bf19e472682eecd9b95	\N	\N	\N	\N	\N	guest	2025-06-05 15:13:54
138	John	Martinez	john.martinez4253@example.com	b39d5a4a86389271acbb25155ca88b17	\N	\N	\N	\N	\N	guest	2025-01-29 19:42:10
139	John	Miller	john.miller5064@example.com	a089943e5a0afc31ad31c255c2e8bc8c	\N	\N	\N	\N	\N	guest	2025-03-02 22:04:24
140	Mary	Miller	mary.miller3589@example.com	8eed171fa597da8774e1937d5931961a	\N	\N	\N	\N	\N	guest	2025-02-15 09:13:07
141	Linda	Johnson	linda.johnson8854@example.com	29ccefe607f54d70d259a8408aacce4d	\N	\N	\N	\N	\N	guest	2025-05-31 16:31:49
142	Siyabonga	Tsita	tsitasiyabonga9@gmail.com	$2b$10$W1273YV9qkSqyhyo9XiF7eVfDQox0/hjxtl4nomLZB7gVJuMPj7im	\N	\N	t	\N	\N	guest	2025-06-29 09:56:25.221006
143	Keiketlile	Maboe	kutloanomaboe@gmail.com	$2b$10$AJD.KCXjHSZABfgRC4sXAe7dNfmI2He8OnNoM3Bb/E5cdFdcTmuNq	503677	2025-07-01 07:51:17.488+00	f	\N	\N	guest	2025-07-01 07:43:00.54548
144	u	u	u@u.com	$2b$10$DSfK.RvIle5AtBiM.oQaeu6BaaQfIHiBOweidj.FRdKIINaCBSupy	390479	2025-07-01 10:06:39.417+00	f	\N	\N	guest	2025-07-01 10:03:38.616262
145	u	u	u@u.co.za	$2b$10$DYdt6QFXZV7ICJkBGMWp/.QteHcS11ZWlQztBsaGErcpK3lBAPzr.	959720	2025-07-01 10:06:49.073+00	f	\N	\N	guest	2025-07-01 10:03:48.27204
146	Keiketlile	Maboe	p@p.com	$2b$10$vLxR/vfua1lTvgkSKY.QtefAfPFv1vCMxQnP8Q0c.Wz2Qx/WVjLUK	136980	2025-07-01 10:43:23.179+00	f	\N	\N	guest	2025-07-01 10:40:22.391464
147	vuyo	Elvis	VMpondo@datacentrix.co.za	$2b$10$OE3XhbP9xxNBzTC7fIKDbe6r6nPU8ZZEgh9BhEGXWX2IsliTPGG1u	\N	\N	t	\N	\N	guest	2025-07-02 09:40:21.299281
148	Lewela	Makgato	lmakgato@datacentrix.co.za	$2b$10$b8oJnzyzI/YRuf0beIGgXegh1Zy/xZXLqSlbjtmsonMfBeEcVdURe	\N	\N	t	\N	\N	guest	2025-07-02 09:42:39.028244
149	Garsen	Subramoney	gsubramoney@datacentrix.co.za	$2b$10$WJFVxNHxMqCKep0sXfLxT.JgyRkwttOzU4lhJc.6LwAxKQmc4.8BO	\N	\N	t	\N	\N	guest	2025-07-02 10:58:19.885502
150	Chand	Tjingaete	ctjingaete@datacentrix.co.za	$2b$10$mIxKJbb04SrbpgdQ77/0ZuM9SPaLkqUbOHMKtRJvNHB0iFlnFNUuK	\N	\N	t	\N	\N	guest	2025-07-02 11:14:29.009237
151	Sudeshen	Chetty	schetty@datacentrix.co.za	$2b$10$HKojbbVePOXjsA1TBc9DEepi1GxXBbphQOmb4dKjpLBMeqYl9h2aa	\N	\N	t	\N	\N	guest	2025-07-02 11:45:48.283805
\.


--
-- Data for Name: watched_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.watched_history (id, user_id, movie_id, series_id, watched_at, movie_title, series_name) FROM stdin;
51	574475	\N	82873	2025-05-01 10:22:54.714259	Final Destination Bloodlines	\N
52	\N	93405	\N	2025-05-02 10:23:27.262854	\N	Squid Game
53	1311844	\N	\N	2025-05-03 10:34:52.438677	The Twisters	\N
54	\N	14981	\N	2025-05-04 11:56:48.89606	\N	\N
55	\N	2224	\N	2025-05-05 12:01:08.356776	\N	The Daily Show
56	\N	2224	\N	2025-05-06 12:01:08.365276	\N	The Daily Show
57	\N	2224	\N	2025-05-07 12:01:08.367337	\N	The Daily Show
58	\N	112470	\N	2025-05-08 12:01:59.938663	\N	Ici tout commence
59	\N	50821	\N	2025-05-09 12:03:25.185591	\N	\N
60	552524	\N	\N	2025-05-10 12:03:32.68854	Lilo & Stitch	\N
61	1127110	\N	\N	2025-05-11 12:03:40.064714	Diablo	\N
62	1426776	\N	\N	2025-05-12 12:03:51.516952	STRAW	\N
63	1071585	\N	\N	2025-05-13 12:03:58.693962	M3GAN 2.0	\N
64	1018990	\N	\N	2025-05-14 12:04:12.333487	Continent	\N
65	666154	\N	\N	2025-05-15 12:04:19.553406	Kayara	\N
66	7451	\N	\N	2025-05-16 12:04:24.218883	xXx	\N
67	1403735	\N	\N	2025-05-17 12:04:31.824664	Laila	\N
68	\N	1416	\N	2025-05-18 12:04:40.519589	\N	\N
69	\N	\N	82873	2025-05-19 12:04:45.956353	\N	\N
70	\N	\N	14814	2025-05-20 12:04:52.585458	\N	\N
71	\N	123456	\N	2025-05-21 12:05:00	The Matrix	\N
72	\N	\N	654321	2025-05-22 12:05:10	\N	Breaking Bad
73	\N	789012	\N	2025-05-23 12:05:20	Inception	\N
74	\N	\N	210987	2025-05-24 12:05:30	\N	Game of Thrones
75	\N	345678	\N	2025-05-25 12:05:40	Avatar	\N
76	\N	\N	876543	2025-05-26 12:05:50	\N	The Office
77	\N	135792	\N	2025-05-27 12:06:00	Titanic	\N
78	\N	\N	246801	2025-05-28 12:06:10	\N	Friends
79	\N	112233	\N	2025-05-29 12:06:20	Jurassic Park	\N
30	\N	574475	\N	2025-07-01 10:22:54.714259	Final Destination Bloodlines	\N
31	\N	\N	93405	2025-07-01 10:23:27.262854	\N	Squid Game
32	\N	1311844	\N	2025-07-01 10:34:52.438677	The Twisters	\N
33	\N	\N	14981	2025-07-01 11:56:48.89606	\N	\N
34	\N	\N	2224	2025-07-01 12:01:08.356776	\N	The Daily Show
35	\N	\N	2224	2025-07-01 12:01:08.365276	\N	The Daily Show
36	\N	\N	2224	2025-07-01 12:01:08.367337	\N	The Daily Show
37	\N	\N	112470	2025-07-01 12:01:59.938663	\N	Ici tout commence
38	\N	\N	50821	2025-07-01 12:03:25.185591	\N	\N
39	\N	552524	\N	2025-07-01 12:03:32.68854	Lilo & Stitch	\N
40	\N	1127110	\N	2025-07-01 12:03:40.064714	Diablo	\N
41	\N	1426776	\N	2025-07-01 12:03:51.516952	STRAW	\N
42	\N	1071585	\N	2025-07-01 12:03:58.693962	M3GAN 2.0	\N
43	\N	1018990	\N	2025-07-01 12:04:12.333487	Continent	\N
44	\N	666154	\N	2025-07-01 12:04:19.553406	Kayara	\N
45	\N	7451	\N	2025-07-01 12:04:24.218883	xXx	\N
46	\N	1403735	\N	2025-07-01 12:04:31.824664	Laila	\N
47	\N	\N	1416	2025-07-01 12:04:40.519589	\N	\N
48	\N	\N	82873	2025-07-01 12:04:45.956353	\N	\N
49	\N	\N	14814	2025-07-01 12:04:52.585458	\N	\N
50	\N	\N	68073	2025-07-01 12:04:56.146523	\N	\N
80	\N	574475	\N	2025-05-30 10:22:54.714259	Final Destination Bloodlines	\N
81	\N	\N	93405	2025-05-31 10:23:27.262854	\N	Squid Game
82	\N	1311844	\N	2025-06-01 10:34:52.438677	The Twisters	\N
83	\N	\N	14981	2025-06-02 11:56:48.89606	\N	\N
84	\N	\N	2224	2025-06-03 12:01:08.356776	\N	The Daily Show
85	\N	\N	2224	2025-06-04 12:01:08.365276	\N	The Daily Show
86	\N	\N	2224	2025-06-05 12:01:08.367337	\N	The Daily Show
87	\N	\N	112470	2025-06-06 12:01:59.938663	\N	Ici tout commence
88	\N	\N	50821	2025-06-07 12:03:25.185591	\N	\N
89	\N	552524	\N	2025-06-08 12:03:32.68854	Lilo & Stitch	\N
90	\N	1127110	\N	2025-06-09 12:03:40.064714	Diablo	\N
91	\N	1426776	\N	2025-06-10 12:03:51.516952	STRAW	\N
92	\N	1071585	\N	2025-06-11 12:03:58.693962	M3GAN 2.0	\N
93	\N	1018990	\N	2025-06-12 12:04:12.333487	Continent	\N
94	\N	666154	\N	2025-06-13 12:04:19.553406	Kayara	\N
95	\N	7451	\N	2025-06-14 12:04:24.218883	xXx	\N
96	\N	1403735	\N	2025-06-15 12:04:31.824664	Laila	\N
97	\N	\N	1416	2025-06-16 12:04:40.519589	\N	\N
98	\N	\N	82873	2025-06-17 12:04:45.956353	\N	\N
99	\N	\N	14814	2025-06-18 12:04:52.585458	\N	\N
100	\N	123456	\N	2025-06-19 12:05:00	The Matrix	\N
101	\N	\N	654321	2025-06-20 12:05:10	\N	Breaking Bad
102	\N	789012	\N	2025-06-21 12:05:20	Inception	\N
103	\N	\N	210987	2025-06-22 12:05:30	\N	Game of Thrones
104	\N	345678	\N	2025-06-23 12:05:40	Avatar	\N
105	\N	\N	876543	2025-06-24 12:05:50	\N	The Office
106	\N	135792	\N	2025-06-25 12:06:00	Titanic	\N
107	\N	\N	246801	2025-06-26 12:06:10	\N	Friends
108	\N	112233	\N	2025-06-27 12:06:20	Jurassic Park	\N
109	\N	574475	\N	2025-06-28 10:22:54.714259	Final Destination Bloodlines	\N
110	\N	\N	93405	2025-06-29 10:23:27.262854	\N	Squid Game
111	\N	1311844	\N	2025-06-30 10:34:52.438677	The Twisters	\N
112	\N	\N	14981	2025-07-01 11:56:48.89606	\N	\N
113	\N	\N	2224	2025-07-02 12:01:08.356776	\N	The Daily Show
114	\N	\N	2224	2025-07-03 12:01:08.365276	\N	The Daily Show
115	\N	\N	2224	2025-07-04 12:01:08.367337	\N	The Daily Show
116	\N	\N	112470	2025-07-05 12:01:59.938663	\N	Ici tout commence
117	\N	\N	50821	2025-07-06 12:03:25.185591	\N	\N
118	\N	552524	\N	2025-07-07 12:03:32.68854	Lilo & Stitch	\N
119	\N	1127110	\N	2025-07-08 12:03:40.064714	Diablo	\N
120	\N	1426776	\N	2025-07-09 12:03:51.516952	STRAW	\N
121	\N	1071585	\N	2025-07-10 12:03:58.693962	M3GAN 2.0	\N
122	\N	1018990	\N	2025-07-11 12:04:12.333487	Continent	\N
123	\N	666154	\N	2025-07-12 12:04:19.553406	Kayara	\N
124	\N	7451	\N	2025-07-13 12:04:24.218883	xXx	\N
125	\N	1403735	\N	2025-07-14 12:04:31.824664	Laila	\N
126	\N	\N	1416	2025-07-15 12:04:40.519589	\N	\N
127	\N	\N	82873	2025-07-16 12:04:45.956353	\N	\N
128	\N	\N	14814	2025-07-17 12:04:52.585458	\N	\N
129	\N	123456	\N	2025-07-18 12:05:00	The Matrix	\N
130	\N	\N	654321	2025-07-19 12:05:10	\N	Breaking Bad
131	\N	789012	\N	2025-07-20 12:05:20	Inception	\N
132	\N	\N	210987	2025-07-21 12:05:30	\N	Game of Thrones
133	\N	345678	\N	2025-07-22 12:05:40	Avatar	\N
134	\N	\N	876543	2025-07-23 12:05:50	\N	The Office
135	\N	135792	\N	2025-07-24 12:06:00	Titanic	\N
136	\N	\N	246801	2025-07-25 12:06:10	\N	Friends
137	\N	112233	\N	2025-07-26 12:06:20	Jurassic Park	\N
138	\N	574475	\N	2025-07-27 10:22:54.714259	Final Destination Bloodlines	\N
139	\N	\N	93405	2025-07-28 10:23:27.262854	\N	Squid Game
140	\N	1311844	\N	2025-07-29 10:34:52.438677	The Twisters	\N
141	\N	\N	14981	2025-07-30 11:56:48.89606	\N	\N
142	\N	\N	2224	2025-07-31 12:01:08.356776	\N	The Daily Show
143	\N	\N	2224	2025-08-01 12:01:08.365276	\N	The Daily Show
144	\N	\N	2224	2025-08-02 12:01:08.367337	\N	The Daily Show
145	\N	\N	112470	2025-08-03 12:01:59.938663	\N	Ici tout commence
146	\N	\N	50821	2025-08-04 12:03:25.185591	\N	\N
147	\N	552524	\N	2025-08-05 12:03:32.68854	Lilo & Stitch	\N
148	\N	1127110	\N	2025-08-06 12:03:40.064714	Diablo	\N
149	\N	1426776	\N	2025-08-07 12:03:51.516952	STRAW	\N
150	\N	1071585	\N	2025-08-08 12:03:58.693962	M3GAN 2.0	\N
151	\N	574475	\N	2025-07-01 17:45:51.742189	Final Destination Bloodlines	\N
152	\N	552524	\N	2025-07-01 17:46:04.106665	Lilo & Stitch	\N
153	\N	\N	93405	2025-07-01 17:46:10.661521	\N	Squid Game
154	\N	1090007	\N	2025-07-01 18:25:16.472084	First Shift	\N
155	\N	986056	\N	2025-07-01 18:25:28.207339	Thunderbolts*	\N
156	\N	552524	\N	2025-07-01 19:04:22.788006	Lilo & Stitch	\N
157	\N	552524	\N	2025-07-01 19:04:42.18372	Lilo & Stitch	\N
158	\N	1090007	\N	2025-07-01 19:04:55.183181	First Shift	\N
159	\N	\N	93405	2025-07-01 19:05:18.222256	\N	Squid Game
160	\N	911430	\N	2025-07-01 19:06:41.423433	F1 The Movie	\N
161	\N	1181039	\N	2025-07-01 19:17:10.062123	Candle in the Tomb: The Worm Valley	\N
162	\N	\N	498	2025-07-01 19:17:59.102143	\N	Late Show with David Letterman
163	\N	\N	1416	2025-07-01 19:37:07.421235	\N	Grey's Anatomy
164	\N	911430	\N	2025-07-01 20:03:02.154708	F1 The Movie	\N
165	\N	911430	\N	2025-07-01 20:24:45.364248	F1 The Movie	\N
166	\N	950387	\N	2025-07-01 22:05:55.373458	A Minecraft Movie	\N
167	\N	1090007	\N	2025-07-02 07:23:22.719178	First Shift	\N
168	\N	552524	\N	2025-07-02 07:31:30.445216	Lilo & Stitch	\N
169	\N	1090007	\N	2025-07-02 09:41:31.407756	First Shift	\N
170	\N	986056	\N	2025-07-02 09:41:53.323599	Thunderbolts*	\N
171	\N	\N	63401	2025-07-02 09:45:47.367749	\N	We Bare Bears
174	\N	552524	\N	2025-07-02 11:02:37.058905	Lilo & Stitch	\N
172	\N	\N	14981	2025-07-02 10:59:56.239104	\N	The Late Late Show with Craig Ferguson
173	\N	552524	\N	2025-07-02 11:00:09.530258	Lilo & Stitch	\N
175	\N	870028	\N	2025-07-02 11:16:20.283031	The Accountant²	\N
176	\N	1426776	\N	2025-07-02 11:16:51.447375	STRAW	\N
177	\N	1049948	\N	2025-07-02 11:17:18.251075	Vikings: Battle of Heirs	\N
178	\N	\N	93405	2025-07-02 11:18:51.361272	\N	Squid Game
179	\N	1197306	\N	2025-07-02 11:47:26.933443	A Working Man	\N
180	\N	1405338	\N	2025-07-02 11:47:48.313959	Demon City	\N
\.


--
-- Name: genres_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.genres_id_seq', 285, true);


--
-- Name: login_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.login_history_id_seq', 40, true);


--
-- Name: movies_movie_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.movies_movie_id_seq', 300, true);


--
-- Name: series_series_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.series_series_id_seq', 302, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 151, true);


--
-- Name: watched_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.watched_history_id_seq', 180, true);


--
-- Name: genres genres_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_pkey PRIMARY KEY (id);


--
-- Name: genres genres_tmdb_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_tmdb_id_key UNIQUE (tmdb_id);


--
-- Name: login_history login_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_history
    ADD CONSTRAINT login_history_pkey PRIMARY KEY (id);


--
-- Name: movie_genres movie_genres_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_genres
    ADD CONSTRAINT movie_genres_pkey PRIMARY KEY (movie_id, genre_id);


--
-- Name: movies movies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT movies_pkey PRIMARY KEY (movie_id);


--
-- Name: movies movies_tmdb_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT movies_tmdb_id_unique UNIQUE (tmdb_id);


--
-- Name: series_genres series_genres_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.series_genres
    ADD CONSTRAINT series_genres_pkey PRIMARY KEY (series_id, genre_id);


--
-- Name: series series_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.series
    ADD CONSTRAINT series_pkey PRIMARY KEY (series_id);


--
-- Name: series series_tmdb_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.series
    ADD CONSTRAINT series_tmdb_id_unique UNIQUE (tmdb_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: watched_history watched_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.watched_history
    ADD CONSTRAINT watched_history_pkey PRIMARY KEY (id);


--
-- Name: idx_users_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_created_at ON public.users USING btree (created_at);


--
-- Name: users set_role_to_guest; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_role_to_guest BEFORE INSERT ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_default_role();


--
-- Name: login_history login_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_history
    ADD CONSTRAINT login_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: movie_genres movie_genres_genre_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_genres
    ADD CONSTRAINT movie_genres_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES public.genres(id) ON DELETE CASCADE;


--
-- Name: movie_genres movie_genres_movie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_genres
    ADD CONSTRAINT movie_genres_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES public.movies(movie_id) ON DELETE CASCADE;


--
-- Name: series_genres series_genres_genre_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.series_genres
    ADD CONSTRAINT series_genres_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES public.genres(id) ON DELETE CASCADE;


--
-- Name: series_genres series_genres_series_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.series_genres
    ADD CONSTRAINT series_genres_series_id_fkey FOREIGN KEY (series_id) REFERENCES public.series(series_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

