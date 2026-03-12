# Medical Data Platform

This project implements a **scalable REST API for medical data processing**, based on the design in `medical_data_rest_api_project.md`.

## Components

- **Backend**: Node.js + Express + MySQL + JWT auth
- **Frontend**: React + Tailwind (starter shell)
- **Database**: MySQL schema + migration script
- **DevOps**: Docker + docker-compose

## Getting Started

### Backend

1. Copy `.env.example` to `.env` and update MySQL connection settings.
2. Install dependencies:

```bash
cd backend
npm install
```

3. Run database migrations (creates schema via Knex):

```bash
npm run migrate
```

4. Start the server:

```bash
npm run dev
```

5. Open Swagger UI for the API:

```
http://localhost:5000/api/docs
```

### Database

Migrations are stored in `backend/migrations/` and can be run using:

```bash
cd backend
npm run migrate
```

### Tests

From the backend folder:

```bash
npm test
```

### Frontend (React)

From the project root:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at http://localhost:3000 and communicate with the backend at http://localhost:5000 by default.

### Docker

From the project root:

```bash
docker-compose up --build
```
