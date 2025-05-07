# Analytics Dashboard

## Setup Instructions

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the database:
   - Ensure you have a PostgreSQL database running.
   - Update the `.env` file with your database connection details.
   - Initialize the database schema:
     ```bash
     psql -d <your_database_name> -f db/init.sql
     ```
   - Seed the database:
     ```bash
     node db/seed.js
     ```
4. Start the backend server:
   ```bash
   node server.js
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Open `index.html` in your browser to view the dashboard.