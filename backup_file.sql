--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (Ubuntu 16.9-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.9 (Ubuntu 16.9-1.pgdg22.04+1)

-- Started on 2025-06-13 17:52:26 PST

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
-- TOC entry 2 (class 3079 OID 16408)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 3488 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 854 (class 1247 OID 16391)
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
-- TOC entry 218 (class 1259 OID 16516)
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
-- TOC entry 217 (class 1259 OID 16495)
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
-- TOC entry 216 (class 1259 OID 16420)
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
-- TOC entry 219 (class 1259 OID 16535)
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
-- TOC entry 3481 (class 0 OID 16516)
-- Dependencies: 218
-- Data for Name: event_attendance; Type: TABLE DATA; Schema: public; Owner: trace_admin
--

COPY public.event_attendance (id, event_id, user_id, status, registered_at, attended_at) FROM stdin;
\.


--
-- TOC entry 3480 (class 0 OID 16495)
-- Dependencies: 217
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: trace_admin
--

COPY public.events (id, title, description, location, event_date, created_by, status, approved_by, approved_at, remarks, created_at) FROM stdin;
\.


--
-- TOC entry 3479 (class 0 OID 16420)
-- Dependencies: 216
-- Data for Name: gts_responses; Type: TABLE DATA; Schema: public; Owner: trace_admin
--

COPY public.gts_responses (id, user_id, full_name, permanent_address, contact_email, telephone, mobile, civil_staus, sex, birthday, degree, specialization, year_graduated, honors, exams, pursued_advance_degree, pursued_advance_degree_reasons, trainings, is_employed, employment_status, occupation, company_name, company_address, job_sector, place_of_work, first_job, job_related_to_course, job_start_date, months_to_first_job, job_find_methods, job_reasons, job_change_reasons, job_level_first, job_level_current, first_job_salary, curriculum_relevance_first_job, curriculum_relevance_second_job, useful_competencies, curriculum_improvement_suggestions, job_satisfaction, job_satisfaction_reason, desired_services, job_problems, submitted_at) FROM stdin;
\.


--
-- TOC entry 3482 (class 0 OID 16535)
-- Dependencies: 219
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: trace_admin
--

COPY public.users (id, username, email, password_hash, lastname, firstname, middle_initial, course, batch_year, role, is_active, deleted_at, is_approved, created_at, updated_at, last_seen) FROM stdin;
6729ef7b-c54b-4e89-8a88-d1c6293cbb17	wacky	tabugadirkenjibrocks@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$5S5iGs3R5b+1pUc+ZlX/CA$K5rZVs75OG0UGiFkAYkzNab2uYsuFwzjfeIc5XqnUUQ	Tabugadir	Kenji "Brocks"	I	\N	\N	admin	t	\N	t	2025-06-13 17:30:54.81682	2025-06-13 09:52:00.526581	2025-06-13 09:52:00.526276
97dc98d4-16df-4933-8c63-085f38d477ff	xed	tagubaphilipjoshuav@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$HmPM2TsnhHDufS/lHEMIYQ$uSlzFWErg/Mko9wWHn+mL7G9Ym6TivBlmy2asrirSjk	Taguba	Philip Joshua	V	\N	\N	admin	t	\N	t	2025-06-13 09:39:28.701098	2025-06-13 09:39:28.701102	2025-06-13 09:39:28.701104
b18d9dc8-bbc3-4f35-8ef8-11dbe2591d4f	louieboy	louieboysalviejo06@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$as3Z2/ufc87Zm9Oa09o7hw$XF5H9Em/+FCj1hD5QF8EVme4C/OtB9P1LfitkRUAsCo	Salviejo	Victor Louis	R	\N	\N	organizer	t	\N	t	2025-06-13 09:40:12.260692	2025-06-13 09:40:12.260695	2025-06-13 09:40:12.260696
\.


--
-- TOC entry 3324 (class 2606 OID 16524)
-- Name: event_attendance event_attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: trace_admin
--

ALTER TABLE ONLY public.event_attendance
    ADD CONSTRAINT event_attendance_pkey PRIMARY KEY (id);


--
-- TOC entry 3322 (class 2606 OID 16505)
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: trace_admin
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- TOC entry 3320 (class 2606 OID 16428)
-- Name: gts_responses gts_responses_pkey; Type: CONSTRAINT; Schema: public; Owner: trace_admin
--

ALTER TABLE ONLY public.gts_responses
    ADD CONSTRAINT gts_responses_pkey PRIMARY KEY (id);


--
-- TOC entry 3326 (class 2606 OID 16544)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: trace_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3328 (class 2606 OID 16542)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: trace_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3330 (class 2606 OID 16546)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: trace_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 3334 (class 2606 OID 16525)
-- Name: event_attendance event_attendance_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: trace_admin
--

ALTER TABLE ONLY public.event_attendance
    ADD CONSTRAINT event_attendance_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- TOC entry 3335 (class 2606 OID 16562)
-- Name: event_attendance event_attendance_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: trace_admin
--

ALTER TABLE ONLY public.event_attendance
    ADD CONSTRAINT event_attendance_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3332 (class 2606 OID 16557)
-- Name: events events_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: trace_admin
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 3333 (class 2606 OID 16552)
-- Name: events events_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: trace_admin
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3331 (class 2606 OID 16547)
-- Name: gts_responses gts_responses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: trace_admin
--

ALTER TABLE ONLY public.gts_responses
    ADD CONSTRAINT gts_responses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2025-06-13 17:52:42 PST

--
-- PostgreSQL database dump complete
--

