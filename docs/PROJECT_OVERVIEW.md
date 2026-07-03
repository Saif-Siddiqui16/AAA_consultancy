# PROJECT OVERVIEW: AAA Business Consultancy CRM

## 1. Project Summary
AAA Business Consultancy CRM is an enterprise-grade web application built to streamline operations for a Spain Visa, Residency & Relocation Consultancy. The system orchestrates lead management, consultant assignments, eligibility assessments, document processing, payments, and post-approval services. 

## 2. Business Goal
To automate and digitalize the complete lifecycle of visa and residency applicants, ensuring accurate tracking of application statuses, reducing manual workload through automations, and providing strict access control across different operational departments.

## 3. System Scope
The CRM provides backend support for 6 specialized frontend portals:
1. **Super Admin**: Complete system oversight and configuration.
2. **Admin**: Day-to-day management, supervision, and lead assignment.
3. **Agent (Consultant)**: Direct client consultation, eligibility assessment, and package recommendation.
4. **Finance**: Revenue, invoicing, and refund management.
5. **Operations (Case Specialists/Lawyers)**: Case processing, document review, and government submission.
6. **Marketing**: Lead generation tracking, promotions, and discount campaigns.

## 4. Technology Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **ORM:** Prisma
* **Database:** MySQL
* **Authentication:** JWT (JSON Web Tokens)
* **Security:** Bcrypt (Password Hashing), Helmet, CORS, Rate Limiting
* **Architecture:** MVC (Model-View-Controller) with Repository Pattern
* **API Style:** REST API

## 5. Folder Structure
```text
/src
├── config/           # Environment and DB configurations
├── controllers/      # Route handlers mapping requests to services
├── middlewares/      # Authentication, Authorization (RBAC), Error Handling
├── models/           # Prisma schema and custom database types
├── repositories/     # Data access layer (abstracting Prisma calls)
├── routes/           # Express route definitions
├── services/         # Business logic layer
├── utils/            # Helper functions, loggers, formatters
├── validators/       # Input validation schemas (Joi/Yup)
└── app.js            # Express application setup
```

## 6. Architecture Overview
The backend follows a layered MVC architecture enhanced by the Repository Pattern to decouple the database layer from the business logic. 
* **Routing Layer:** Intercepts requests and passes them to Controllers.
* **Controller Layer:** Handles HTTP concerns (req/res) and delegates to Services.
* **Service Layer:** Contains core business logic and rules.
* **Repository Layer:** Executes Prisma queries on MySQL.

## 7. Role Overview & RBAC
* **SUPER_ADMIN**: Full access to all endpoints. Can customize agent permissions.
* **ADMIN**: Access to user management (except Super Admins), lead assignments, and reporting.
* **AGENT**: Restricted to assigned leads, calendar slots, and consultation forms. No access to unassigned client contact info.
* **FINANCE**: Access to payment gateways, invoices, refund reviews.
* **OPERATIONS**: Access to document verification, application statuses, and embassy updates.
* **MARKETING**: Access to lead sources, campaign metrics, but restricted from viewing internal client consultation logs.

## 8. Modules
* Authentication & Authorization
* User & Role Management
* Lead Management
* Calendar & Consultation
* Client & Document Management
* Payments & Invoicing
* Case Management (Operations)
* Notifications & Automations

## 9. Lead & Client Lifecycle
1. **Lead Generation**: Captured via Marketing channels; WhatsApp auto-response sent.
2. **Assessment Booking**: Client books via link. Assigned to Agent.
3. **Consultation**: Agent conducts meeting. Outcome marked (COMPLETED or NO SHOW).
4. **Package Selection**: Agent recommends service; client views package comparison.
5. **Payment**: Invoice generated. Client pays via secure link.
6. **Document Upload**: Paid client accesses dashboard to upload required docs.
7. **Processing**: Operations verifies docs and submits to government.
8. **Outcome**: Visa Approved, Refused (triggering Appeal/Resubmission), or Refunded.

## 10. Future Scalability
* Designed with modular services to allow eventual microservices extraction.
* Prisma connection pooling for high-concurrency database access.
* Stateless JWT authentication to easily scale Node.js instances behind a load balancer.

## 11. Coding Standards & Naming Conventions
* **Controllers & Services**: PascalCase (e.g., `LeadController.js`)
* **Routes**: kebab-case (e.g., `/api/v1/leads`)
* **Variables**: camelCase
* **Constants**: UPPER_SNAKE_CASE
* **Database Tables**: Pluralized, snake_case (e.g., `users`, `consultation_logs`)

## 12. Environment Variables Required
* `PORT`, `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`
* `PAYMENT_GATEWAY_KEY`, `WHATSAPP_API_KEY`, `AWS_S3_BUCKET` (for docs)
