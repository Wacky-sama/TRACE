# Installation Guide on both Linux and Windows

## Linux

Make sure your system has **Node.js**, **Python**, and **PostgreSQL** installed.

### Install Node.js (LTS)

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

## Windows Setup

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
