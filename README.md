# HR Talent Acquisition App

A full-featured recruitment platform designed for HR teams, recruiters, and hiring managers to manage talent acquisition end-to-end.

## Overview
This application helps teams:
- publish and manage open roles
- track candidates across the hiring process
- review resumes and profiles
- send tailored outreach messages
- monitor recruiting KPIs and funnel performance
- support candidate screening with questionnaires

## Stack
- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express
- Persistence: JSON file store (production-ready to replace with PostgreSQL)
- Deployment: Docker-ready and cloud-ready configuration

## Features
- Job posting dashboard
- Candidate pipeline and status tracking
- Candidate source tracking
- Resume upload and profile capture
- Screening questionnaire management
- Communication templates
- Talent acquisition analytics
- Role-based access structure
- Responsive UX for desktop and mobile

## Repository structure
- `backend/` — Express API server
- `frontend/` — React app
- `docker-compose.yml` — local container orchestration
- `.env.example` — environment variables

## Quick start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the app in development mode:
   ```bash
   npm run dev
   ```

3. Open the frontend in your browser:
   ```text
   http://localhost:5173
   ```

4. API base URL:
   ```text
   http://localhost:5000/api
   ```

## Production deployment
This project includes Docker configuration and can be adapted for cloud deployments on AWS, Azure, Render, Railway, or similar providers.

### Build the frontend
```bash
npm run build
```

### Run backend only
```bash
npm run start --workspace backend
```

## Environment setup
Copy `.env.example` and customize it before deployment.

## Notes
This version provides a working full-stack foundation for a talent acquisition platform. For production use, you can replace the file-based store with PostgreSQL and add authentication, file storage, and external integrations.
