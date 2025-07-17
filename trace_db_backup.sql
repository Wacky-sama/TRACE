--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (Ubuntu 16.9-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.9 (Ubuntu 16.9-1.pgdg22.04+1)

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
-- Name: trace_db; Type: DATABASE; Schema: -; Owner: trace_admin
--

CREATE DATABASE trace_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_PH.UTF-8';


ALTER DATABASE trace_db OWNER TO trace_admin;

\connect trace_db

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
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: userrole; Type: TYPE; Schema: public; Owner: trace_admin
--

CREATE TYPE public.userrole AS ENUM (
    'admin',
    'organizer',
    'alumni'
);


ALTER TYPE public.userrole OWNER TO trace_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: event_attendance; Type: TABLE; Schema: public; Owner: trace_admin
--

CREATE TABLE public.event_attendance (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    event_id uuid NOT NULL,
    user_id uuid NOT NULL,
    status character varying(10) DEFAULT 'registered'::character varying,
    registered_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    attended_at timestamp without time zone,
    CONSTRAINT event_attendance_status_check CHECK (((status)::text = ANY ((ARRAY['registered'::character varying, 'attended'::character varying, 'no_show'::character varying])::text[])))
);


ALTER TABLE public.event_attendance OWNER TO trace_admin;

--
-- Name: events; Type: TABLE; Schema: public; Owner: trace_admin
--

CREATE TABLE public.events (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title text NOT NULL,
    description text,
    location text,
    event_date date NOT NULL,
    created_by uuid NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    approved_by uuid,
    approved_at timestamp without time zone,
    remarks text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT events_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'declined'::character varying])::text[])))
);


ALTER TABLE public.events OWNER TO trace_admin;

--
-- Name: gts_responses; Type: TABLE; Schema: public; Owner: trace_admin
--

CREATE TABLE public.gts_responses (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    full_name text NOT NULL,
    permanent_address text NOT NULL,
    contact_email text NOT NULL,
    telephone text,
    mobile text NOT NULL,
    civil_staus text NOT NULL,
    sex text NOT NULL,
    birthday date NOT NULL,
    degree text,
    specialization text,
    year_graduated integer,
    honors text,
    exams jsonb,
    pursued_advance_degree boolean,
    pursued_advance_degree_reasons text[],
    trainings jsonb,
    is_employed boolean,
    employment_status text,
    occupation text,
    company_name text,
    company_address text,
    job_sector text,
    place_of_work text,
    first_job boolean,
    job_related_to_course boolean,
    job_start_date date,
    months_to_first_job integer,
    job_find_methods text[],
    job_reasons text[],
    job_change_reasons text[],
    job_level_first text,
    job_level_current text,
    first_job_salary numeric,
    curriculum_relevance_first_job boolean,
    curriculum_relevance_second_job boolean,
    useful_competencies text[],
    curriculum_improvement_suggestions text,
    job_satisfaction text,
    job_satisfaction_reason text,
    desired_services text,
    job_problems text,
    submitted_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.gts_responses OWNER TO trace_admin;

--
-- Name: users; Type: TABLE; Schema: public; Owner: trace_admin
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username character varying NOT NULL,
    email character varying NOT NULL,
    password_hash character varying NOT NULL,
    lastname character varying NOT NULL,
    firstname character varying NOT NULL,
    middle_initial character varying(1),
    course character varying,
    batch_year integer,
    role public.userrole NOT NULL,
    is_active boolean,
    deleted_at timestamp without time zone,
    is_approved boolean,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    last_seen timestamp without time zone
);


ALTER TABLE public.users OWNER TO trace_admin;

--
-- Data for Name: event_attendance; Type: TABLE DATA; Schema: public; Owner: trace_admin
--

COPY public.event_attendance (id, event_id, user_id, status, registered_at, attended_at) FROM stdin;
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: trace_admin
--

COPY public.events (id, title, description, location, event_date, created_by, status, approved_by, approved_at, remarks, created_at) FROM stdin;
9b5109da-efae-4340-8600-aecb1a72ca07	Testing for Development 1	Hello, Alumni! Hello, Admin!	Conference Hall	2025-07-31	6729ef7b-c54b-4e89-8a88-d1c6293cbb17	approved	\N	\N	\N	2025-07-16 13:52:54.928609
\.


