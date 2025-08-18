Docker setup

Services:
- db: Postgres 16, exposed on 5432
- backend: Node/Express on 8080
- frontend: Vite-built static served by Nginx on 80 (published to 5173)

Usage:
1. Build and start
   docker compose up -d --build
2. Open frontend
   http://localhost:5173
3. API
   http://localhost:8080/api
4. Stop
   docker compose down

Data persists in the named volume db_data and uploads in backend/uploads.
