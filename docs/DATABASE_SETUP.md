# Database Setup on both Linux and Windows

## Linux

### Create Database and User

**Note:** Skip this step if you are my Collaborator.

```bash
# Switch to postgres user
sudo -u postgres psql

# Create a password for postgres
ALTER USER postgres WITH PASSWORD 'YourStrongPassword';

# Inside psql shell:
CREATE DATABASE trace_db;
CREATE ROLE trace_user WITH PASSWORD 'yourpassword';
ALTER ROLE trace_user CREATEDB;
ALTER DATABASE trace_db OWNER TO trace_user;
GRANT ALL PRIVILEGES ON DATABASE trace_db TO trace_user;

# Creating extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

# Creating data types
CREATE TYPE sexenum AS ENUM ('male', 'female');
CREATE TYPE userrole AS ENUM ('admin', 'alumni');
CREATE TYPE actiontype AS ENUM ('register', 'approve', 'decline', 'delete', 'update', 'login', 'logout');

\q
```

### Create Table

Inside trace_db:

```bash
# Create the activity_logs table
CREATE TABLE activity_logs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    description json NOT NULL,
    target_user_id uuid,
    meta_data json,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    action_type public.actiontype NOT NULL,
    is_read boolean
);

# Create the event_attendance table
CREATE TABLE event_attendance (
    id uuid NOT NULL,
    event_id uuid NOT NULL,
    user_id uuid NOT NULL,
    status character varying(10),
    registered_at timestamp without time zone,
    attended_at timestamp without time zone,
    qr_token character varying,
    is_valid boolean,
    scanned_at timestamp without time zone
);

# Create the event table
CREATE TABLE events (
    id uuid NOT NULL,
    title character varying NOT NULL,
    description text,
    location character varying,
    created_by uuid NOT NULL,
    status character varying(20),
    approved_by uuid,
    approved_at timestamp without time zone,
    remarks text,
    created_at timestamp without time zone,
    start_date date NOT NULL,
    end_date date NOT NULL
);

# Create the gts_responses table
CREATE TABLE gts_responses (
    id uuid NOT NULL,
    user_id uuid,
    full_name text NOT NULL,
    permanent_address text NOT NULL,
    contact_email text NOT NULL,
    telephone text,
    mobile text NOT NULL,
    civil_status text,
    sex text NOT NULL,
    birthday date NOT NULL,
    degree text,
    specialization text,
    year_graduated integer,
    honors text,
    exams jsonb,
    pursued_advance_degree boolean,
    pursued_advance_degree_reasons text[],
    ever_employed boolean,
    is_employed boolean,
    employment_status text,
    occupation character varying[],
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
    submitted_at date DEFAULT now(),
    non_employed_reasons text[],
    present_address text NOT NULL
);

# Create the trainings table
CREATE TABLE trainings (
    id uuid NOT NULL,
    gts_id uuid NOT NULL,
    title character varying NOT NULL,
    duration character varying,
    credits_earned character varying,
    institution character varying
);

# Create the users table
CREATE TABLE users ( 
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username character varying NOT NULL,
    role public.userrole NOT NULL,
    email character varying NOT NULL,
    password_hash character varying NOT NULL,
    lastname character varying NOT NULL,
    firstname character varying NOT NULL,
    middle_initial character varying(1),
    name_extension character varying,
    birthday date,
    sex public.sexenum NOT NULL,
    course character varying,
    batch_year integer,
    is_active boolean DEFAULT true,
    deleted_at timestamp without time zone,
    is_approved boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    last_seen timestamp without time zone,
    present_address character varying,
    permanent_address character varying,
    contact_number character varying(20)
);

# Now alter each table for FK:
# Activity Logs:
ALTER TABLE activity_logs
    ADD CONSTRAINT activity_logs_target_user_id_fkey
    FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE activity_logs
    ADD CONSTRAINT activity_logs_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

# Event Attendance:
ALTER TABLE event_attendance
    ADD CONSTRAINT event_attendance_event_id_fkey 
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;

ALTER TABLE event_attendance
    ADD CONSTRAINT event_attendance_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

# Events:
ALTER TABLE events
    ADD CONSTRAINT events_approved_by_fkey 
    FOREIGN KEY (approved_by) REFERENCES users(id);

ALTER TABLE events
    ADD CONSTRAINT events_created_by_fkey 
    FOREIGN KEY (created_by) REFERENCES users(id);

# GTS Responses:
ALTER TABLE gts_responses
    ADD CONSTRAINT gts_responses_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

# Trainings:
ALTER TABLE ONLY trainings
    ADD CONSTRAINT trainings_gts_id_fkey 
    FOREIGN KEY (gts_id) REFERENCES gts_responses(id);
```

### Steps on how to restore the full_trace_backup

**Note:** This is for my Collaborators.

Put the full_trace_backup on TRACE folder.

Open your Terminal:

```bash
# Command for backup including Database and Roles
sudo -u postgres psql -f /path/to/TRACE/full_trace_backup_20250917_010857.sql

# Connect to trace_db using trace_admin
psql -U trace_admin -d trace_db -h localhost -W
```

## Windows

