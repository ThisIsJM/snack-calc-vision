# Project Setup Guide

## Prerequisites

- Node.js (v14.18.0 or higher)
- Python (v3.7 or higher)
- pip (Python package installer)

## Clone the repository
```
git clone https://github.com/ThisIsJM/snack-calc-vision.git
cd snack-calc-vision
```

## Reminder
- Change the `SERVER_URL` to `http://localhost:5000` inside the `frontend/server-address.ts` file 

## Frontend Setup (Vite)
1. Move to the frontend directory
```
cd frontend
```
2. Initialize project
```
npm ci
npm run dev
```

## Backend Setup (Flask)
1. Move to the backend directory <br/>
`NOTE: Create a new terminal to ensure that the terminal end path is snack-calc-vision/backend`
```
cd backend
```

2. Setup Virtual Environment
```
python -m venv .venv
.venv\scripts\activate
```

3. Install dependencies
```
pip install -r requirements.txt
```

4. Setup Environment Variables
```
SUPABASE_URL=YOUR-SUPABASE-URL
SUPABASE_PRIVATE_KEY=YOUR-SUPABASE-PRIVATE-KEY
```

5. Run the Backend
```
python main.py
```

