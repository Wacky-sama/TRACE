# Running the System for Linux and Windows (Development Stage)

## Linux

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

## Windows

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