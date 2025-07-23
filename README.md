# 🚀 TRACE: Tracking Alumni for Centralized Events

> A centralized platform for managing and tracking alumni-related events, approvals, and user roles.

## 🛠️ Running the System (Development Stage)

### Frontend
```bash
# Navigate to the frontend directory
cd TRACE/frontend

# Install dependencies (only needed once)
npm install

# Start the Vite development server
npm run dev
```

### Backend
```bash
# Navigate to the backend directory
cd TRACE/backend

# Activate the Python virtual environment
source venv/bin/activate

# Run the FastAPI development server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```