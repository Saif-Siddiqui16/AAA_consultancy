# System Memory & Context Truth

**CRITICAL:** Read this file whenever analyzing the AAA Business Consultancy project to preserve AI context tokens.

## 1. Project Identity
*   **Name:** AAA Business Consultancy CRM
*   **Domain:** Spain Visa, Residency & Relocation Services.
*   **Architecture:** Modular Monolith (Node.js/Express) connected to 6 Frontend React Portals.
*   **Tech Stack:** Node.js, Express.js, Prisma ORM, MySQL, JWT, Bcrypt.

## 2. Strict Restrictions (Things NEVER to change)
*   **DO NOT CHANGE FRONTEND.** The UI is FINAL. Backend must map directly to existing frontend fields.
*   **No Duplicate Leads:** Append new application cycles (`ApplicationCycle`) to the existing Client ID.
*   **Document Immutability:** Clients can never delete uploaded documents; Operations can only mark them as Rejected.
*   **NO-SHOW Blacklisting:** If a client does not show up within 10 minutes, they are tagged as `Not Interested`. The automated system locks them out from re-booking based on `Email`, `Name`, and `Phone`. (They are only invited to re-book manually via automated SMS/Email reminders).
*   **Agent Data Masking:** API MUST NOT return client `phone` and `email` to the Agent UI until the meeting is marked `COMPLETED`.

## 3. Master Status Enums (Phase 11 Compliance)
Backend must strictly enforce these exact 25 statuses:
1.  **New Lead** (New inquiry received)
2.  **Attempting Contact** (Team is trying to contact)
3.  **Assessment Booked** (Consultation booked)
4.  **Under Assessment** (Consultation in progress)
5.  **Eligible** (Client is eligible to proceed)
6.  **Not Eligible** (Client is currently not eligible)
7.  **Waiting for Payment** (Package selected, waiting)
8.  **Payment Received** (Payment successfully completed)
9.  **Documents Pending** (Waiting for client uploads)
10. **Documents Under Review** (Operations reviewing)
11. **Additional Documents Required** (Missing requested)
12. **Ready to Submit** (File complete and ready)
13. **Application Submitted**
14. **Appointment Booked** (Embassy/BLS appointment)
15. **Under Government Review**
16. **Visa Approved**
17. **Visa Refused**
18. **Resubmission in Progress** (Added after refusal)
19. **Ready for Resubmission** (Added after refusal)
20. **Resubmitted** (Added after refusal)
21. **Appeal in Progress** (Added after refusal)
22. **Appeal Approved** (Added after refusal)
23. **Appeal Refused** (Added after refusal)
24. **Refund Under Review** (Added after refusal)
25. **Refund Approved**
26. **Refund Completed**
27. **Administrative Support** (Post-approval relocation)
28. **Case Closed**
29. **No Show**
30. **Cold Lead**
31. **Lost Lead**
32. **Duplicate Lead**
33. **Spam**

*(Note: The list above merges the core 25 with the explicit post-refusal updates from the client logic).*

## 4. Subsystem Knowledge
*   **Sworn Translation Exception:** Service 6 bypasses consultations and directly calculates `Words * translationPricePerWord` -> Upload Docs -> Payment Gateway.
*   **Social Inbox:** Handles multi-channel chats. Tracks the exact staff member name who answered the client. Marketing role has read-only access.
*   **Refund & Commissions Hub:** Agent commissions calculated dynamically (`commissionRate` % of net revenue). Refunds automatically calculate up to 50% max based on policy.
*   **Global Customizations:** `taxRate`, `translationPricePerWord`, and `noShowPenaltyMins` are centrally managed.

## 5. AI Assistant Payload Schema
The `AIService` guarantees this exact output:
`Client Objective`, `Missing Requirements`, `Eligibility Assessment`, `Communication Summary`, `Last Activity`, `Next Recommended Action`, `Priority Level`, `Lead Temperature`, `Overall Case Progress`, `Recommended Package`, `Estimated Success Probability` (Internal staff only).
