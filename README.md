# MediClaim AI

An AI-powered medical document assistant and claim risk analysis platform. Upload insurance policies, ask questions about them and get answers grounded in the document with page-level citations, and analyse claim files for risk, all through a Retrieval-Augmented Generation (RAG) workflow.

**Live demo:** https://mediclaim-web.thankfulflower-e7d8ef35.switzerlandnorth.azurecontainerapps.io

> The demo is public. Please use sample documents only (for example `Testing/MediClaim_AI_Test_Policy_Document.pdf` and `Testing/mediclaim_backend_test_claims.csv`) and never upload real medical or personal data.

---

## Overview

MediClaim AI combines document management, claims analytics, and AI-assisted document retrieval into a single platform.

The application allows users to:

* Upload medical and insurance policy documents (PDF)
* Extract, chunk and embed document content automatically
* Ask questions and get answers grounded in the document, with page citations
* Upload claim datasets (CSV) and get automated risk assessments
* View dashboards summarising document and claim activity

---

## Technology Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Lucide Icons

### Backend

* ASP.NET Core Web API (.NET 10)
* Entity Framework Core
* JWT Authentication
* REST API Architecture

### AI

* NVIDIA NIM API
* `nvidia/nemotron-3.5-embed-1b` for embeddings
* `nvidia/nemotron-3.5-lightning-30b-a3b` for answer generation

### Database

* PostgreSQL

### Document Processing

* PdfPig
* Custom chunking engine with page tracking

### Deployment

* Docker and Docker Compose
* nginx (serves the frontend and forwards `/api` to the backend)
* Azure Container Apps
* Azure Database for PostgreSQL

---

## Features

### Authentication

* User Registration
* User Login
* JWT Authentication
* Protected API Endpoints

### Document Management

* PDF Upload
* Text Extraction
* Automatic Chunking
* Document Library
* Document Preview
* Chunk Inspection

### Claim Analysis

* CSV Upload
* Risk Classification
* Rule-Based Risk Engine
* High / Medium / Low Risk Detection
* Claim Dashboard Metrics

### AI Assistant

* Document-Based Question Answering
* Embedding-Based Retrieval
* Page-Level Source Citations
* Chat History Storage
* Keyword Search Fallback

### Dashboard

* Document Statistics
* Claim Statistics
* Risk Monitoring
* Activity Overview

---

## How It Works

**When a PDF is uploaded**

User uploads PDF
↓
Text extracted page by page
↓
Split into overlapping chunks, each tagged with its page(s)
↓
Each chunk embedded with NVIDIA Nemotron
↓
Chunks and embeddings stored in PostgreSQL

**When a question is asked**

Question embedded with NVIDIA Nemotron
↓
Most similar chunks retrieved (cosine similarity)
↓
Answer generated from those chunks only
↓
Answer shown with its source pages

---

## Database Components

### Users

Stores authenticated users.

### Documents

Stores uploaded PDF metadata.

### Document Chunks

Stores chunked document content, page numbers and embeddings.

### Claims

Stores uploaded claim records and risk classifications.

### Chat History

Stores document-specific conversations.

---

## Live Deployment

Hosted on Azure (Switzerland North) using Azure for Students:

* **Frontend:** Azure Container Apps running `arjjunck/mediclaim-web` (public HTTPS). nginx serves the React app and forwards `/api` to the API.
* **API:** Azure Container Apps running `arjjunck/mediclaim-api`, internal only, and scales to zero when idle.
* **Database:** Azure Database for PostgreSQL Flexible Server (B1ms).

The first request after a quiet period can take a few seconds while the API starts up.

---

## Running with Docker

Requires Docker Desktop (or another Docker engine with Compose) and an NVIDIA API key from [build.nvidia.com](https://build.nvidia.com).

```bash
cp .env.example .env   # then fill in NVIDIA_API_KEY, JWT_KEY and POSTGRES_PASSWORD
docker compose up --build
```

* App: http://localhost:8080
* API (direct): http://localhost:5050

This starts three containers: PostgreSQL, the ASP.NET Core API, and the React frontend served by nginx. Database migrations run automatically when the API starts, and data is kept in the `db-data` volume.

To use the published images instead of building them: `docker compose pull && docker compose up`.

---

## Running Locally (without Docker)

Requires the .NET 10 SDK, Node.js 24, a local PostgreSQL database and an NVIDIA API key.

**Backend**

```bash
cd backend
dotnet user-secrets set "OpenAI:ApiKey" "YOUR_NVIDIA_KEY" --project MediClaim.Api
dotnet ef database update --project MediClaim.Infrastructure --startup-project MediClaim.Api
dotnet run --project MediClaim.Api
```

The API runs on http://localhost:5283. Set your database connection in `backend/MediClaim.Api/appsettings.Development.json`.

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

The app runs on http://localhost:5173 and calls the API at http://localhost:5283/api.

**Tests**

```bash
cd backend
dotnet test
```

---

## Project Status

### Version

v1.1.0

### Implemented

* Authentication System
* PostgreSQL Integration
* Document Upload Pipeline
* PDF Processing
* Chunk Storage
* Document Library
* Claim Analysis Engine
* Dashboard Analytics
* Chat System
* RAG Workflow
* Embedding-based retrieval (NVIDIA Nemotron)
* Page-level source citations
* Docker support (images on Docker Hub)
* Azure deployment (Container Apps + PostgreSQL)

### Planned Improvements

* Move similarity search into the database with pgvector (it is currently calculated in the API)
* Evaluation framework to measure answer accuracy
* CI pipeline with GitHub Actions (tests and Docker image builds)

---

## Screenshots

* Login Page
  <img width="1912" height="944" alt="image" src="https://github.com/user-attachments/assets/6b380068-e96b-43d7-821d-168485c2283e" />

* Dashboard
  <img width="1920" height="946" alt="image" src="https://github.com/user-attachments/assets/512c0c54-3b56-42b0-94e5-67daaff608d1" />

* Document Upload
  <img width="1917" height="948" alt="image" src="https://github.com/user-attachments/assets/41bffc68-7861-46a4-8392-616ba4e8438e" />

* Claim Analysis
  <img width="1917" height="952" alt="image" src="https://github.com/user-attachments/assets/cc1ecd8b-1059-4b99-b942-25d8e9a7f7cc" />

* Chat Interface
  <img width="1918" height="954" alt="image" src="https://github.com/user-attachments/assets/58179908-9225-432b-ab21-f3c1e9da4294" />

---

## Disclaimer

This project is intended for educational, research, and portfolio purposes. It does not replace professional medical, legal, insurance, or claims review processes. AI-generated answers can be wrong, so always check them against the source document.

Do not upload real medical, insurance or personal data to the live demo.

---

## Author

**Arjun Krishna Krishnakumar**

* GitHub: [@arjjunck](https://github.com/arjjunck)

Developed as part of an AI and Business Analytics portfolio project.

MediClaim AI © 2026
