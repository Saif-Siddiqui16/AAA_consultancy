# Comprehensive API Contract (Phase 1-11 Integrations)

## 1. Authentication & Users
### `POST /api/v1/auth/login`
*   **Purpose:** Authenticate user and issue JWT tokens.
*   **Request Body:** `email`, `password`.

### `POST /api/v1/users` (Add Agent)
*   **Purpose:** Create staff members.
*   **Request Body:** `fullName`, `email`, `password`, `hotlineNumber`, `role`, `spokenLanguages`, `nationalities`, `commissionRate`, `immigrationBio`, `customPermissions`.

---

## 2. Phase 1 & 2: Lead Generation & Assessment Booking
### `POST /api/v1/leads` (Lead Intake via Webhook/Ads)
*   **Request Body:** `fullName`, `phone`, `email`, `source`, `campaignId`.
*   **Trigger:** Logs lead and sends Automated WhatsApp First Response linking to `https://wa.me/971509554142`.

### `POST /api/v1/consultations/book` (Booking Engine)
*   **Validation:** 
    1.  Blocks submission if Client (by Email/Phone/Name) is tagged as `NO_SHOW` (Not Interested).
    2.  Ensures Client cannot choose multiple services from 1-5 simultaneously.
*   **Request Body:** 
    *   `firstName`, `lastName`, `email`, `nationality`, `residenceCountry`, `preferredLanguage`.
    *   `serviceType` (1. DNV, 2. NLV, 3. Business, 4. Study, 5. Tourist, 6. Sworn Translation).
    *   `applicantsCount` (Enum: `Main Only` up to `Main + 9`).
    *   `date`, `timeSlot`.

### `POST /api/v1/consultations/translation-quote` (Phase 3 Exception)
*   **Request Body:** `sourceLanguage`, `targetLanguage` ("Spanish"), `wordCount` (calculated by backend after doc upload).
*   **Response:** `pricePerWord`, `totalPrice`, `estimatedDeliveryDate`.

---

## 3. Phase 5 & 6: Consultation Actions
### `PATCH /api/v1/consultations/:id/outcome` (Agent UI)
*   **Agent Masking:** Before this endpoint is called with `COMPLETED`, backend APIs do NOT return `phone` and `email` to the Consultant.
*   **Request Body (If NO SHOW):**
    *   `status`: `NO_SHOW`
    *   *Trigger:* Client tagged as "Not Interested". Cancellation Email sent. Auto-reminders scheduled for 30m and 24h to invite them to rebook.
*   **Request Body (If COMPLETED):**
    *   `status`: `COMPLETED`
    *   `eligibility`: `Eligible` | `Not Eligible`
    *   `recommendedService`: String
    *   `recommendedPackageId`: String
    *   `internalNotes`: String

---

## 4. Phase 7, 8, 9: Payments & Dashboard
### `GET /api/v1/packages/quote` (Phase 7 Pricing Model)
*   **Query Params:** `clientId`, `serviceType`, `applicantsCount`.
*   **Response Options:** Option A (Full Processing), Option B (Premium), Option C (Administrative Relocation). Option A for Schengen Visa.

### `POST /api/v1/payments/generate-link` (Phase 8)
*   **Request Body:** `clientId`, `packageId`, `agreedToTerms` (Boolean).
*   **Supported Gateways:** Apple Pay, Google Pay, Link Wallet, Visa, Mastercard, Tabby, Tamara.

---

## 5. Phase 11: Sub-Tabs inside Client Details (Admin/Operations UI)

### Tab 1: Profile Summary & Timeline
*   **`GET /api/v1/clients/:id/timeline`**: Fetches original lead history, communications, and audit logs.
*   **`POST /api/v1/clients/:id/comments`**:
    *   **Body:** `text`, `authorId`.

### Tab 2: Document Management
*   **`POST /api/v1/documents/upload`** (Client Portal & Internal UI)
    *   **Logic:** Files are automatically categorized by name upon upload. Files cannot be deleted once uploaded.
*   **`PATCH /api/v1/documents/:id/verify`**
    *   **Body:** `status` (`VERIFIED`, `REJECTED`), `feedbackComment` (mandatory if rejected).

### Tab 3: Payments & Invoices
*   **`GET /api/v1/clients/:id/invoices`**: Fetches paid and pending retainers mapped to the client.

### Tab 4: Meetings & Consultations
*   **`GET /api/v1/clients/:id/meetings`**: Fetches session logs, meeting URLs, and cloud recording links.

---

## 6. AI Summary & Post-Approval Workflows
### `GET /api/v1/ai/summary/:clientId`
*   **Response Schema:**
    *   `clientObjective`: String
    *   `missingRequirements`: Array of Strings
    *   `eligibilityAssessment`: String (Potential risks/concerns)
    *   `communicationSummary`: String
    *   `lastActivity`: Object (Client Action, Staff Action, Date)
    *   `nextRecommendedAction`: Enum
    *   `priorityLevel`: `High` | `Medium` | `Low`
    *   `leadTemperature`: `Hot` | `Warm` | `Cold`
    *   `overallCaseProgress`: Number (%)
    *   `recommendedPackage`: String
    *   `estimatedSuccessProbability`: String (Restricted to internal staff)

### `POST /api/v1/cases/:clientId/resubmit`
*   **Logic:** Keeps exact same `clientId`, creates a new `ApplicationCycle` record logging original refusal date and reason.

### `POST /api/v1/cases/:clientId/appeal`
*   **Request Body:** `lawyerId`, `appealDeadline`.
