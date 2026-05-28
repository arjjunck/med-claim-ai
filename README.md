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

Add screenshots of:

* Login Page
* Dashboard
* Document Upload
* Claim Analysis
* Chat Interface

---

## Disclaimer

This project is intended for educational, research, and portfolio purposes. It does not replace professional medical, legal, insurance, or claims review processes.

---

## Author

Developed as part of an AI and Business Analytics portfolio project.

MediClaim AI © 2026
