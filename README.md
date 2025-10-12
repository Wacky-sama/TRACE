# TRACE: Tracking Alumni for Centralized Events

**Connecting CSU–Gonzaga alumni through centralized events and smart tracking.**

> A web-based alumni management system for Cagayan State University – Gonzaga Campus that streamlines registration, check-ins, and attendance tracking using secure QR codes and real-time dashboards.

---

## Features

- **Role-based Access**:
  - **Admin** → Create/manage events, approve alumni registrations, print employment status forms, and manage up to two admin accounts.
  - **Alumni** → Update profiles, accept/decline events, and generate event QR codes (active only during event time).
- **QR Code Verification**: Secure and time-bound check-ins for events.
- **Employment Tracking**: Admins can export alumni employment forms for record-keeping.
- **Centralized Dashboard**: Real-time overview of alumni engagement and event participation.

---

## Tech Stack

- **Frontend**: React (19.1.0) + Vite (v6.3.5)
- **Backend**: Python (v3.12.3) + FastAPI (v0.115.12)
- **Database**: PostgreSQL (v16.10)

---

## Prerequisites

### Linux Setup

Make sure your system has **Node.js**, **Python**, and **PostgreSQL** installed.

### Install Node.js (LTS) on Linux

```bash
# Using apt (Debian/Ubuntu/Linux Mint)
sudo apt update
sudo apt install nodejs npm -y
```

### (Optional but recommended) Install Node Version Manager (NVM)