### Create Database and User

Open CMD or PowerShell run it as Administrator and create the database and user:

**Note:** Skip this step if you are my Collaborator.

```bash
# Run:
psql -U postgres -h localhost
# Enter your PostgreSQL password (the one you set during installation).

# Inside psql shell:
CREATE DATABASE trace_db;
CREATE ROLE trace_user WITH PASSWORD 'yourpassword';
ALTER ROLE trace_user CREATEDB;
ALTER DATABASE trace_db OWNER TO trace_user;
GRANT ALL PRIVILEGES ON DATABASE trace_db TO trace_user;

# Creating extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

# Creating data types
CREATE TYPE sexenum AS ENUM ('male', 'female');
CREATE TYPE userrole AS ENUM ('admin', 'alumni');
CREATE TYPE actiontype AS ENUM ('register', 'approve', 'decline', 'delete', 'update', 'login', 'logout');;

\q
```

### Create Table

Inside trace_db:

```bash
# Create the activity_logs table
CREATE TABLE activity_logs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    description json NOT NULL,
    target_user_id uuid,
    meta_data json,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    action_type public.actiontype NOT NULL,
    is_read boolean
);

# Create the event_attendance table
CREATE TABLE event_attendance (
    id uuid NOT NULL,
    event_id uuid NOT NULL,
    user_id uuid NOT NULL,
    status character varying(10),
    registered_at timestamp without time zone,
    attended_at timestamp without time zone,
    qr_token character varying,
    is_valid boolean,
    scanned_at timestamp without time zone
);

# Create the event table
CREATE TABLE events (
    id uuid NOT NULL,
    title character varying NOT NULL,
    description text,
    location character varying,
    created_by uuid NOT NULL,
    status character varying(20),
    approved_by uuid,
    approved_at timestamp without time zone,
    remarks text,
    created_at timestamp without time zone,
    start_date date NOT NULL,
    end_date date NOT NULL
);

# Create the gts_responses table
CREATE TABLE gts_responses (
    id uuid NOT NULL,
    user_id uuid,
    full_name text NOT NULL,
    permanent_address text NOT NULL,
    contact_email text NOT NULL,
    telephone text,
    mobile text NOT NULL,
    civil_status text,
    sex text NOT NULL,
    birthday date NOT NULL,
    degree text,
    specialization text,
    year_graduated integer,
    honors text,
    exams jsonb,
    pursued_advance_degree boolean,
    pursued_advance_degree_reasons text[],
    ever_employed boolean,
    is_employed boolean,
    employment_status text,
    occupation character varying[],
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
    submitted_at date DEFAULT now(),
    non_employed_reasons text[],
    present_address text NOT NULL
);

# Create the trainings table
CREATE TABLE trainings (
    id uuid NOT NULL,
    gts_id uuid NOT NULL,
    title character varying NOT NULL,
    duration character varying,
    credits_earned character varying,
    institution character varying
);

# Create the users table
CREATE TABLE users ( 
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username character varying NOT NULL,
    role public.userrole NOT NULL,
    email character varying NOT NULL,
    password_hash character varying NOT NULL,
    lastname character varying NOT NULL,
    firstname character varying NOT NULL,
    middle_initial character varying(1),
    name_extension character varying,
    birthday date,
    sex public.sexenum NOT NULL,
    course character varying,
    batch_year integer,
    is_active boolean DEFAULT true,
    deleted_at timestamp without time zone,
    is_approved boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    last_seen timestamp without time zone,
    present_address character varying,
    permanent_address character varying,
    contact_number character varying(20)
);

# Now alter each table for FK:
# Activity Logs:
ALTER TABLE activity_logs
    ADD CONSTRAINT activity_logs_target_user_id_fkey
    FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE activity_logs
    ADD CONSTRAINT activity_logs_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

# Event Attendance:
ALTER TABLE event_attendance
    ADD CONSTRAINT event_attendance_event_id_fkey 
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;

ALTER TABLE event_attendance
    ADD CONSTRAINT event_attendance_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

# Events:
ALTER TABLE events
    ADD CONSTRAINT events_approved_by_fkey 
    FOREIGN KEY (approved_by) REFERENCES users(id);

ALTER TABLE events
    ADD CONSTRAINT events_created_by_fkey 
    FOREIGN KEY (created_by) REFERENCES users(id);

# GTS Responses:
ALTER TABLE gts_responses
    ADD CONSTRAINT gts_responses_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

# Trainings:
ALTER TABLE ONLY trainings
    ADD CONSTRAINT trainings_gts_id_fkey 
    FOREIGN KEY (gts_id) REFERENCES gts_responses(id);
```

### Steps on how to restore the full_trace_backup on linux

**Note:** This is for my Collaborators.

Put the full_trace_backup on Downloads folder.

Open CMD or PowerShell:

```bash
# Change directory 
cd "Program Files\PostgreSQL\18\bin"

# Command for backup including Database and Roles
psql -U postgres -f "C:\Users\username\Downloads\full_trace_backup_20250917_010857.sql"

# Connect to trace_db using trace_admin
psql -U trace_admin -d trace_db -h localhost -W
```