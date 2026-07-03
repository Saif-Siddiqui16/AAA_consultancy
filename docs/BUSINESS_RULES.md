# Business Rules Source of Truth

This document translates the complete 11-Phase client workflow into strict backend rules to be enforced by the service layer.

---

## 1. Phase 1: Lead Generation & Social Inbox

### BR-001: Automated Welcome Response
*   **Trigger:** New Lead created in CRM (via Webhook, Ads, or Social Channels).
*   **Action:** Trigger WhatsApp integration to send the Automated Welcome Message containing the booking link: `https://wa.me/971509554142`.
*   **Tracking:** The system must record the ID/Name of the staff member who answers the client in the Social Inbox.

---

## 2. Phase 2 & 3: Assessment Booking

### BR-002: Booking Duplication & No-Show Blacklist
*   **Trigger:** Client attempts to book an assessment.
*   **Conditions:** System checks `Email`, `Name`, AND `Phone Number`.
*   **Validation:** 
    1.  If the user is tagged as `NO_SHOW` (Not Interested), the booking is blocked automatically.
    2.  Clients cannot select multiple services between 1 and 5 simultaneously.

### BR-003: Sworn Translation Workflow (Service 6 Exception)
*   **Flow:** 
    1.  Client selects languages (e.g., English -> Spanish).
    2.  System allows document upload.
    3.  Backend calculates Word Count and multiplies by `translationPricePerWord`.
    4.  Client sees estimated delivery and clicks "Proceed to Payment".
    5.  Post-payment, status switches to `Translation on Process`, then `Completed`, then `Delivered`.

### BR-004: Meeting Reminders Automation
*   **Trigger:** Successful Consultation Booking.
*   **Action:** Email/WhatsApp confirmations sent with Company Profile PDF and Packages Link.
*   **Reminders:** Scheduled exactly at `T-24h`, `T-1h`, and `T-10m`.

---

## 3. Phase 4, 5 & 6: Consultation & Outcomes

### BR-005: Consultant Assignment & Privacy
*   **Trigger:** Booking confirmed (Non-translation).
*   **Conditions:** Matches Nationality, Language, Service, and Date/Time.
*   **Privacy Rule:** The Consultant's API response for the `Lead` object must strip `phone` and `email` properties until the consultation status changes to `COMPLETED`.

### BR-006: Auto-Recording Enforcement
*   **Trigger:** Consultation starts.
*   **Rule:** The cloud recording link provided by the Meeting API must automatically bind to the `Consultation` database record.

### BR-007: No-Show Policy & Cancellation Text
*   **Trigger:** Consultant clicks `NO SHOW` (valid only if 10 mins have passed).
*   **Action 1 (Blacklist):** Client status set to `Not Interested`. They cannot re-book via the automated link.
*   **Action 2 (Communication):** Send exact cancellation text ("Hello, Your Free Eligibility Assessment has been automatically cancelled...").
*   **Action 3 (Reminders):** Schedule two manual re-booking invitations at `T+30m` and `T+24h`.

### BR-008: Completed Consultation Flow
*   **Trigger:** Consultant clicks `COMPLETED`.
*   **Action:** Enforce Consultant to fill: `Eligible/Not Eligible`. If Eligible: `Recommended Service`, `Recommended Package`, and `Internal Notes`.

---

## 4. Phase 7, 8 & 9: Finance & Commissions

### BR-009: Dynamic Pricing Model
*   **Options Provided to Client:** 
    *   If Service 1-4: Option A (Full Processing), Option B (Premium), Option C (Administrative Relocation).
    *   If Service 5: Option A (Schengen Visa).
*   **Calculation:**
    *   Base Price depending on Service.
    *   + Add-on (Premium = Full Processing + Administrative Support).
    *   - Discount (Main Applicant = €500 discount on Premium).
    *   - Dependent Discount (€250 per dependent).

### BR-010: Document Immutability & Auto-Categorization
*   **Trigger:** Client uploads file after payment success.
*   **Rule 1 (Immutability):** Documents CANNOT be deleted by the Client.
*   **Rule 2 (Categorization):** Documents are automatically categorized based on their uploaded filename/type mapping.

---

## 5. Phase 10: Payment Delinquency

### BR-011: 5-Day Discount Automation
*   **Trigger:** Client status is `WAITING_FOR_PAYMENT`.
*   **Cron Schedule:**
    *   Reminder 1: After 2 Hours.
    *   Reminder 2: After 24 Hours.
    *   Reminder 3: After 2 Days.
    *   Reminder 4: After 5 Days (Triggers the special CEO Discount Offer valid for 24 Hours).

---

## 6. Phase 11: Case History & Appeals

### BR-012: Resubmission & Appeal Cycle
*   **Trigger:** Visa status marked as `Visa Refused`.
*   **Rule (Resubmission):** Keep the same Client ID. Create a new `ApplicationCycle` record logging the original submission date, refusal date, and reason for refusal. Change status to `Resubmission in Progress`.
*   **Rule (Appeal):** If an appeal is chosen, log Lawyer Assigned, Appeal Deadline, and change status to `Appeal in Progress`.

### BR-013: Refund Dispatch
*   **Trigger:** Client is eligible under Refund Policy.
*   **Rule:** Status transitions: `Refund Eligible` -> `Refund Under Review` -> `Refund Approved` -> `Refund Completed`. Automatically calculate the maximum 50% refund limit based on net paid invoice.
