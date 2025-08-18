# 🚀 TRACE: Tracking Alumni for Centralized Events

> An event management system for CSU-Gonzaga that streamlines alumni registration, check-in, and attendance tracking using secure QR code verification and real-time dashboards.

## ⚙️ Prerequisites (Linux Setup)

Make sure your system has **Node.js** and **Python** installed.

### Install Node.js (LTS) on Linux
```bash
# Using apt (Debian/Ubuntu/Linux Mint)
sudo apt update
sudo apt install nodejs npm -y
```

## (Optional but recommended) Install Node Version Manager (NVM)
## This makes it easy to switch Node.js versions. 
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

### Guide by: Tabugadir, Kenji "Brocks" I.
### Visit my [Facebook](https://www.facebook.com/Wackyfu/).