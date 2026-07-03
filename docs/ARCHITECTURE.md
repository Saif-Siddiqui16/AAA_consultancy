# Master Backend Architecture

## 1. Architectural Pattern
The system is built on a **Modular Monolith** architecture utilizing **MVC (Model-View-Controller)** enhanced by the **Repository Pattern**. 

### Layered Architecture
*   **API Layer (Routes & Controllers):** Handles HTTP requests, extracts parameters, and formats responses.
*   **Validation Layer (Middleware):** Uses Yup/Joi to validate incoming payloads.
*   **Business Layer (Services):** Encapsulates core business rules (e.g., Commission logic, Translation pricing).
*   **Database Layer (Repositories):** Abstracts Prisma ORM calls.

## 2. Complete Folder Structure
```text
/src
├── controllers/     # LeadController, SocialInboxController, AnalyticsController
├── middlewares/     # authMiddleware, rbacMiddleware, errorHandler
├── routes/          # authRoutes, leadRoutes, paymentRoutes, socialRoutes, integrationRoutes
├── services/        # LeadService, PaymentService, CommissionService, SocialService
├── utils/           # Helper functions, AI wrappers, Email integrations
├── config/          # Env variables, CORS, global constants
├── models/          # prisma/schema.prisma
├── repositories/    # UserRepository, LeadRepository, CommissionRepository
├── jobs/            # Day 5 discount emails, Reminders (2h, 24h, 2d, 5d)
└── app.js           # Express application bootstrap
```

## 3. Subsystem Architectures

### A. Meeting & Notification Engine
*   **Reminders:** Scheduled via `BullMQ`. Delays are calculated dynamically relative to the consultation `date` and `timeSlot`. Triggers at 24h, 1h, and 10m before the meeting.
*   **Auto-Recording Mapper:** Webhooks from the Meeting API (Zoom/Meet) post the cloud recording link back to the system, which maps it directly to the `Consultation` ID.

### B. Cloud Document Categorization Architecture
*   **Upload Pipeline:** `multer` intercepts multipart/form-data.
*   **Auto-Categorization Module:** A regex or lookup table matches the uploaded `fileName` (e.g., "Passport", "Bank_Statement") to standard system categories before saving to AWS S3.
*   **Immutability:** The database strictly denies `DELETE` queries on the `documents` table for users with the `CLIENT` role.

### C. Case Cycle Architecture (Resubmissions & Appeals)
*   **Component:** `ApplicationCycle` model in Prisma.
*   **Flow:** To preserve Case History, the `Lead/Client` ID is never duplicated. Instead, `Client` 1:N `ApplicationCycles`. If a visa is refused, a new cycle is instantiated. 
*   **Audit Fields:** Logs original submission date, refusal date, resubmission date, refusal reason, lawyer assigned, and appeal deadlines.

### D. AI Assistant Architecture
*   **Flow:** When a staff member clicks "AI Summary", the `AIService` concatenates: `Client Details` + `Consultation Notes` + `Document OCR Text` + `Social/Email Transcripts`.
*   **Prompt Structure:** The payload is sent to OpenAI with strict JSON output formatting instructed to map directly to: `Client Objective`, `Missing Requirements`, `Eligibility Assessment`, `Priority Level` (High/Med/Low), `Lead Temperature` (Hot/Warm/Cold), and `Estimated Success Probability`.

## 4. Security & Privacy
*   **Agent Data Masking:** Responses to the `Agent` UI heavily redact `phone` and `email` properties in the JSON response using interceptor middlewares until the consultation is officially logged as `COMPLETED`.
