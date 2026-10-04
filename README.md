# MediAssist AI

A full-stack medical appointment assistant. Patients can find doctors, book and cancel appointments, and ask a Gemini-powered AI assistant general health and appointment questions.

**Live demo:** https://mediassist-ai-chi.vercel.app
**API:** https://mediassist-ai-n7vg.onrender.com/api/doctors

> The backend runs on a free Render instance, so the first request after a period of inactivity can take up to a minute while it wakes up.

## Screenshots

| Dashboard | Find a doctor |
|---|---|
| ![Dashboard](docs/screenshots/01-dashboard.png) | ![Doctors](docs/screenshots/02-doctors.png) |

| Book a visit | My appointments |
|---|---|
| ![Booking](docs/screenshots/03-booking.png) | ![Appointments](docs/screenshots/04-appointments.png) |

| AI assistant |
|---|
| ![AI chat](docs/screenshots/05-ai-chat.png) |

## Features

- Patient registration and login with BCrypt-hashed passwords
- Doctor directory with search by name or specialty and specialty filters
- Appointment booking with date, time and an optional reason
- "My appointments" page with status tracking (booked / cancelled) and cancellation
- AI health assistant powered by Google Gemini, with Markdown-formatted answers
- Built-in disclaimer: the assistant gives general information only and does not diagnose or prescribe
- Responsive dark UI built from scratch in React and CSS

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React (Create React App), react-markdown, custom CSS |
| Backend | Java 17, Spring Boot 3.5, Spring Web, Spring Security, Spring Data JPA (Hibernate) |
| Database | PostgreSQL (Neon, serverless) |
| AI | Google Gemini API |
| Deployment | Vercel (frontend), Render with Docker (backend), Neon (database) |

## Architecture

```
React (Vercel)  ──HTTPS──▶  Spring Boot REST API (Render)  ──JPA──▶  PostgreSQL (Neon)
                                      │
                                      └──HTTPS──▶  Google Gemini API
```

## API overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create a patient account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/doctors` | List doctors |
| POST | `/api/appointments` | Book an appointment |
| GET | `/api/appointments/patient/{id}` | List a patient's appointments |
| PUT | `/api/appointments/{id}/cancel` | Cancel an appointment |
| POST | `/api/ai/chat` | Ask the AI assistant |

## Project structure

```
.
├── backend/            Spring Boot application (Dockerfile included)
├── frontend/           React application
└── docs/screenshots/   README images
```

## Run locally

### Prerequisites

- Java 17 and Maven
- Node.js 18+
- A PostgreSQL database (local or Neon)
- A Gemini API key from [Google AI Studio](https://aistudio.google.com)

### Backend

Set the environment variables, then start the server. PowerShell example:

```powershell
cd backend
$env:DB_URL="jdbc:postgresql://<host>/<database>?sslmode=require"
$env:DB_USER="<db user>"
$env:DB_PASSWORD="<db password>"
$env:JWT_SECRET="<random string, 32+ characters>"
$env:GEMINI_API_KEY="<your gemini key>"
mvn spring-boot:run
```

The API starts on `http://localhost:8080`. Tables are created automatically by Hibernate (`ddl-auto=update`) and sample doctors are seeded on first run.

### Frontend

```bash
cd frontend
npm install
npm start
```

Open `http://localhost:3000`. To point the frontend at a different backend, set `REACT_APP_API_URL` (for example `https://your-backend.onrender.com/api`).

## Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `DB_URL`, `DB_USER`, `DB_PASSWORD` | Backend | PostgreSQL connection |
| `JWT_SECRET` | Backend | Signing secret (32+ characters) |
| `GEMINI_API_KEY` | Backend | Gemini API access |
| `FRONTEND_URL` | Backend (optional) | Extra allowed CORS origin |
| `REACT_APP_API_URL` | Frontend | Backend base URL, ending in `/api` |

Secrets are read from environment variables and are never committed to the repository.

## Deployment

- **Database:** Neon PostgreSQL
- **Backend:** Render web service using the `backend/Dockerfile` (root directory `backend`)
- **Frontend:** Vercel project with root directory `frontend`

## Roadmap

- Enforce JWT authorization on appointment endpoints
- Doctor availability and double-booking checks
- Email or SMS appointment reminders
- Admin and doctor roles

## Disclaimer

MediAssist AI is a portfolio project. The AI assistant provides general information only and is not a substitute for professional medical advice, diagnosis or treatment.

## Author

Yeshoda Gantyada
