# Comprehensive API Contract (Phase 1-11 Integrations)

## 1. Authentication & Users
### `POST /api/v1/auth/login`
*   **Purpose:** Authenticate user and issue JWT tokens.
*   **Request Body:** `email`, `password`.

### `GET /api/v1/auth/me`
*   **Purpose:** Fetch logged-in user profile.

### `POST /api/v1/users` (Add Agent)
*   **Purpose:** Create staff members.
*   **Request Body:** `fullName`, `email`, `password`, `hotlineNumber`, `role`, `spokenLanguages`, `nationalities`, `commissionRate`, `immigrationBio`, `customPermissions`.

### `GET /api/v1/users/agents`
*   **Purpose:** Fetch list of all consultants/agents for the Admin dashboards.

---

## 2. Phase 1 & 2: Lead Generation & Assessment Booking
### `POST /api/v1/leads` (Lead Intake via Webhook/Ads)
*   **Request Body:** `fullName`, `phone`, `email`, `source`, `campaignId`.
*   **Trigger:** Logs lead and sends Automated WhatsApp First Response linking to `https://wa.me/971509554142`.

### `GET /api/v1/leads`
*   **Purpose:** List all leads for the Marketing and Admin dashboards.

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

### `POST /api/v1/payments/webhook` (Phase 9 Webhook)
*   **Purpose:** Listens to payment gateways. On success, unlocks the Customer Dashboard and sends the official receipt.

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

### `PATCH /api/v1/cases/:id/status`
*   **Purpose:** For staff to manually update the 33 lead/client statuses outside of automated events.

---

## 7. Administrative & Foundational APIs (Frontend Integration)

### 7.1 Settings & Customizations
*   **`GET/PUT /api/v1/settings/general`**: Company info, vat rate, auto-assign rules.
*   **`GET/PUT /api/v1/settings/customization`**: Role permissions, menu toggles (e.g., Marketing visibility).
*   **`GET/PUT /api/v1/settings/lead-stages`**: Custom statuses and their emojis/colors.

### 7.2 Product Catalog
*   **`GET/PUT /api/v1/services`**: Manage base services offered.
*   **`GET/PUT /api/v1/packages`**: Manage packages mapping to services.
*   **`GET/PUT /api/v1/settings/templates/email`**: Manage automated email templates.
*   **`GET/PUT /api/v1/settings/templates/whatsapp`**: Manage WhatsApp templates.

### 7.3 Social Inbox Chat Engine
*   **`GET /api/v1/conversations`**: Fetch WhatsApp/Telegram/Messenger chats.
*   **`POST /api/v1/conversations/:id/messages`**: Send social messages out from the CRM.
*   **`PATCH /api/v1/conversations/:id/read`**: Mark chat thread as read.

### 7.4 Finance, Commissions & Refunds
*   **`GET/PUT /api/v1/commissions/rates`**: Agent custom commission rates (e.g., 10% or fixed).
*   **`GET /api/v1/commissions/reports`**: Calculated reports on who earned what based on cleared invoices.
*   **`GET /api/v1/refunds`**: List of all refund requests.
*   **`POST /api/v1/payments/:invoiceId/refund`**: Triggers refund workflow, maxing out at 50% calculated amount.

### 7.5 System Notifications
*   **`GET /api/v1/notifications`**: Fetch alert bell notifications.
*   **`PATCH /api/v1/notifications/:id/read`**: Mark specific notification as read.
*   **`PATCH /api/v1/notifications/read-all`**: Mark all as read.

### 7.6 Cases Dashboards
*   **`GET /api/v1/cases/active`**: List all currently processing cases (excluding `Closed` and `Refused`).
*   **`GET /api/v1/cases/closed`**: List all closed/archived cases.
