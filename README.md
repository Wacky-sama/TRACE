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
