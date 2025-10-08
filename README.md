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
CREATE USER trace_user WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE trace_db TO trace_user;

\q
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

E: The repository 'https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/xia pgadmin4 Release' does not have a Release file.

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

## After that you can login at: **http://localhost/pgadmin4**

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
3. Select all the Components.
4. On the Stack Builder, select pgBouncer and Npgsql.
5. During install, note down the password for the default postgres user.
6. Open SQL Shell (psql) and create the database and user:

**Note:** Skip this step if you are my Collaborator.
```bash
CREATE DATABASE trace_db;
CREATE USER trace_user WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE trace_db TO trace_user;
```

---

## Running the System (Development Stage)

### Frontend (React + Vite)

```bash
# Navigate to the frontend directory
cd TRACE/frontend

# Install dependencies (only needed once)
npm install

# Start the Vite development server
npm run dev
```

### Frontend runs at:

- http://localhost:5173/
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

### Backend runs at:

- http://localhost:8000
- http://your_ip_address:8000

---

## Developer

Built by [**Tabugadir, Kenji "Brocks" I.**](https://www.facebook.com/Wackyfu/)
