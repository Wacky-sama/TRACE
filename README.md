# 🚀 TRACE: Tracking Alumni for Centralized Events
**Connecting CSU–Gonzaga alumni through centralized events and smart tracking.**

> A web-based alumni management system for Cagayan State University – Gonzaga Campus that streamlines registration, check-ins, and attendance tracking using secure QR codes and real-time dashboards.

---

## ✨ Features  
- **Role-based Access**:  
  - **Admin** → Create/manage events, approve alumni registrations, print employment status forms, and manage up to two admin accounts.  
  - **Alumni** → Update profiles, accept/decline events, and generate event QR codes (active only during event time).  
- **QR Code Verification**: Secure and time-bound check-ins for events.  
- **Employment Tracking**: Admins can export alumni employment forms for record-keeping.  
- **Centralized Dashboard**: Real-time overview of alumni engagement and event participation.  

---

## 🖥️ Tech Stack  
- **Frontend**: React (19.0.1) + Vite (v6.3.5) 
- **Backend**: Python (v3.12.3) + FastAPI (v0.115.12)  
- **Database**: PostgreSQL (v16.9)

---

## ⚙️ Prerequisites 

### Linux Setup
Make sure your system has **Node.js** and **Python** installed.

### Install Node.js (LTS) on Linux
```bash
# Using apt (Debian/Ubuntu/Linux Mint)
sudo apt update
sudo apt install nodejs npm -y
```

## (Optional but recommended) Install Node Version Manager (NVM)
This makes it easy to switch Node.js versions. 
Visit [Download Node.js](https://nodejs.org/en/download) and follow the steps there.
![Linux](/home/wackysama/Pictures/Linux.png)


### Install Python 3 and pip
```bash
# Using apt (Debian/Ubuntu/Linux Mint)
sudo apt update
sudo apt install python3 python3-venv python3-pip -y

# Verify installations
node -v
npm -v
python3 --version
pip3 --version
```

---

### Windows Setup
For Windows user, make sure you have **Node.js (LTS)** and **Python 3** installed.

Install Node.js (LTS) on Windows

1. Download from [Node.js](https://nodejs.org/en/download) official site.

2. Run the installer (.msi) and follow the steps.

3. Verify installation:
```bash
node -v
npm -v
```

Install Python 3 on Windows
1. Download from [Python.org.](https://www.python.org/downloads/)
2. Run the installer and check the box that says "Add Python to PATH".
3. Verify installation:
```bash
python --version
pip --version
```

Create Virtual Environment (Windows)
```bash
# Navigate to the backend folder
cd TRACE\backend

# Create virtual environment
python -m venv venv

# Activate it
venv\Scripts\activate

# Deactivate when done
deactivate
```

---

## 🛠️ Running the System (Development Stage)

### Frontend (React + Vite)
```bash
# Navigate to the frontend directory
cd TRACE/frontend

# Install dependencies (only needed once)
npm install

# Start the Vite development server
npm run dev
```
### Frontend runs at: http://localhost:5173/

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
### Backend runs at: http://localhost:8000

---

## 👨‍💻 Developer
Built with ❤️ by **Tabugadir, Kenji "Brocks" I.**
👉 [Facebook](https://www.facebook.com/Wackyfu/).