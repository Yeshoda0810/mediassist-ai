# MediCare AI — Medical Appointment Assistant

A portfolio-ready AI + Java full-stack healthcare appointment platform.

## Stack
- React 18 + Create React App
- Java 17 + Spring Boot
- Spring Security + JWT
- JPA/Hibernate
- H2 for the first run; MySQL-ready configuration
- Gemini/OpenAI-style AI service integration

## Professional UI
The React frontend includes:
- Healthcare SaaS landing/dashboard
- Responsive navigation and patient profile
- Specialist directory with search and specialty filters
- Doctor cards with availability and booking modal
- Patient appointment dashboard
- AI assistant chat interface with suggested prompts
- Login and registration experience
- Responsive mobile layout
- Empty, loading, success and error states

## Run the project

### 1. Backend
Open a terminal in `backend`:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Backend: `http://localhost:8080`

### 2. Frontend
Open another terminal in `frontend`:

```powershell
cd frontend
npm install
npm start
```

Frontend: `http://localhost:3000`

## AI configuration
The backend can run with demo AI responses. For live AI responses, configure the API key using the environment variable described in the backend configuration.

Do not commit API keys to GitHub or put them in React source code.

## Healthcare safety
The AI assistant is designed for general information and appointment navigation. It should not be presented as a diagnostic or prescription system. Production healthcare deployments require appropriate privacy, security, clinical validation, compliance, audit logging and emergency escalation controls.

## Project structure

```text
AI-Medical-Appointment-Assistant/
├── frontend/
│   ├── public/
│   └── src/
│       ├── App.js
│       ├── index.js
│       └── style.css
├── backend/
│   ├── src/main/java/com/yeshoda/medical/
│   └── pom.xml
└── README.md
```
