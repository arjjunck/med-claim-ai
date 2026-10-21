# MediClaim AI

An AI-powered medical document assistant and claim risk analysis platform designed to help users upload insurance policies, analyse claims, retrieve relevant information from documents, and interact with policy content through a Retrieval-Augmented Generation (RAG) workflow.

---

## Overview

MediClaim AI combines document management, claims analytics, and AI-assisted document retrieval into a single platform.

The application allows users to:

* Upload medical and insurance policy documents (PDF)
* Extract and process document content automatically
* Store searchable document chunks in PostgreSQL
* Upload claim datasets (CSV)
* Perform automated claim risk assessment
* Interact with uploaded documents through a document-grounded chat interface
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
* Semantic Kernel Integration
* REST API Architecture

### Database

* PostgreSQL

### Document Processing

* PdfPig
* Custom Chunking Engine

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
* Source Referencing
* Chat History Storage
* Retrieval-Augmented Generation (RAG)

### Dashboard

* Document Statistics
* Claim Statistics
* Risk Monitoring
* Activity Overview

---

## Current Architecture

User Uploads PDF
↓
Text Extraction
↓
Document Chunking
↓
PostgreSQL Storage
↓
Question Submitted
↓
Relevant Chunks Retrieved
↓
AI Answer Generated
↓
Sources Displayed

---

## Database Components

### Users

Stores authenticated users.

### Documents

Stores uploaded PDF metadata.

### Document Chunks

Stores chunked document content.

### Claims

Stores uploaded claim records and risk classifications.

### Chat History

Stores document-specific conversations.

---

## Running with Docker

Requires Docker Desktop (or another Docker engine with Compose).

```bash
cp .env.example .env   # then fill in NVIDIA_API_KEY, JWT_KEY and POSTGRES_PASSWORD
docker compose up --build
```

* Frontend: http://localhost:8080
* API: http://localhost:5050

This starts three containers: PostgreSQL (with pgvector), the ASP.NET Core API, and the React frontend served by nginx. Database migrations run automatically when the API starts, and data is kept in the `db-data` volume.

---

## Project Status

### Version

v1.0.0

### Completion Status

Approximately 90% Complete

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
* Basic RAG Workflow

### Planned Improvements

* Semantic Search
* Vector Database Integration
* Embeddings
* Better Citations
* Production Deployment
* Docker Support
* Azure Hosting
* Evaluation Framework

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

This project is intended for educational, research, and portfolio purposes. It does not replace professional medical, legal, insurance, or claims review processes.

---

## Author

Developed as part of an AI and Business Analytics portfolio project.

MediClaim AI © 2026
