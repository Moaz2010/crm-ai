# AI-Powered CRM Platform - System Analysis Document

**CNC111 - Web Programming Project**

---

## Team Members

| Name                              | Student ID  |
|-----------------------------------|-------------|
| Moaz Hassan Ismail El Garawany    | 320240032   |
| Ahmed Hossam Aldeen Alsayed       | 320240051   |
| Ahmed Mahmoud                     | 320240024   |

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Use Case Diagram](#use-case-diagram)
3. [Narrative Use Cases](#narrative-use-cases)
4. [Entity Relationship Diagram (ERD)](#entity-relationship-diagram-erd)
5. [Sequence Diagrams](#sequence-diagrams)
6. [Data Flow Diagrams (DFD)](#data-flow-diagrams-dfd)

---

## System Overview

The **AI-Powered CRM Platform** is a modern Customer Relationship Management system that leverages artificial intelligence to enhance lead management, appointment scheduling, and customer interactions. The system is built using Next.js 14+, Supabase, and integrates with OpenAI GPT-4o for intelligent automation.

### Key Modules:
- **LeadCatch Module** - AI-powered lead capture, parsing, and enrichment
- **Appointments Module** - Smart scheduling with calendar integrations
- **CRM Core** - Contact management, sales pipeline, and analytics
- **AI Module** - Shared AI services for all modules

---

## Use Case Diagram

```
+------------------+     +------------------+     +------------------+
|   User/Sales Rep |     |      Admin       |     |    AI System     |
+--------+---------+     +--------+---------+     +--------+---------+
         |                        |                        |
         |                        |                        |
+--------|------------------------|------------------------|------------------+
|        v                        v                        v                  |
|  +============================================================+            |
|  |                    AUTHENTICATION                          |            |
|  |  +------------+  +------------+  +---------------+         |            |
|  |  |   Login    |  |  Register  |  | Reset Password|         |            |
|  |  +------------+  +------------+  +---------------+         |            |
|  +============================================================+            |
|                                                                             |
|  +============================================================+            |
|  |                   LEADCATCH MODULE                         |            |
|  |  +---------------+  +------------------+  +-------------+  |            |
|  |  | Capture Lead  |  | Parse LinkedIn   |  | Import CSV  |  |            |
|  |  +---------------+  +------------------+  +-------------+  |            |
|  |  +---------------+  +------------------+  +-------------+  |            |
|  |  | Enrich Lead   |  |   Score Lead     |  | Export Leads|  |            |
|  |  +---------------+  +------------------+  +-------------+  |            |
|  |  +-------------------+  +------------------+                |            |
|  |  | Detect Duplicates |  | Categorize Lead  |                |            |
|  |  +-------------------+  +------------------+                |            |
|  +============================================================+            |
|                                                                             |
|  +============================================================+            |
|  |                  APPOINTMENTS MODULE                       |            |
|  |  +--------------------+  +---------------------+           |            |
|  |  | Schedule Appointment|  | Manage Availability |           |            |
|  |  +--------------------+  +---------------------+           |            |
|  |  +---------------+  +---------------+  +----------------+  |            |
|  |  | Sync Calendar |  | Book Meeting  |  |   Reschedule   |  |            |
|  |  +---------------+  +---------------+  +----------------+  |            |
|  |  +---------------+  +------------------+                   |            |
|  |  |    Cancel     |  |  Send Reminders  |                   |            |
|  |  +---------------+  +------------------+                   |            |
|  +============================================================+            |
|                                                                             |
|  +============================================================+            |
|  |                      CRM CORE                              |            |
|  |  +-----------------+  +------------------+  +------------+ |            |
|  |  | Manage Contacts |  | Manage Companies |  | Manage Deals| |            |
|  |  +-----------------+  +------------------+  +------------+ |            |
|  |  +--------------+  +---------------+  +-----------------+ |            |
|  |  | Create Tasks |  | View Pipeline |  | View Analytics  | |            |
|  |  +--------------+  +---------------+  +-----------------+ |            |
|  +============================================================+            |
|                                                                             |
|  +============================================================+            |
|  |                    ADMINISTRATION                          |            |
|  |  +--------------+  +-------------------+  +--------------+ |            |
|  |  | Manage Users |  | Configure Settings|  | View Reports | |            |
|  |  +--------------+  +-------------------+  +--------------+ |            |
|  +============================================================+            |
|                                                                             |
|                        AI-POWERED CRM SYSTEM                                |
+-----------------------------------------------------------------------------+
         |                        |                        |
         v                        v                        v
+------------------+     +------------------+     +------------------+
| Calendar Service |     |Enrichment Service|     |  Email Service   |
| (Google/Outlook) |     | (Apollo/Clearbit)|     | (Resend/Twilio)  |
+------------------+     +------------------+     +------------------+
```

### Use Case Relationships

```
+------------------+          <<includes>>           +------------------+
|  Capture Lead    |-------------------------------->|   Enrich Lead    |
+------------------+                                 +------------------+
        |                                                    |
        | <<includes>>                                       | <<includes>>
        v                                                    v
+------------------+                                 +------------------+
|   Score Lead     |                                 | Categorize Lead  |
+------------------+                                 +------------------+

+------------------+          <<extends>>            +------------------+
| Parse LinkedIn   |-------------------------------->|  Capture Lead    |
+------------------+                                 +------------------+

+------------------+          <<extends>>            +------------------+
|   Import CSV     |-------------------------------->|  Capture Lead    |
+------------------+                                 +------------------+

+------------------+          <<includes>>           +------------------+
|  Book Meeting    |-------------------------------->|  Send Reminders  |
+------------------+                                 +------------------+
        |
        | <<includes>>
        v
+------------------+
|  Sync Calendar   |
+------------------+
```

---

## Narrative Use Cases

### Use Case 1: Capture and Enrich Lead

| Field            | Description                                                    |
|------------------|----------------------------------------------------------------|
| **Use Case ID**  | UC-001                                                         |
| **Use Case Name**| Capture and Enrich Lead                                        |
| **Actor(s)**     | User (Sales Rep), AI System, Enrichment Service                |
| **Description**  | User captures a lead from various sources, and the system automatically enriches it with additional data using AI |
| **Preconditions**| User is logged into the system                                 |
| **Postconditions**| Lead is stored in database with enriched data and AI-generated score |

**Main Flow:**

| Step | Action                                                              |
|------|---------------------------------------------------------------------|
| 1    | User accesses the LeadCatch module                                  |
| 2    | User selects input method (LinkedIn URL, Website, Manual, or CSV)   |
| 3    | User provides lead information                                      |
| 4    | System validates input data                                         |
| 5    | AI parses and extracts lead information                             |
| 6    | System initiates waterfall enrichment (Apollo → Clearbit)           |
| 7    | AI scores the lead (1-100)                                          |
| 8    | AI categorizes and tags the lead                                    |
| 9    | System checks for duplicates                                        |
| 10   | System saves the lead to database                                   |
| 11   | System displays enriched lead profile to user                       |

**Alternative Flows:**

| Step | Condition              | Action                                         |
|------|------------------------|------------------------------------------------|
| 4a   | Invalid input          | System displays error, returns to step 3       |
| 6a   | Service unavailable    | System saves partial data, flags for retry     |
| 9a   | Duplicate found        | System prompts user to merge or create new     |

---

### Use Case 2: Schedule Appointment

| Field            | Description                                                    |
|------------------|----------------------------------------------------------------|
| **Use Case ID**  | UC-002                                                         |
| **Use Case Name**| Schedule Appointment                                           |
| **Actor(s)**     | User, External Attendee, Calendar Service, AI System           |
| **Description**  | User or external attendee schedules a meeting through the system|
| **Preconditions**| User has configured availability and event types               |
| **Postconditions**| Appointment is created and synced to all calendars            |

**Main Flow:**

| Step | Action                                                              |
|------|---------------------------------------------------------------------|
| 1    | Attendee accesses public booking page                               |
| 2    | Attendee selects event type                                         |
| 3    | System retrieves user's availability from connected calendars       |
| 4    | System calculates available time slots                              |
| 5    | Attendee selects preferred date and time                            |
| 6    | Attendee enters contact information                                 |
| 7    | AI suggests optimal meeting time (optional)                         |
| 8    | System validates availability (no conflicts)                        |
| 9    | System creates appointment in database                              |
| 10   | System syncs to Google Calendar/Outlook                             |
| 11   | System sends confirmation email to both parties                     |
| 12   | System schedules reminder notifications                             |

**Alternative Flows:**

| Step | Condition              | Action                                         |
|------|------------------------|------------------------------------------------|
| 5a   | No available slots     | System suggests alternative dates              |
| 8a   | Conflict detected      | Returns to step 5 with updated availability    |
| 10a  | Calendar sync fails    | System queues for retry, notifies user         |

---

### Use Case 3: Manage Sales Pipeline

| Field            | Description                                                    |
|------------------|----------------------------------------------------------------|
| **Use Case ID**  | UC-003                                                         |
| **Use Case Name**| Manage Sales Pipeline                                          |
| **Actor(s)**     | User (Sales Rep), Admin                                        |
| **Description**  | User manages deals through different stages of sales pipeline  |
| **Preconditions**| User is logged in, deals exist in the system                   |
| **Postconditions**| Deal status is updated, activities are logged                 |

**Main Flow:**

| Step | Action                                                              |
|------|---------------------------------------------------------------------|
| 1    | User accesses Pipeline view (Kanban board)                          |
| 2    | System displays deals organized by stage                            |
| 3    | User drags deal card to new stage                                   |
| 4    | System updates deal status                                          |
| 5    | System logs activity in timeline                                    |
| 6    | System triggers automated actions (notifications, tasks)            |
| 7    | System updates analytics                                            |

---

### Use Case 4: Import Leads from CSV

| Field            | Description                                                    |
|------------------|----------------------------------------------------------------|
| **Use Case ID**  | UC-004                                                         |
| **Use Case Name**| Import Leads from CSV                                          |
| **Actor(s)**     | User, AI System                                                |
| **Description**  | User bulk imports leads from a CSV file                        |
| **Preconditions**| User has a CSV file with lead data                             |
| **Postconditions**| All valid leads are imported and enriched                     |

**Main Flow:**

| Step | Action                                                              |
|------|---------------------------------------------------------------------|
| 1    | User accesses Import function in LeadCatch                          |
| 2    | User uploads CSV file                                               |
| 3    | System validates file format                                        |
| 4    | System displays field mapping interface                             |
| 5    | User maps CSV columns to lead fields                                |
| 6    | System validates data in each row                                   |
| 7    | System detects duplicates                                           |
| 8    | User confirms import (with duplicate handling options)              |
| 9    | System imports leads in batches                                     |
| 10   | System queues leads for AI enrichment                               |
| 11   | System displays import summary report                               |

---

### Use Case 5: Generate AI-Powered Email

| Field            | Description                                                    |
|------------------|----------------------------------------------------------------|
| **Use Case ID**  | UC-005                                                         |
| **Use Case Name**| Generate AI-Powered Email                                      |
| **Actor(s)**     | User, AI System                                                |
| **Description**  | User generates personalized email content using AI             |
| **Preconditions**| User has selected a lead or contact                            |
| **Postconditions**| Email is generated and ready to send                          |

**Main Flow:**

| Step | Action                                                              |
|------|---------------------------------------------------------------------|
| 1    | User selects a lead/contact                                         |
| 2    | User clicks "Generate Email"                                        |
| 3    | User selects email type (intro, follow-up, proposal, etc.)          |
| 4    | System retrieves lead context (company, role, interactions)         |
| 5    | AI generates personalized email draft                               |
| 6    | System displays draft to user                                       |
| 7    | User reviews and edits                                              |
| 8    | User sends or saves draft                                           |

---

## Entity Relationship Diagram (ERD)

```
+==================================================================================+
|                              ENTITY RELATIONSHIP DIAGRAM                          |
+==================================================================================+

+------------------+          +------------------+          +------------------+
|      USERS       |          |      LEADS       |          |    CONTACTS      |
+------------------+          +------------------+          +------------------+
| PK: id (uuid)    |---+      | PK: id (uuid)    |          | PK: id (uuid)    |
| email (unique)   |   |      | FK: user_id      |<---+     | FK: user_id      |<--+
| password_hash    |   |      | email            |    |     | FK: company_id   |   |
| full_name        |   |      | first_name       |    |     | email            |   |
| avatar_url       |   |      | last_name        |    |     | first_name       |   |
| role             |   |      | phone            |    |     | last_name        |   |
| timezone         |   |      | company_name     |    |     | phone            |   |
| email_verified   |   |      | job_title        |    |     | job_title        |   |
| created_at       |   |      | linkedin_url     |    |     | linkedin_url     |   |
| updated_at       |   |      | website          |    |     | address          |   |
+------------------+   |      | source           |    |     | custom_fields    |   |
         |             |      | score            |    |     | created_at       |   |
         |    +--------+      | status           |    |     | updated_at       |   |
         |    |               | enrichment_data  |    |     +------------------+   |
         |    |               | custom_fields    |    |              |             |
         |    |               | notes            |    |              |             |
         |    |               | created_at       |    |     +--------+-------------+
         |    |               | updated_at       |    |     |
         |    |               +------------------+    |     |
         |    |                                       |     |
         |    +---------------------------------------+     |
         |    |                                             |
         |    |        +------------------+                 |
         |    |        |    COMPANIES     |                 |
         |    |        +------------------+                 |
         |    +------->| PK: id (uuid)    |-----------------+
         |             | FK: user_id      |<---+
         |             | name             |    |
         |             | domain (unique)  |    |
         |             | industry         |    |
         |             | size             |    |
         |             | linkedin_url     |    |
         |             | address          |    |
         |             | phone            |    |
         |             | enrichment_data  |    |
         |             | created_at       |    |
         |             | updated_at       |    |
         |             +------------------+    |
         |                      |              |
         |                      +--------------+
         |
+--------|----------------------------------------------------------------+
|        |                                                                |
|        v                                                                |
|  +------------------+          +------------------+                     |
|  |      DEALS       |          |   APPOINTMENTS   |                     |
|  +------------------+          +------------------+                     |
|  | PK: id (uuid)    |          | PK: id (uuid)    |                     |
|  | FK: user_id      |          | FK: user_id      |                     |
|  | FK: contact_id   |          | FK: event_type_id|                     |
|  | FK: company_id   |          | FK: contact_id   |                     |
|  | name             |          | title            |                     |
|  | amount           |          | description      |                     |
|  | currency         |          | start_time       |                     |
|  | stage            |          | end_time         |                     |
|  | probability      |          | timezone         |                     |
|  | expected_close   |          | status           |                     |
|  | description      |          | location         |                     |
|  | created_at       |          | meeting_url      |                     |
|  | updated_at       |          | google_event_id  |                     |
|  | closed_at        |          | outlook_event_id |                     |
|  +------------------+          | attendees (json) |                     |
|           |                    | created_at       |                     |
|           |                    | updated_at       |                     |
|           |                    +------------------+                     |
|           |                             ^                               |
|           |                             |                               |
|           |                    +------------------+                     |
|           |                    |   EVENT_TYPES    |                     |
|           |                    +------------------+                     |
|           |                    | PK: id (uuid)    |                     |
|           |                    | FK: user_id      |                     |
|           |                    | name             |                     |
|           |                    | slug (unique)    |                     |
|           |                    | description      |                     |
|           |                    | duration_minutes |                     |
|           |                    | color            |                     |
|           |                    | is_active        |                     |
|           |                    | availability_rules|                    |
|           |                    | buffer_times     |                     |
|           |                    | created_at       |                     |
|           |                    | updated_at       |                     |
|           |                    +------------------+                     |
+-------------------------------------------------------------------------+

+==================================================================================+
|                           SUPPORTING ENTITIES                                     |
+==================================================================================+

+------------------+     +------------------+     +------------------+
|      TASKS       |     |   ACTIVITIES     |     |      NOTES       |
+------------------+     +------------------+     +------------------+
| PK: id (uuid)    |     | PK: id (uuid)    |     | PK: id (uuid)    |
| FK: user_id      |     | FK: user_id      |     | FK: user_id      |
| FK: contact_id   |     | FK: contact_id   |     | FK: contact_id   |
| FK: deal_id      |     | FK: lead_id      |     | FK: lead_id      |
| title            |     | FK: deal_id      |     | FK: deal_id      |
| description      |     | type             |     | content          |
| priority         |     | title            |     | is_pinned        |
| status           |     | description      |     | created_at       |
| due_date         |     | metadata (json)  |     | updated_at       |
| completed_at     |     | created_at       |     +------------------+
| created_at       |     +------------------+
| updated_at       |
+------------------+

+------------------+     +------------------+     +------------------+
|  AVAILABILITY    |     |CALENDAR_CONNECTIONS|   |     AI_LOGS      |
+------------------+     +------------------+     +------------------+
| PK: id (uuid)    |     | PK: id (uuid)    |     | PK: id (uuid)    |
| FK: user_id      |     | FK: user_id      |     | FK: user_id      |
| day_of_week      |     | provider         |     | action_type      |
| start_time       |     | access_token     |     | model_used       |
| end_time         |     | refresh_token    |     | tokens_used      |
| is_available     |     | calendar_id      |     | input_data (json)|
| created_at       |     | token_expires_at |     | output_data(json)|
+------------------+     | is_active        |     | response_time_ms |
                         | created_at       |     | created_at       |
                         | updated_at       |     +------------------+
                         +------------------+

+------------------+     +------------------+     +------------------+
|      TAGS        |     |    LEAD_TAGS     |     |  CONTACT_TAGS    |
+------------------+     +------------------+     +------------------+
| PK: id (uuid)    |<----| FK: tag_id       |     | FK: contact_id   |
| FK: user_id      |     | FK: lead_id      |     | FK: tag_id       |---->
| name             |     +------------------+     +------------------+
| color            |
| entity_type      |
| created_at       |
+------------------+
```

### ERD Relationships Summary

| Relationship                  | Type        | Description                         |
|-------------------------------|-------------|-------------------------------------|
| Users → Leads                 | 1 : N       | User owns many leads                |
| Users → Contacts              | 1 : N       | User owns many contacts             |
| Users → Companies             | 1 : N       | User owns many companies            |
| Users → Deals                 | 1 : N       | User owns many deals                |
| Users → Appointments          | 1 : N       | User hosts many appointments        |
| Users → Event_Types           | 1 : N       | User creates many event types       |
| Users → Tasks                 | 1 : N       | User creates many tasks             |
| Companies → Contacts          | 1 : N       | Company employs many contacts       |
| Companies → Deals             | 1 : N       | Company associated with many deals  |
| Contacts → Deals              | 1 : N       | Contact involved in many deals      |
| Contacts → Appointments       | 1 : N       | Contact attends many appointments   |
| Event_Types → Appointments    | 1 : N       | Event type defines many appointments|
| Leads → Lead_Tags             | 1 : N       | Lead has many tags                  |
| Contacts → Contact_Tags       | 1 : N       | Contact has many tags               |
| Tags → Lead_Tags              | 1 : N       | Tag applied to many leads           |
| Tags → Contact_Tags           | 1 : N       | Tag applied to many contacts        |

---

## Sequence Diagrams

### Sequence Diagram 1: Lead Capture and Enrichment

```
+--------+      +------------+      +----------+      +---------+      +-------------+      +----------+
|  User  |      |    Web     |      |   API    |      |   AI    |      | Enrichment  |      | Database |
|        |      | Interface  |      |  Server  |      | Module  |      |  Services   |      |          |
+---+----+      +-----+------+      +----+-----+      +----+----+      +------+------+      +----+-----+
    |                 |                  |                 |                  |                  |
    | 1. Enter LinkedIn URL              |                 |                  |                  |
    |---------------->|                  |                 |                  |                  |
    |                 |                  |                 |                  |                  |
    |                 | 2. POST /api/leads/parse           |                  |                  |
    |                 |----------------->|                 |                  |                  |
    |                 |                  |                 |                  |                  |
    |                 |                  | 3. parseLinkedInProfile(url)       |                  |
    |                 |                  |---------------->|                  |                  |
    |                 |                  |                 |                  |                  |
    |                 |                  |                 | 4. Extract       |                  |
    |                 |                  |                 |    profile data  |                  |
    |                 |                  |                 |                  |                  |
    |                 |                  | 5. Parsed lead data                |                  |
    |                 |                  |<----------------|                  |                  |
    |                 |                  |                 |                  |                  |
    |                 |                  | 6. Initiate waterfall enrichment   |                  |
    |                 |                  |                 |                  |                  |
    |                 |                  | 7. Apollo.io lookup                |                  |
    |                 |                  |---------------------------------->|                  |
    |                 |                  |                 |                  |                  |
    |                 |                  | 8. Company & contact data          |                  |
    |                 |                  |<----------------------------------|                  |
    |                 |                  |                 |                  |                  |
    |                 |                  |    [If Apollo data incomplete]     |                  |
    |                 |                  | 9. Clearbit lookup                 |                  |
    |                 |                  |---------------------------------->|                  |
    |                 |                  |                 |                  |                  |
    |                 |                  | 10. Additional data                |                  |
    |                 |                  |<----------------------------------|                  |
    |                 |                  |                 |                  |                  |
    |                 |                  | 11. scoreLead(enrichedData)        |                  |
    |                 |                  |---------------->|                  |                  |
    |                 |                  |                 |                  |                  |
    |                 |                  | 12. Score (0-100)                  |                  |
    |                 |                  |<----------------|                  |                  |
    |                 |                  |                 |                  |                  |
    |                 |                  | 13. categorizeLead(enrichedData)   |                  |
    |                 |                  |---------------->|                  |                  |
    |                 |                  |                 |                  |                  |
    |                 |                  | 14. Tags & category                |                  |
    |                 |                  |<----------------|                  |                  |
    |                 |                  |                 |                  |                  |
    |                 |                  | 15. Check duplicates               |                  |
    |                 |                  |-------------------------------------------------->|
    |                 |                  |                 |                  |                  |
    |                 |                  | 16. Duplicate status               |                  |
    |                 |                  |<--------------------------------------------------|
    |                 |                  |                 |                  |                  |
    |                 |                  | 17. INSERT lead                    |                  |
    |                 |                  |-------------------------------------------------->|
    |                 |                  |                 |                  |                  |
    |                 |                  | 18. Lead created                   |                  |
    |                 |                  |<--------------------------------------------------|
    |                 |                  |                 |                  |                  |
    |                 | 19. Lead response|                 |                  |                  |
    |                 |<-----------------|                 |                  |                  |
    |                 |                  |                 |                  |                  |
    | 20. Display enriched lead          |                 |                  |                  |
    |<----------------|                  |                 |                  |                  |
    |                 |                  |                 |                  |                  |
+---+----+      +-----+------+      +----+-----+      +----+----+      +------+------+      +----+-----+
|  User  |      |    Web     |      |   API    |      |   AI    |      | Enrichment  |      | Database |
+--------+      | Interface  |      |  Server  |      | Module  |      |  Services   |      +----------+
                +------------+      +----------+      +---------+      +-------------+
```

---

### Sequence Diagram 2: Appointment Booking

```
+----------+     +-------------+     +-----------+     +----------+     +----------+     +----------+
| Attendee |     | Booking     |     |   API     |     | Calendar |     | Database |     |  Notif.  |
|          |     | Page        |     |  Server   |     | Service  |     |          |     | Service  |
+----+-----+     +------+------+     +-----+-----+     +----+-----+     +----+-----+     +----+-----+
     |                  |                  |                |                |                |
     | 1. Access booking page             |                |                |                |
     |----------------->|                  |                |                |                |
     |                  |                  |                |                |                |
     |                  | 2. GET /api/event-types/{slug}   |                |                |
     |                  |----------------->|                |                |                |
     |                  |                  |                |                |                |
     |                  |                  | 3. Get event type details       |                |
     |                  |                  |------------------------------->|                |
     |                  |                  |                |                |                |
     |                  |                  | 4. Event type data              |                |
     |                  |                  |<-------------------------------|                |
     |                  |                  |                |                |                |
     |                  | 5. Event type info               |                |                |
     |                  |<-----------------|                |                |                |
     |                  |                  |                |                |                |
     |                  | 6. GET /api/availability/slots   |                |                |
     |                  |----------------->|                |                |                |
     |                  |                  |                |                |                |
     |                  |                  | 7. Get user availability rules  |                |
     |                  |                  |------------------------------->|                |
     |                  |                  |                |                |                |
     |                  |                  | 8. Availability config          |                |
     |                  |                  |<-------------------------------|                |
     |                  |                  |                |                |                |
     |                  |                  | 9. Fetch busy times             |                |
     |                  |                  |--------------->|                |                |
     |                  |                  |                |                |                |
     |                  |                  | 10. Busy slots |                |                |
     |                  |                  |<---------------|                |                |
     |                  |                  |                |                |                |
     |                  |                  | 11. Calculate available slots   |                |
     |                  |                  |                |                |                |
     |                  | 12. Available time slots         |                |                |
     |                  |<-----------------|                |                |                |
     |                  |                  |                |                |                |
     | 13. Display calendar               |                |                |                |
     |<-----------------|                  |                |                |                |
     |                  |                  |                |                |                |
     | 14. Select time slot               |                |                |                |
     |----------------->|                  |                |                |                |
     |                  |                  |                |                |                |
     | 15. Enter contact info             |                |                |                |
     |----------------->|                  |                |                |                |
     |                  |                  |                |                |                |
     |                  | 16. POST /api/appointments/book  |                |                |
     |                  |----------------->|                |                |                |
     |                  |                  |                |                |                |
     |                  |                  | 17. Verify slot available       |                |
     |                  |                  |------------------------------->|                |
     |                  |                  |                |                |                |
     |                  |                  | 18. Confirmed  |                |                |
     |                  |                  |<-------------------------------|                |
     |                  |                  |                |                |                |
     |                  |                  | 19. INSERT appointment          |                |
     |                  |                  |------------------------------->|                |
     |                  |                  |                |                |                |
     |                  |                  | 20. Appointment created         |                |
     |                  |                  |<-------------------------------|                |
     |                  |                  |                |                |                |
     |                  |                  | 21. Create Google/Outlook event |                |
     |                  |                  |--------------->|                |                |
     |                  |                  |                |                |                |
     |                  |                  | 22. Event IDs  |                |                |
     |                  |                  |<---------------|                |                |
     |                  |                  |                |                |                |
     |                  |                  | 23. Send confirmation (Host)    |                |
     |                  |                  |---------------------------------------------->|
     |                  |                  |                |                |                |
     |                  |                  | 24. Send confirmation (Attendee)|                |
     |                  |                  |---------------------------------------------->|
     |                  |                  |                |                |                |
     |                  | 25. Booking confirmation         |                |                |
     |                  |<-----------------|                |                |                |
     |                  |                  |                |                |                |
     | 26. Success page |                  |                |                |                |
     |<-----------------|                  |                |                |                |
     |                  |                  |                |                |                |
+----+-----+     +------+------+     +-----+-----+     +----+-----+     +----+-----+     +----+-----+
| Attendee |     | Booking     |     |   API     |     | Calendar |     | Database |     |  Notif.  |
+----------+     | Page        |     |  Server   |     | Service  |     +----------+     | Service  |
                 +-------------+     +-----------+     +----------+                      +----------+
```

---

### Sequence Diagram 3: AI Email Generation

```
+--------+      +------------+      +----------+      +---------+      +----------+
|  User  |      |    Web     |      |   API    |      |   AI    |      | Database |
|        |      | Interface  |      |  Server  |      | Module  |      |          |
+---+----+      +-----+------+      +----+-----+      +----+----+      +----+-----+
    |                 |                  |                 |                  |
    | 1. Select lead/contact             |                 |                  |
    |---------------->|                  |                 |                  |
    |                 |                  |                 |                  |
    | 2. Click "Generate Email"          |                 |                  |
    |---------------->|                  |                 |                  |
    |                 |                  |                 |                  |
    |                 | 3. GET /api/contacts/{id}          |                  |
    |                 |----------------->|                 |                  |
    |                 |                  |                 |                  |
    |                 |                  | 4. Fetch contact details           |
    |                 |                  |---------------------------------------->|
    |                 |                  |                 |                  |
    |                 |                  | 5. Contact data |                  |
    |                 |                  |<----------------------------------------|
    |                 |                  |                 |                  |
    |                 |                  | 6. Fetch interaction history       |
    |                 |                  |---------------------------------------->|
    |                 |                  |                 |                  |
    |                 |                  | 7. Activities & notes              |
    |                 |                  |<----------------------------------------|
    |                 |                  |                 |                  |
    |                 | 8. Contact context                 |                  |
    |                 |<-----------------|                 |                  |
    |                 |                  |                 |                  |
    | 9. Select email type               |                 |                  |
    |---------------->|                  |                 |                  |
    |                 |                  |                 |                  |
    |                 | 10. POST /api/ai/generate-email    |                  |
    |                 |----------------->|                 |                  |
    |                 |                  |                 |                  |
    |                 |                  | 11. Prepare prompt with context    |
    |                 |                  |---------------->|                  |
    |                 |                  |                 |                  |
    |                 |                  |                 | 12. Generate     |
    |                 |                  |                 |     personalized |
    |                 |                  |                 |     email        |
    |                 |                  |                 |                  |
    |                 |                  | 13. Email draft |                  |
    |                 |                  |<----------------|                  |
    |                 |                  |                 |                  |
    |                 |                  | 14. Log AI usage                   |
    |                 |                  |---------------------------------------->|
    |                 |                  |                 |                  |
    |                 |                  | 15. Logged      |                  |
    |                 |                  |<----------------------------------------|
    |                 |                  |                 |                  |
    |                 | 16. Email draft  |                 |                  |
    |                 |<-----------------|                 |                  |
    |                 |                  |                 |                  |
    | 17. Display draft                  |                 |                  |
    |<----------------|                  |                 |                  |
    |                 |                  |                 |                  |
    | 18. Edit and send                  |                 |                  |
    |---------------->|                  |                 |                  |
    |                 |                  |                 |                  |
    |                 | 19. POST /api/email/send           |                  |
    |                 |----------------->|                 |                  |
    |                 |                  |                 |                  |
    |                 |                  | 20. Log activity                   |
    |                 |                  |---------------------------------------->|
    |                 |                  |                 |                  |
    |                 | 21. Email sent   |                 |                  |
    |                 |<-----------------|                 |                  |
    |                 |                  |                 |                  |
    | 22. Confirmation                   |                 |                  |
    |<----------------|                  |                 |                  |
    |                 |                  |                 |                  |
+---+----+      +-----+------+      +----+-----+      +----+----+      +----+-----+
|  User  |      |    Web     |      |   API    |      |   AI    |      | Database |
+--------+      | Interface  |      |  Server  |      | Module  |      +----------+
                +------------+      +----------+      +---------+
```

---

## Data Flow Diagrams (DFD)

### Level 0: Context Diagram

```
                                    EXTERNAL ENTITIES
    +-------------+    +-------------+    +-------------+    +-------------+
    |    User     |    |  Attendee   |    |   Google    |    |   Outlook   |
    | (Sales Rep) |    | (External)  |    |  Calendar   |    |  Calendar   |
    +------+------+    +------+------+    +------+------+    +------+------+
           |                  |                  |                  |
           |                  |                  |                  |
    Login  |  Lead Data       | Booking         |  Calendar        |  Calendar
    Queries|  Updates         | Request         |  Sync            |  Sync
           |                  |                  |                  |
           v                  v                  v                  v
    +======================================================================+
    ||                                                                    ||
    ||                                                                    ||
    ||                    0. AI-POWERED CRM SYSTEM                        ||
    ||                                                                    ||
    ||                                                                    ||
    +======================================================================+
           |                  |                  |                  |
           |                  |                  |                  |
    Dashboard               Confirmation       Events             Events
    Reports                 Available Slots    Created            Created
    AI Insights             Reminders
           |                  |                  |                  |
           v                  v                  v                  v
    +------+------+    +------+------+    +------+------+    +------+------+
    |    User     |    |  Attendee   |    |   Google    |    |   Outlook   |
    +-------------+    +-------------+    |  Calendar   |    |  Calendar   |
                                          +-------------+    +-------------+

                       +-------------+    +-------------+    +-------------+
                       |  Apollo.io  |    |  Clearbit   |    |   Email     |
                       | (Enrichment)|    | (Enrichment)|    |  Service    |
                       +------+------+    +------+------+    +------+------+
                              |                  |                  |
                              |                  |                  |
                       Enrichment          Enrichment          Emails &
                       Request             Request             Reminders
                              |                  |                  |
                              v                  v                  v
                       +======================================+
                       ||  0. AI-POWERED CRM SYSTEM         ||
                       +======================================+
                              |                  |                  |
                              |                  |                  |
                       Company &           Enrichment         Delivery
                       Contact Data        Data               Status
                              |                  |                  |
                              v                  v                  v
                       +------+------+    +------+------+    +------+------+
                       |  Apollo.io  |    |  Clearbit   |    |   Email     |
                       +-------------+    +-------------+    |  Service    |
                                                             +-------------+
```

---

### Level 1: Main Processes

```
+==============================================================================+
|                            DFD LEVEL 1 - MAIN PROCESSES                       |
+==============================================================================+

EXTERNAL ENTITIES:
[User]  [Attendee]  [Google Calendar]  [Outlook]  [Enrichment APIs]  [Email]

                                    |
                                    v
+----------------------------------+----------------------------------+
|                                  |                                  |
|   +-----------+                  |                  +-----------+   |
|   |   1.0     |   Credentials    |   User Data     |   2.0     |   |
|   |  AUTH &   |<-----------------|---------------->|   LEAD    |   |
|   |  AUTHZ    |                  |                 | MANAGEMENT|   |
|   +-----------+                  |                 +-----------+   |
|        |                         |                      |          |
|        | Session Token           |                      | Lead     |
|        |                         |                      | Data     |
|        v                         |                      v          |
|   +----+----+                    |                 +----+----+     |
|   | D1:Users|                    |                 |D2: Leads|     |
|   +---------+                    |                 +---------+     |
|                                  |                      |          |
|                                  |                      |          |
|   +-----------+                  |                 +-----------+   |
|   |   3.0     |  Availability    |   Contact       |   4.0     |   |
|   |APPOINTMENT|<-----------------|---------------->| CONTACT & |   |
|   |SCHEDULING |  Booking Request |   Company Data  | COMPANY   |   |
|   +-----------+                  |                 | MGMT      |   |
|        |                         |                 +-----------+   |
|        | Appointments            |                      |          |
|        v                         |                      v          |
|   +----+--------+                |                 +----+-------+  |
|   |D5:Appointments|              |                 |D3: Contacts|  |
|   +-------------+                |                 |D4: Companies| |
|                                  |                 +------------+  |
|                                  |                                 |
|   +-----------+                  |                 +-----------+   |
|   |   5.0     |  Deal Updates    |   AI Request    |   6.0     |   |
|   |   DEAL    |<-----------------|---------------->|    AI     |   |
|   | MANAGEMENT|                  |                 | PROCESSING|   |
|   +-----------+                  |                 +-----------+   |
|        |                         |                      |          |
|        | Deals                   |                      | AI Logs  |
|        v                         |                      v          |
|   +----+----+                    |                 +----+----+     |
|   |D6: Deals|                    |                 |D8:AI Logs|    |
|   +---------+                    |                 +---------+     |
|                                  |                                 |
|   +-----------+                  |                                 |
|   |   7.0     |  Report Request  |                                 |
|   | REPORTING |<-----------------+                                 |
|   | ANALYTICS |                                                    |
|   +-----------+                                                    |
|        |                                                           |
|        | Activities                                                |
|        v                                                           |
|   +----+-------+                                                   |
|   |D7:Activities|                                                  |
|   +------------+                                                   |
|                                                                    |
+--------------------------------------------------------------------+

DATA STORES:
+----------+  +----------+  +----------+  +----------+
| D1:Users |  | D2:Leads |  |D3:Contacts| |D4:Companies|
+----------+  +----------+  +----------+  +----------+

+-------------+  +----------+  +------------+  +----------+
|D5:Appointments| | D6:Deals |  |D7:Activities|  |D8:AI Logs|
+-------------+  +----------+  +------------+  +----------+
```

---

### Level 2: Lead Management Process (2.0)

```
+==============================================================================+
|                    DFD LEVEL 2 - LEAD MANAGEMENT (Process 2.0)                |
+==============================================================================+

                        +----------+
                        |   User   |
                        +----+-----+
                             |
         +-------------------+-------------------+-------------------+
         |                   |                   |                   |
         | LinkedIn URL      | CSV File          | Export Request    |
         | Website/Manual    |                   |                   |
         v                   v                   v                   |
    +----+----+        +----+----+        +----+----+               |
    |   2.1   |        |   2.7   |        |   2.8   |               |
    | CAPTURE |        | IMPORT  |        | EXPORT  |               |
    |  LEAD   |        |   CSV   |        | LEADS   |               |
    +----+----+        +----+----+        +----+----+               |
         |                   |                   ^                   |
         | Raw Input         | Validated Rows    | Lead Data         |
         v                   v                   |                   |
    +----+----+              |              +----+----+              |
    |   2.2   |              |              |D2: Leads|<-------------+
    |  PARSE  |<-------------+              +---------+
    |  LEAD   |
    +----+----+
         |
         | Parse Request                            +-------------+
         +----------------------------------------->|  AI Module  |
         |                                          +------+------+
         | Parsed Data                                     |
         |<------------------------------------------------+
         v
    +----+----+
    |   2.3   |     Enrichment Request     +-------------+
    | ENRICH  |--------------------------->|  Apollo.io  |
    |  LEAD   |                            +------+------+
    +----+----+                                   |
         ^  |                                     |
         |  |     Company & Contact Data          |
         |  |<------------------------------------+
         |  |
         |  |     Enrichment Request     +-------------+
         |  +---------------------------->|  Clearbit   |
         |                               +------+------+
         |                                      |
         |        Additional Data               |
         |<-------------------------------------+
         |
         v
    +----+----+
    |   2.4   |     Score Request          +-------------+
    |  SCORE  |--------------------------->|  AI Module  |
    |  LEAD   |                            +------+------+
    +----+----+                                   |
         ^                                        |
         |        Lead Score (0-100)              |
         |<---------------------------------------+
         |
         v
    +----+----+
    |   2.5   |     Check Existing
    | DETECT  |-------------------------->+----------+
    |DUPLICATES|                          |D2: Leads |
    +----+----+                           +----+-----+
         ^                                     |
         |        Duplicate Status             |
         |<------------------------------------+
         |
         v
    +----+----+     Categorize Request     +-------------+
    |   2.6   |--------------------------->|  AI Module  |
    |CATEGORIZE|                           +------+------+
    |  LEAD   |                                   |
    +----+----+                                   |
         ^                                        |
         |        Categories & Tags               |
         |<---------------------------------------+
         |
         v
    +----+----+                           +----------+
    |  SAVE   |-------------------------->|D2: Leads |
    |  LEAD   |                           +----------+
    +---------+
         |
         |        Activity Log            +-------------+
         +------------------------------->|D7:Activities|
                                          +-------------+
```

---

### Level 2: Appointment Scheduling Process (3.0)

```
+==============================================================================+
|              DFD LEVEL 2 - APPOINTMENT SCHEDULING (Process 3.0)               |
+==============================================================================+

    +----------+                                          +----------+
    |   User   |                                          | Attendee |
    +----+-----+                                          +----+-----+
         |                                                     |
         | Availability Rules                                  | Date Range
         v                                                     | Request
    +----+----+                                                v
    |   3.1   |                                          +----+----+
    |CONFIGURE|                                          |   3.3   |
    |AVAILABIL|                                          |CALCULATE|
    +---------+                                          | SLOTS   |
         |                                               +----+----+
         | Availability Data                                  ^  |
         v                                                    |  |
    +----+-------+                                            |  |
    |D11:Availability|<---------------------------------------+  |
    +------------+        Availability Rules                     |
                                                                 |
    +----------+                                                 |
    |   User   |     Event Type Config                           |
    +----+-----+                                                 |
         |                                                       |
         v                                                       |
    +----+----+                                                  |
    |   3.2   |                                                  |
    | MANAGE  |                                                  |
    | EVENT   |                                                  |
    | TYPES   |                                                  |
    +----+----+                                                  |
         |                                                       |
         | Event Types                                           |
         v                                                       |
    +----+--------+                                              |
    |D10:EventTypes|<--------------------------------------------+
    +-------------+        Event Type Settings

                              +----+----+
                              |   3.5   |
                              |  SYNC   |     Fetch Busy Times
                              |CALENDARS|<-------------------+
                              +----+----+                    |
                                   |                         |
         +-------------------------+                         |
         |                         |                         |
         v                         v                         |
    +----+------+            +-----+-----+                   |
    |  Google   |            |  Outlook  |                   |
    | Calendar  |            | Calendar  |                   |
    +----+------+            +-----+-----+                   |
         |                         |                         |
         | Busy Slots              | Busy Slots              |
         +------------+------------+                         |
                      |                                      |
                      v                                      |
                 +----+----+                                 |
                 |   3.3   |                                 |
                 |CALCULATE|<--------------------------------+
                 | SLOTS   |
                 +----+----+
                      |
                      | Available Slots
                      v
                 +----+-----+
                 | Attendee |
                 +----+-----+
                      |
                      | Booking Request
                      v
                 +----+----+
                 |   3.4   |
                 | PROCESS |
                 | BOOKING |
                 +----+----+
                      |
         +------------+------------+------------+
         |            |            |            |
         v            v            v            v
    +----+----+  +----+----+  +----+----+  +----+----+
    |  SAVE   |  |  SYNC   |  |  SEND   |  |SCHEDULE |
    |APPOINT- |  |CALENDARS|  | NOTIFS  |  |REMINDERS|
    |  MENT   |  |   3.5   |  |   3.6   |  |   3.8   |
    +----+----+  +----+----+  +----+----+  +----+----+
         |            |            |            |
         v            |            v            |
    +----+--------+   |       +----+----+       |
    |D5:Appointments| |       |  Email  |       |
    +-------------+   |       | Service |       |
                      |       +---------+       |
                      v            |            |
                 +----+------+     v            |
                 |  Google   |+----+----+       |
                 | Calendar  ||  SMS    |       |
                 +-----------+| Service |       |
                 |  Outlook  |+---------+       |
                 | Calendar  |                  |
                 +-----------+                  |
                                                v
                                          +----+----+
                                          |  3.6    |
                                          |  SEND   |
                                          | NOTIFS  |
                                          +---------+
```

---

### Level 2: AI Processing (6.0)

```
+==============================================================================+
|                      DFD LEVEL 2 - AI PROCESSING (Process 6.0)                |
+==============================================================================+

                        +----------+
                        |   User   |
                        +----+-----+
                             |
    +------------------------+------------------------+------------------------+
    |                        |                        |                        |
    | Raw Text/URL           | Lead Data              | Email Request          |
    v                        v                        v                        |
+---+----+              +----+----+              +----+----+                   |
|  6.1   |              |   6.2   |              |   6.4   |                   |
|  LEAD  |              |  LEAD   |              |  EMAIL  |                   |
| PARSING|              | SCORING |              |GENERATION                   |
+---+----+              +----+----+              +----+----+                   |
    |                        |                        |                        |
    | Prompt                 | Scoring Prompt         | Email Prompt           |
    v                        v                        v                        |
+---+--------+          +----+--------+          +----+--------+               |
|   OpenAI   |          |   OpenAI   |          |   OpenAI   |               |
|   GPT-4    |          |   GPT-4    |          |   GPT-4    |               |
+---+--------+          +----+--------+          +----+--------+               |
    |                        |                        |                        |
    | Extracted Data         | Score                  | Email Draft            |
    v                        v                        v                        |
+---+----+              +----+----+              +----+----+                   |
| Parsed |              |  Lead   |              |Generated|                   |
|  Lead  |              |  Score  |              |  Email  |                   |
+---+----+              +----+----+              +----+----+                   |
    |                        |                        |                        |
    |    +-------------------+------------------------+                        |
    |    |                                                                     |
    |    v                                                                     |
    | +--+---+                                                                 |
    | | 6.6  |                                                                 |
    | |TOKEN |                                                                 |
    | |MGMT  |                                                                 |
    | +--+---+                                                                 |
    |    |                                                                     |
    |    | Usage Tracking                                                      |
    |    v                                                                     |
    | +--+-------+                                                             |
    | |D8:AI Logs|                                                             |
    | +----------+                                                             |
    |                                                                          |
    +------------------------+------------------------+------------------------+
                             |                        |
                             | Lead for Tagging       | Scheduling Query
                             v                        v
                        +----+----+              +----+----+
                        |   6.3   |              |   6.5   |
                        |  LEAD   |              |  SMART  |
                        |CATEGORY |              |SCHEDULE |
                        +----+----+              +----+----+
                             |                        |
                             | Categorization         | Scheduling
                             | Prompt                 | Prompt
                             v                        v
                        +----+--------+          +----+--------+
                        |   OpenAI   |          |   OpenAI   |
                        |   GPT-4    |          |   GPT-4    |
                        +----+--------+          +----+--------+
                             |                        |
                             | Tags & Category        | Time Suggestions
                             v                        v
                        +----+----+              +----+----+
                        |Categorized              |Suggested|
                        |  Lead   |              | Times   |
                        +---------+              +---------+
```

---

## Technology Stack Summary

| Layer          | Technology                                           |
|----------------|------------------------------------------------------|
| Frontend       | Next.js 14+, React 18+, TypeScript, Tailwind, Shadcn |
| Backend        | Next.js API Routes, Drizzle ORM                      |
| Database       | PostgreSQL (Supabase)                                |
| Authentication | Supabase Auth                                        |
| AI             | OpenAI GPT-4o                                        |
| Calendar       | Google Calendar API, Microsoft Outlook API           |
| Enrichment     | Apollo.io, Clearbit                                  |
| Notifications  | Resend/SendGrid (Email), Twilio (SMS)                |
| Deployment     | Vercel                                               |

---

## References

- Next.js Documentation: https://nextjs.org/docs
- Supabase Documentation: https://supabase.com/docs
- OpenAI API Reference: https://platform.openai.com/docs
- Drizzle ORM Documentation: https://orm.drizzle.team/docs
- Google Calendar API: https://developers.google.com/calendar
- Microsoft Graph API: https://docs.microsoft.com/en-us/graph

---

**Document Version:** 1.0  
**Last Updated:** December 17, 2025  
**Course:** CNC111 - Web Programming

---

**Prepared by:**
- Moaz Hassan Ismail El Garawany (320240032)
- Ahmed Hossam Aldeen Alsayed (320240051)
- Ahmed Mahmoud (320240024)
