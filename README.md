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
- **Frontend**: React + Vite  
- **Backend**: Python (FastAPI)  
- **Database**: PostgreSQL  

---

## ⚙️ Prerequisites (Linux Setup)

Make sure your system has **Node.js** and **Python** installed.

### Install Node.js (LTS) on Linux
```bash
# Using apt (Debian/Ubuntu/Linux Mint)
sudo apt update
sudo apt install nodejs npm -y
```

## (Optional but recommended) Install Node Version Manager (NVM)
This makes it easy to switch Node.js versions. 
## Visit [Download Node.js](https://nodejs.org/en/download) 
## Just follow the steps there.

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

## 👨‍💻 Developer
Built with love by: Tabugadir, Kenji "Brocks" I.
👉 [Facebook](https://www.facebook.com/Wackyfu/).