--
-- Data for Name: gts_responses; Type: TABLE DATA; Schema: public; Owner: trace_admin
--

COPY public.gts_responses (id, user_id, full_name, permanent_address, contact_email, telephone, mobile, civil_staus, sex, birthday, degree, specialization, year_graduated, honors, exams, pursued_advance_degree, pursued_advance_degree_reasons, trainings, is_employed, employment_status, occupation, company_name, company_address, job_sector, place_of_work, first_job, job_related_to_course, job_start_date, months_to_first_job, job_find_methods, job_reasons, job_change_reasons, job_level_first, job_level_current, first_job_salary, curriculum_relevance_first_job, curriculum_relevance_second_job, useful_competencies, curriculum_improvement_suggestions, job_satisfaction, job_satisfaction_reason, desired_services, job_problems, submitted_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: trace_admin
--

COPY public.users (id, username, email, password_hash, lastname, firstname, middle_initial, course, batch_year, role, is_active, deleted_at, is_approved, created_at, updated_at, last_seen) FROM stdin;
bcabea0b-e652-4e60-b36c-f27fe540346d	xed	tagubaphilipjoshuav@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$8l6LMca4t7aWUooRolSqlQ$Cte47qg3K55k++lMpqnt1Vub1u4jST5hY0NaaPczcDA	Taguba	Philip Joshua	V	\N	\N	admin	t	\N	t	2025-06-13 10:58:49.791987	2025-06-19 09:14:28.792237	2025-06-19 09:14:28.791567
6729ef7b-c54b-4e89-8a88-d1c6293cbb17	wacky	tabugadirkenjibrocks@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$5S5iGs3R5b+1pUc+ZlX/CA$K5rZVs75OG0UGiFkAYkzNab2uYsuFwzjfeIc5XqnUUQ	Tabugadir	Kenji "Brocks"	I	\N	\N	admin	t	\N	t	2025-06-13 17:30:54.81682	2025-07-16 14:08:52.408228	2025-07-16 14:08:52.407923
9b3c1a73-abae-455d-a4c4-fdf4c24e7132	louieboy	louieboysalviejo06@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$rvWeE6L0/l/rfa9VilGKcQ$gX+sCVy1XtE6S7pCrjyTiubDN7RR7OzBx/7cxyVC7hA	Salviejo	Victor Louis	R	\N	\N	organizer	t	\N	t	2025-06-13 10:56:53.414138	2025-07-14 07:35:26.946204	2025-07-14 07:35:26.945845
44ead4c4-70d6-487e-bcdd-c2f583ab46cb	hansooyoung	hsykenji@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$OWdMaY1RKqX0HgOAsHYuhQ$PpJjCPs26dlAkEo1LfYvmoIF57KBALOjQVuM6jpYzII	Sooyoung	Han		BACHELOR OF ELEMENTARY EDUCATION	2020	alumni	t	\N	t	2025-06-21 05:58:12.999105	2025-07-16 14:09:15.3105	2025-07-16 14:09:15.310049
\.


--
-- Name: event_attendance event_attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: trace_admin
--

ALTER TABLE ONLY public.event_attendance
    ADD CONSTRAINT event_attendance_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: trace_admin
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: gts_responses gts_responses_pkey; Type: CONSTRAINT; Schema: public; Owner: trace_admin
--

ALTER TABLE ONLY public.gts_responses
    ADD CONSTRAINT gts_responses_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: trace_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: trace_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: trace_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: event_attendance event_attendance_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: trace_admin
--

ALTER TABLE ONLY public.event_attendance
    ADD CONSTRAINT event_attendance_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- Name: event_attendance event_attendance_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: trace_admin
--

ALTER TABLE ONLY public.event_attendance
    ADD CONSTRAINT event_attendance_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: events events_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: trace_admin
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: events events_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: trace_admin
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: gts_responses gts_responses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: trace_admin
--

ALTER TABLE ONLY public.gts_responses
    ADD CONSTRAINT gts_responses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

