# 📈 Marketing Campaign Performance Tracker

A Full-Stack dashboard designed for digital marketers to track, analyze, and export campaign KPIs. This project bridges the gap between marketing spend data and technical data visualization.



## The Value Proposition
As a digital marketer with 8+ years of experience, I built this tool to solve the common problem of manual KPI calculation. It automates the tracking of:
* **CTR** (Click-Through Rate)
* **CPC** (Cost Per Click)
* **CPA** (Cost Per Acquisition)

## Tech Stack
- **Backend:** FastAPI (Python) - High-performance REST API.
- **Frontend:** React + Vite - Modern, reactive UI.
- **Database:** SQLite + SQLAlchemy - Reliable local data persistence.
- **Charts:** Recharts - Interactive performance visualization.

## Features
- **Real-time Analytics:** Auto-calculates marketing metrics as you enter spend and conversion data.
- **Data Persistence:** Uses a SQL database to save campaigns across sessions.
- **Export Capabilities:** One-click CSV export for external reporting in Excel or Google Sheets. (Ongoing)
- **CRUD Functionality:** Full capability to create, read, and delete campaign records. (delete function in progress)

## Installation & Setup

### 1. Backend Setup

# Navigate to the root folder
python -m venv venv
source venv/bin/activate  # Mac/Linux
.\venv\Scripts\activate   # Windows
pip install -r requirements.txt
python main.py

### 2. Frontend Setup
cd marketing-frontend
npm install
npm run dev
