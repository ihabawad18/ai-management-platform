# AI Platform Management

## Quick Start (Docker Compose)

- Prereqs: Docker & Docker Compose installed.
- Copy environment template: `cp .env.example .env` (fill secrets like `OPENAI_API_KEY`) there is one .env.example in frontend folder and one in backend folder (both should be copied to .env).
- Build & start all services (frontend, backend, Postgres): `docker-compose up`
- Access: frontend at http://localhost:5173, backend API at http://localhost:3000.
- Stop: `docker-compose down` (add `-v` to drop volumes if you want a clean DB).
- Logs: `docker-compose logs -f backend` (or `frontend`, `db`).

## Alternative: Run Without Docker

- Prereqs: Node 18+, npm (or pnpm), PostgreSQL running locally, OpenAI API key.
- Env: copy `.env.example` to `.env` in frontend and backend folders and fill as needed.
- Backend: `cd backend && npm install && npx prisma migrate dev && npx prisma generate && npm start:dev` (default http://localhost:3000).
- Frontend: `cd frontend && npm install && npm run dev` (default http://localhost:5173, ensure it points to backend URL).

## Architecture Overview

- **Frontend:** React + Vite + TypeScript; handles UI rendering and communicates with the backend via REST APIs.
- **Backend:** NestJS + TypeScript; follows a modular architecture with separated domains (LLM, conversations, messages, metrics).
- **LLM Orchestration:** A dedicated backend layer securely proxies requests to external AI providers (e.g., OpenAI) and handles errors such as rate limits and timeouts.
- **Real-Time Updates:** Server-Sent Events (SSE) are used to stream live dashboard metrics to the frontend.
- **Database:** PostgreSQL with Prisma ORM for schema management and migrations.
- **API Communication:** Centralized API service on the frontend for consistent request handling.
- **API Docs:** Swagger UI exposed by the backend (reachable at `/api/docs`) for interactive schemas and trying requests.
- **Containerization:** Docker and Docker Compose are used to run the frontend, backend, and database in a unified local environment.

## API Endpoints

- `GET /api/agent-configurations` — list all agent configs.
- `POST /api/agent-configurations` — create an agent config (`name`, `model`, `systemPrompt`).
- `GET /api/agent-configurations/:id` — fetch a single agent config.
- `PATCH /api/agent-configurations/:id` — update an agent config fields.
- `DELETE /api/agent-configurations/:id` — remove an agent config.
- `GET /api/agents/:agentId/conversations` — list conversations for an agent (supports pagination).
- `POST /api/conversations` — create a conversation for an agent (`agentId`, `title`).
- `GET /api/conversations/:conversationId/messages` — list messages in a conversation (supports pagination).
- `POST /api/conversations/:conversationId/messages` — send a user message; returns user + assistant replies.
- `GET /api/llm/models` — list available LLM model identifiers.
- `GET /api/dashboard/metrics` (SSE) — stream dashboard metrics via server-sent events.
- `GET /api/docs` — Swagger UI for the full REST API documentation.