This makes it easy to switch Node.js versions.
Visit [Download Node.js](https://nodejs.org/en/download) and follow the steps there.

### Install Python 3 and pip

```bash
sudo apt update
sudo apt install python3 python3-venv python3-pip -y
```

### Verify installations

```bash
node -v
npm -v
python3 --version
pip3 --version
```

### Install PostgreSQL

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib -y

# Enable and start PostgreSQL service
sudo systemctl enable postgresql
sudo systemctl start postgresql

# Verify installation
psql --version
```

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
ALTER SCHEMA public OWNER TO trace_user;
GRANT ALL ON SCHEMA public TO trace_user;
ALTER ROLE trace_user SET search_path TO trace_user, public;

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
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid NOT NULL,
    action_type actiontype NOT NULL,
    description json NOT NULL,
    target_user_id uuid,
    meta_data json,
    created_at timestamp without time zone NOT NULL DEFAULT now()
);

# Create the event_attendance table
CREATE TABLE event_attendance (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id uuid NOT NULL,
    user_id uuid NOT NULL,
    status varchar(10) DEFAULT 'registered',
    registered_at timestamp without time zone DEFAULT now(),
    attended_at timestamp without time zone
);

# Create the event table
CREATE TABLE events (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    title varchar NOT NULL,
    description text,
    location varchar,
    event_date date NOT NULL,
    created_by uuid NOT NULL,
    status varchar(20) DEFAULT 'pending',
    approved_by uuid,
    approved_at timestamp without time zone,
    remarks text,
    created_at timestamp without time zone DEFAULT now()
);

# Create the gts_responses table
CREATE TABLE gts_responses (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid NOT NULL,
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
    trainings jsonb,
    ever_employed boolean,
    is_employed boolean,
    non_employed_reasons text[],
    employment_status text,
    occupation varchar[],
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
    submitted_at date DEFAULT now()
);

# Create the users table
CREATE TABLE users ( 
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        username VARCHAR NOT NULL UNIQUE,
        email VARCHAR NOT NULL UNIQUE,
        password_hash VARCHAR NOT NULL,
        lastname VARCHAR NOT NULL,
        firstname VARCHAR NOT NULL,
        middle_initial CHAR(1),
        name_extension VARCHAR,
        course VARCHAR,
        batch_year INT,
        role userrole NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        deleted_at TIMESTAMP,
        is_approved BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now(),
        last_seen TIMESTAMP,
        birthday DATE,
        present_address TEXT,
        contact_number TEXT,
        sex sexenum NOT NULL,
        permanent_address VARCHAR
);

# Now alter each table for FK:
# Activity Logs:
ALTER TABLE activity_logs
    ADD CONSTRAINT activity_logs_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE activity_logs
    ADD CONSTRAINT activity_logs_target_user_id_fkey
    FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE SET NULL;

# Event Attendance:
ALTER TABLE event_attendance
    ADD CONSTRAINT event_attendance_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE event_attendance
    ADD CONSTRAINT event_attendance_event_id_fkey
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;

# Events:
ALTER TABLE events
    ADD CONSTRAINT events_created_by_fkey
    FOREIGN KEY (created_by) REFERENCES users(id);

ALTER TABLE events
    ADD CONSTRAINT events_approved_by_fkey
    FOREIGN KEY (approved_by) REFERENCES users(id);

# GTS Responses:
ALTER TABLE gts_responses
    ADD CONSTRAINT gts_responses_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
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

### Install pgAdmin web

Install the public key for the repository:

```bash
curl -fsS https://www.pgadmin.org/static/packages_pgadmin_org.pub | sudo gpg --dearmor -o /usr/share/keyrings/packages-pgadmin-org.gpg
```

Create the repository configuration file:

```bash
sudo sh -c 'echo "deb [signed-by=/usr/share/keyrings/packages-pgadmin-org.gpg] https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/$(lsb_release -cs) pgadmin4 main" > /etc/apt/sources.list.d/pgadmin4.list && apt update'
```

If you encounter an error like this:

E: The repository '<https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/xia> pgadmin4 Release' does not have a Release file.

N: Updating from such a repository can't be done securely, and is therefore disabled by default.

N: See apt-secure(8) manpage for repository creation and user configuration details.

Just edit the pgAdmin repo list file:

```bash
sudo nano /etc/apt/sources.list.d/pgadmin4.list
```

Replace $(lsb_release -cs) with your Ubuntu base codename (for Mint 22 "Xia", use noble).:

```bash
deb [signed-by=/usr/share/keyrings/packages-pgadmin-org.gpg] https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/xia pgadmin4 main
```

To this(noble):

```bash
deb [signed-by=/usr/share/keyrings/packages-pgadmin-org.gpg] https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/noble pgadmin4 main
```

Update and install:

```bash
sudo apt update
sudo apt install pgadmin4-web
```

Run initial setup:

```bash
sudo /usr/pgadmin4/bin/setup-web.sh
```

## After that you can login at: **<http://localhost/pgadmin4>**

### Windows Setup

For Windows user, make sure you have **Docker**, **Node.js (LTS)**, **Python 3**, and **PostgreSQL** installed.

### Install Node.js

1. Download from [Node.js](https://nodejs.org/en/download) official site.
2. Install using Chocolatey with npm
3. Follow the instructions.
4. After installation is done, restart/re-open your terminal.
5. Then verify installation in:

```bash
node -v
npm -v
```

### Install Python 3

1. Download from [Python.org](https://www.python.org/downloads/)
2. Run the installer and check the box that says "Add Python to PATH".
3. Verify installation:

```bash
python --version
pip --version
```

### Install PostgreSQL

**Note:** Don't skip any installation.

1. Download from [PostgreSQL.org](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)
2. Run the installer (leave port 5432 unless you need custom).
3. Uncheck Stack Builder.
4. During install, note down the password for the default postgres user.
5. Open CMD or PowerShell run it as Administrator and create the database and user:

**Note:** Skip this step if you are my Collaborator.

```bash
# Run:
psql -U postgres -h localhost
# Enter your PostgreSQL password (the one you set during installation).

# Creating database
CREATE DATABASE trace_db;
CREATE USER trace_user WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE trace_db TO trace_user;

\q
```

### Steps on how to restore the full_trace_backup

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

---

## Running the System for Linux and Windows (Development Stage)

### Linux

### Frontend (React + Vite)

```bash
# Navigate to the frontend directory
cd TRACE/frontend

# Install dependencies (only needed once)
npm install

# Start the Vite development server
npm run dev
```

### Frontend runs at

- <http://localhost:5173/>
- http://your_ip_address:5173/

### Backend (FastAPI)

```bash
# Navigate to the backend directory
cd TRACE/backend

# Create and activate a virtual environment (only needed once)
python3 -m venv venv
source venv/bin/activate # deactivate with: deactivate

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI development server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Backend runs at

- <http://localhost:8000>
- http://your_ip_address:8000

### Windows

### Frontend (React + Vite)

```bash
# Navigate to the frontend directory
cd .\frontend\

# Install dependencies (only needed once)
npm install

# Start the Vite development server
npm run dev
```

### Frontend runs at

- <http://localhost:5173/>
- http://your_ip_address:5173/

### Backend (FastAPI)

```bash
# Navigate to the backend directory
cd .\backend\

# Create and activate a virtual environment (only needed once)
python -m venv venv
.\venv\Scripts\activate # deactivate with: deactivate

# Install dependencies
pip install -r .\requirements.txt

# Run the FastAPI development server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Backend runs at

- <http://localhost:8000>
- http://your_ip_address:8000

---

## Developer

Built by [**Tabugadir, Kenji "Brocks" I.**](https://www.facebook.com/Wackyfu/)
