
# Database Design

## 1. Database Overview

GlobeTrotter will use a **relational database architecture** to store and manage structured travel-planning data.

The database must support relationships between:

* Users
* User preferences
* Trips
* Destinations
* Trip stops
* Activities
* Activity categories
* Itinerary sections
* Itinerary items
* Budgets
* Expenses
* Community content
* Public/shared trips
* Saved destinations
* File/media metadata
* Administrative/audit information

The database will act as the **primary source of truth** for transactional application data.

The design should ensure:

* Data consistency.
* Referential integrity.
* Efficient querying.
* Secure user-data isolation.
* Minimal duplication.
* Support for multi-city trips.
* Support for future application growth.

---

# 2. Database Technology

## Primary Database

**PostgreSQL**

PostgreSQL is selected because GlobeTrotter requires strong relational relationships, transactions, constraints, indexing, and structured querying.

### Recommended Supporting Technologies

| Purpose             | Technology                            |
| ------------------- | ------------------------------------- |
| Primary Database    | PostgreSQL                            |
| ORM / Data Access   | To be selected during implementation  |
| Cache               | Redis-compatible service              |
| File Storage        | S3-compatible object storage          |
| Database Migrations | ORM migration system                  |
| Backup              | Managed PostgreSQL backup / snapshots |

PostgreSQL will store structured application data while large media files will be stored in object storage.

---

# 3. Database Design Principles

The database will follow the following principles:

### Relational Integrity

Foreign keys will be used to maintain relationships between related entities.

### Normalization

The schema should generally follow normalized relational design to reduce duplication and update anomalies.

### Controlled Denormalization

Denormalized data may be introduced only where it provides measurable performance benefits.

### Data Ownership

User-owned resources must contain ownership information or be traceable to the owning user.

### Referential Integrity

Relationships must use foreign keys and appropriate delete/update behavior.

### Strong Validation

Critical business rules should be enforced at both the application and database levels where practical.

### Consistent IDs

Primary keys should use a consistent identifier strategy across all major entities.

### Timestamps

Persistent entities should generally include:

* `created_at`
* `updated_at`

### Soft Deletion

Soft deletion may be used for selected entities where recovery, auditing, or historical references are important.

### Source of Truth

PostgreSQL remains authoritative for transactional records.

---

# 4. Data Architecture

The high-level data architecture is:

```text
                           ┌──────────────┐
                           │    USERS     │
                           └──────┬───────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                    ▼             ▼             ▼
             ┌───────────┐ ┌────────────┐ ┌──────────────┐
             │ PREFERENCES│ │   SAVED    │ │    MEDIA     │
             │           │ │ DESTINATIONS│ │   METADATA  │
             └───────────┘ └────────────┘ └──────────────┘
                    │
                    ▼
               ┌─────────┐
               │  TRIPS  │
               └────┬────┘
                    │
             ┌──────┼─────────┐
             │      │         │
             ▼      ▼         ▼
        ┌────────┐ ┌───────┐ ┌──────────┐
        │ STOPS  │ │BUDGETS│ │COMMUNITY │
        └───┬────┘ └───┬───┘ └──────────┘
            │          │
            ▼          ▼
      ┌────────────┐ ┌─────────┐
      │ ITINERARY  │ │ EXPENSES│
      │  SECTIONS  │ └─────────┘
      └─────┬──────┘
            │
            ▼
      ┌─────────────┐
      │ ITINERARY   │
      │    ITEMS    │
      └──────┬──────┘
             │
             ▼
       ┌───────────┐
       │ ACTIVITIES│
       └─────┬─────┘
             │
             ▼
        ┌──────────┐
        │ CATEGORY │
        └──────────┘

DESTINATIONS ────────────────┐
                             │
                             ▼
                         ACTIVITIES
```

The core data hierarchy is:

```text
User
 └── Trips
      ├── Trip Stops
      │     └── Destination
      │
      ├── Itinerary Sections
      │     └── Itinerary Items
      │           └── Activity
      │
      ├── Budget
      │     └── Expenses
      │
      └── Sharing / Community
```

---

# 5. Entities / Tables / Collections

## 5.1 Users

### Purpose

Stores registered GlobeTrotter users and their authentication/profile information.

### Table

`users`

### Fields

| Field               | Data Type      | Required | Description             |
| ------------------- | -------------- | -------: | ----------------------- |
| `id`              | UUID           |      Yes | Primary key             |
| `email`           | VARCHAR        |      Yes | Unique login email      |
| `password_hash`   | VARCHAR        |      Yes | Hashed password         |
| `name`            | VARCHAR        |      Yes | User display name       |
| `avatar_media_id` | UUID           |       No | Profile image reference |
| `bio`             | TEXT           |       No | User biography          |
| `role`            | VARCHAR / ENUM |      Yes | `USER` or `ADMIN`   |
| `status`          | VARCHAR / ENUM |      Yes | Account status          |
| `created_at`      | TIMESTAMP      |      Yes | Creation time           |
| `updated_at`      | TIMESTAMP      |      Yes | Last update             |
| `deleted_at`      | TIMESTAMP      |       No | Soft-delete timestamp   |

### Constraints

* `id` is the primary key.
* `email` must be unique.
* `email` must be valid.
* `password_hash` must never contain plain-text passwords.
* `role` must contain an allowed role.
* `status` must contain an allowed account state.

---

## 5.2 User Preferences

### Purpose

Stores travel-related preferences for personalized experiences.

### Table

`user_preferences`

| Field                  | Data Type   | Required | Description        |
| ---------------------- | ----------- | -------: | ------------------ |
| `id`                 | UUID        |      Yes | Primary key        |
| `user_id`            | UUID        |      Yes | User reference     |
| `preferred_currency` | VARCHAR(3)  |       No | Preferred currency |
| `language`           | VARCHAR(10) |       No | Preferred language |
| `budget_level`       | VARCHAR     |       No | Budget preference  |
| `travel_style`       | VARCHAR     |       No | Travel style       |
| `updated_at`         | TIMESTAMP   |      Yes | Last update        |

### Constraints

* `user_id` references `users.id`.
* One preferences record per user.
* `user_id` should be unique.

---

# 5.3 Countries / Regions

### Purpose

Stores geographic reference information used by destinations.

### Tables

* `countries`
* `regions`

### Countries Fields

| Field          | Data Type | Required |
| -------------- | --------- | -------: |
| `id`         | UUID      |      Yes |
| `name`       | VARCHAR   |      Yes |
| `code`       | VARCHAR   |      Yes |
| `created_at` | TIMESTAMP |      Yes |

### Regions Fields

| Field          | Data Type | Required |
| -------------- | --------- | -------: |
| `id`         | UUID      |      Yes |
| `country_id` | UUID      |      Yes |
| `name`       | VARCHAR   |      Yes |
| `created_at` | TIMESTAMP |      Yes |

---

# 5.4 Destinations

### Purpose

Stores cities and destinations that users can discover and add to trips.

### Table

`destinations`

| Field                | Data Type | Required | Description               |
| -------------------- | --------- | -------: | ------------------------- |
| `id`               | UUID      |      Yes | Primary key               |
| `country_id`       | UUID      |      Yes | Country                   |
| `region_id`        | UUID      |       No | Region                    |
| `name`             | VARCHAR   |      Yes | City/destination name     |
| `slug`             | VARCHAR   |      Yes | URL-friendly identifier   |
| `description`      | TEXT      |       No | Destination description   |
| `latitude`         | DECIMAL   |       No | Latitude                  |
| `longitude`        | DECIMAL   |       No | Longitude                 |
| `cost_index`       | DECIMAL   |       No | Estimated cost index      |
| `popularity_score` | DECIMAL   |       No | Popularity score          |
| `image_media_id`   | UUID      |       No | Primary destination image |
| `is_active`        | BOOLEAN   |      Yes | Availability              |
| `created_at`       | TIMESTAMP |      Yes |                           |
| `updated_at`       | TIMESTAMP |      Yes |                           |

### Constraints

* `slug` must be unique.
* `country_id` must reference an existing country.
* Latitude must be between `-90` and `90`.
* Longitude must be between `-180` and `180`.
* `cost_index` cannot be negative.
* `popularity_score` must remain within the defined application range.

---

# 5.5 Activities

### Purpose

Stores experiences and activities available at destinations.

### Table

`activities`

| Field                | Data Type  | Required |
| -------------------- | ---------- | -------: |
| `id`               | UUID       |      Yes |
| `destination_id`   | UUID       |      Yes |
| `category_id`      | UUID       |      Yes |
| `name`             | VARCHAR    |      Yes |
| `slug`             | VARCHAR    |      Yes |
| `description`      | TEXT       |       No |
| `duration_minutes` | INTEGER    |       No |
| `estimated_cost`   | DECIMAL    |       No |
| `currency`         | VARCHAR(3) |       No |
| `popularity_score` | DECIMAL    |       No |
| `image_media_id`   | UUID       |       No |
| `is_active`        | BOOLEAN    |      Yes |
| `created_at`       | TIMESTAMP  |      Yes |
| `updated_at`       | TIMESTAMP  |      Yes |

### Constraints

* `destination_id` references `destinations`.
* `category_id` references `activity_categories`.
* `duration_minutes` cannot be negative.
* `estimated_cost` cannot be negative.
* `slug` should be unique within the destination or globally according to routing requirements.

---

# 5.6 Activity Categories

### Purpose

Organizes activities into categories such as sightseeing, food, adventure, culture, shopping, and entertainment.

### Table

`activity_categories`

| Field           | Data Type | Required |
| --------------- | --------- | -------: |
| `id`          | UUID      |      Yes |
| `name`        | VARCHAR   |      Yes |
| `slug`        | VARCHAR   |      Yes |
| `description` | TEXT      |       No |
| `created_at`  | TIMESTAMP |      Yes |

### Constraints

* `name` should be unique.
* `slug` must be unique.

---

# 5.7 Trips

### Purpose

Stores user-created travel plans.

### Table

`trips`

| Field              | Data Type      | Required | Description                |
| ------------------ | -------------- | -------: | -------------------------- |
| `id`             | UUID           |      Yes | Primary key                |
| `user_id`        | UUID           |      Yes | Trip owner                 |
| `name`           | VARCHAR        |      Yes | Trip name                  |
| `description`    | TEXT           |       No | Trip description           |
| `start_date`     | DATE           |      Yes | Trip start                 |
| `end_date`       | DATE           |      Yes | Trip end                   |
| `cover_media_id` | UUID           |       No | Cover image                |
| `status`         | VARCHAR / ENUM |      Yes | Upcoming/Ongoing/Completed |
| `visibility`     | VARCHAR / ENUM |      Yes | Private/Public             |
| `created_at`     | TIMESTAMP      |      Yes |                            |
| `updated_at`     | TIMESTAMP      |      Yes |                            |
| `deleted_at`     | TIMESTAMP      |       No | Soft deletion              |

### Constraints

* `user_id` references `users`.
* `name` is required.
* `end_date >= start_date`.
* `visibility` must contain an allowed value.
* `status` must contain an allowed value.
* Deleted trips should not appear in normal queries.

---

# 5.8 Trip Stops

### Purpose

Represents cities/destinations included in a trip.

### Table

`trip_stops`

| Field              | Data Type | Required |
| ------------------ | --------- | -------: |
| `id`             | UUID      |      Yes |
| `trip_id`        | UUID      |      Yes |
| `destination_id` | UUID      |      Yes |
| `start_date`     | DATE      |      Yes |
| `end_date`       | DATE      |      Yes |
| `position`       | INTEGER   |      Yes |
| `notes`          | TEXT      |       No |
| `created_at`     | TIMESTAMP |      Yes |
| `updated_at`     | TIMESTAMP |      Yes |

### Constraints

* `trip_id` references `trips`.
* `destination_id` references `destinations`.
* `end_date >= start_date`.
* `position >= 0`.
* Stop dates should fall within the parent trip dates.

---

# 5.9 Itinerary Sections

### Purpose

Groups itinerary information by destination, date range, or logical travel segment.

### Table

`itinerary_sections`

| Field            | Data Type | Required |
| ---------------- | --------- | -------: |
| `id`           | UUID      |      Yes |
| `trip_id`      | UUID      |      Yes |
| `trip_stop_id` | UUID      |       No |
| `title`        | VARCHAR   |      Yes |
| `start_date`   | DATE      |      Yes |
| `end_date`     | DATE      |      Yes |
| `position`     | INTEGER   |      Yes |
| `notes`        | TEXT      |       No |
| `created_at`   | TIMESTAMP |      Yes |
| `updated_at`   | TIMESTAMP |      Yes |

### Constraints

* `trip_id` references `trips`.
* `trip_stop_id` references `trip_stops` when applicable.
* Dates must fall within the trip.
* `position >= 0`.

---

# 5.10 Itinerary Items

### Purpose

Stores individual planned activities or itinerary events.

### Table

`itinerary_items`

| Field              | Data Type  | Required |
| ------------------ | ---------- | -------: |
| `id`             | UUID       |      Yes |
| `section_id`     | UUID       |      Yes |
| `activity_id`    | UUID       |       No |
| `title`          | VARCHAR    |      Yes |
| `description`    | TEXT       |       No |
| `date`           | DATE       |      Yes |
| `start_time`     | TIME       |       No |
| `end_time`       | TIME       |       No |
| `position`       | INTEGER    |      Yes |
| `estimated_cost` | DECIMAL    |       No |
| `currency`       | VARCHAR(3) |       No |
| `notes`          | TEXT       |       No |
| `created_at`     | TIMESTAMP  |      Yes |
| `updated_at`     | TIMESTAMP  |      Yes |

### Constraints

* `section_id` references `itinerary_sections`.
* `activity_id` may reference `activities`.
* `position >= 0`.
* `estimated_cost >= 0`.
* `end_time` cannot precede `start_time` when both are present.
* `date` must fall within the applicable itinerary section/trip dates.

---

# 5.11 Budgets

### Purpose

Stores trip-level budget information.

### Table

`budgets`

| Field              | Data Type  | Required |
| ------------------ | ---------- | -------: |
| `id`             | UUID       |      Yes |
| `trip_id`        | UUID       |      Yes |
| `planned_amount` | DECIMAL    |      Yes |
| `currency`       | VARCHAR(3) |      Yes |
| `created_at`     | TIMESTAMP  |      Yes |
| `updated_at`     | TIMESTAMP  |      Yes |

### Constraints

* One active budget per trip unless multiple budgets are intentionally supported.
* `planned_amount >= 0`.
* `trip_id` references `trips`.

---

# 5.12 Expenses

### Purpose

Stores estimated or actual travel expenses.

### Table

`expenses`

| Field                 | Data Type      | Required |
| --------------------- | -------------- | -------: |
| `id`                | UUID           |      Yes |
| `trip_id`           | UUID           |      Yes |
| `itinerary_item_id` | UUID           |       No |
| `category`          | VARCHAR / ENUM |      Yes |
| `description`       | VARCHAR        |      Yes |
| `amount`            | DECIMAL        |      Yes |
| `currency`          | VARCHAR(3)     |      Yes |
| `expense_date`      | DATE           |       No |
| `is_estimated`      | BOOLEAN        |      Yes |
| `created_at`        | TIMESTAMP      |      Yes |
| `updated_at`        | TIMESTAMP      |      Yes |

### Expense Categories

Possible values:

* `TRANSPORT`
* `ACCOMMODATION`
* `ACTIVITY`
* `MEAL`
* `MISCELLANEOUS`

### Constraints

* `amount >= 0`.
* `trip_id` references `trips`.
* `itinerary_item_id` references `itinerary_items` when applicable.

---

# 5.13 Saved Destinations

### Purpose

Stores destinations saved by users for future discovery or planning.

### Table

`saved_destinations`

| Field              | Data Type | Required |
| ------------------ | --------- | -------: |
| `id`             | UUID      |      Yes |
| `user_id`        | UUID      |      Yes |
| `destination_id` | UUID      |      Yes |
| `created_at`     | TIMESTAMP |      Yes |

### Constraints

* `user_id` references `users`.
* `destination_id` references `destinations`.
* Combination of `user_id + destination_id` should be unique.

---

# 5.14 Community Posts

### Purpose

Stores travel-related public content shared by users.

### Table

`community_posts`

| Field          | Data Type      | Required |
| -------------- | -------------- | -------: |
| `id`         | UUID           |      Yes |
| `user_id`    | UUID           |      Yes |
| `trip_id`    | UUID           |       No |
| `title`      | VARCHAR        |      Yes |
| `content`    | TEXT           |      Yes |
| `status`     | VARCHAR / ENUM |      Yes |
| `created_at` | TIMESTAMP      |      Yes |
| `updated_at` | TIMESTAMP      |      Yes |
| `deleted_at` | TIMESTAMP      |       No |

### Constraints

* `user_id` references `users`.
* `trip_id` references `trips` when the post represents a trip.
* Publicly visible content must have an appropriate published status.
* Users may modify their own posts according to authorization rules.

---

# 5.15 Public Trip Shares

### Purpose

Stores public sharing metadata for itineraries.

### Table

`trip_shares`

| Field            | Data Type | Required |
| ---------------- | --------- | -------: |
| `id`           | UUID      |      Yes |
| `trip_id`      | UUID      |      Yes |
| `public_token` | VARCHAR   |      Yes |
| `is_active`    | BOOLEAN   |      Yes |
| `created_at`   | TIMESTAMP |      Yes |
| `updated_at`   | TIMESTAMP |      Yes |

### Constraints

* `trip_id` references `trips`.
* `public_token` must be unique.
* A private trip must not be accessible through an active public share.
* The token should be sufficiently unpredictable.

---

# 5.16 Trip Copies

### Purpose

Maintains traceability when a user copies a public trip.

### Table

`trip_copies`

| Field                 | Data Type | Required |
| --------------------- | --------- | -------: |
| `id`                | UUID      |      Yes |
| `source_trip_id`    | UUID      |      Yes |
| `copied_trip_id`    | UUID      |      Yes |
| `copied_by_user_id` | UUID      |      Yes |
| `created_at`        | TIMESTAMP |      Yes |

### Constraints

* Both trip references must point to valid trips.
* `copied_by_user_id` references `users`.

This table is useful for analytics and provenance tracking.

---

# 5.17 Media

### Purpose

Stores metadata for files stored in object storage.

### Table

`media`

| Field                 | Data Type      | Required |
| --------------------- | -------------- | -------: |
| `id`                | UUID           |      Yes |
| `owner_user_id`     | UUID           |       No |
| `storage_provider`  | VARCHAR        |      Yes |
| `storage_key`       | VARCHAR        |      Yes |
| `original_filename` | VARCHAR        |       No |
| `mime_type`         | VARCHAR        |      Yes |
| `size_bytes`        | BIGINT         |      Yes |
| `width`             | INTEGER        |       No |
| `height`            | INTEGER        |       No |
| `checksum`          | VARCHAR        |       No |
| `visibility`        | VARCHAR / ENUM |      Yes |
| `created_at`        | TIMESTAMP      |      Yes |

### Constraints

* `size_bytes >= 0`.
* `width` and `height`, when provided, must be positive.
* `storage_key` must be unique within the storage provider.
* Private media must not use uncontrolled public URLs.

---

# 5.18 Audit Logs

### Purpose

Tracks important system actions for accountability and troubleshooting.

### Table

`audit_logs`

| Field           | Data Type | Required |
| --------------- | --------- | -------: |
| `id`          | UUID      |      Yes |
| `user_id`     | UUID      |       No |
| `action`      | VARCHAR   |      Yes |
| `entity_type` | VARCHAR   |      Yes |
| `entity_id`   | UUID      |       No |
| `metadata`    | JSONB     |       No |
| `ip_address`  | INET      |       No |
| `user_agent`  | TEXT      |       No |
| `created_at`  | TIMESTAMP |      Yes |

Examples:

* Login.
* Logout.
* Trip created.
* Trip published.
* Trip deleted.
* Admin changes.
* Account changes.

---

# 5.19 Authentication / Session Data

Where stateful authentication is used, a session table may be introduced.

### Table

`sessions`

| Field          | Data Type      | Required |
| -------------- | -------------- | -------: |
| `id`         | UUID / VARCHAR |      Yes |
| `user_id`    | UUID           |      Yes |
| `token_hash` | VARCHAR        |      Yes |
| `expires_at` | TIMESTAMP      |      Yes |
| `created_at` | TIMESTAMP      |      Yes |
| `revoked_at` | TIMESTAMP      |       No |

Sensitive session values should be securely protected.

---

# 6. Relationships

## Primary Relationships

```text
users 1 ─────── N trips

users 1 ─────── 1 user_preferences

users N ─────── N destinations
       through saved_destinations

countries 1 ─── N regions

countries 1 ─── N destinations

regions 1 ───── N destinations

destinations 1 ─ N activities

activity_categories 1 ─ N activities

trips 1 ─────── N trip_stops

destinations 1 ─ N trip_stops

trips 1 ─────── N itinerary_sections

trip_stops 1 ── N itinerary_sections

itinerary_sections 1 ─ N itinerary_items

activities 1 ─── N itinerary_items

trips 1 ─────── 1 budgets

trips 1 ─────── N expenses

itinerary_items 1 ─ N expenses

users 1 ─────── N community_posts

trips 1 ─────── N trip_shares

trips 1 ─────── N trip_copies

users 1 ─────── N trip_copies

users 1 ─────── N media

users 1 ─────── N audit_logs
```

---

# 7. Entity Relationship Diagram

```mermaid
erDiagram

    USERS ||--o| USER_PREFERENCES : has
    USERS ||--o{ TRIPS : owns
    USERS ||--o{ SAVED_DESTINATIONS : saves
    USERS ||--o{ COMMUNITY_POSTS : creates
    USERS ||--o{ TRIP_COPIES : creates
    USERS ||--o{ MEDIA : owns
    USERS ||--o{ AUDIT_LOGS : generates

    COUNTRIES ||--o{ REGIONS : contains
    COUNTRIES ||--o{ DESTINATIONS : contains
    REGIONS ||--o{ DESTINATIONS : contains

    DESTINATIONS ||--o{ ACTIVITIES : offers
    ACTIVITY_CATEGORIES ||--o{ ACTIVITIES : categorizes

    DESTINATIONS ||--o{ SAVED_DESTINATIONS : saved_in
    DESTINATIONS ||--o{ TRIP_STOPS : used_by

    TRIPS ||--o{ TRIP_STOPS : contains
    TRIPS ||--o{ ITINERARY_SECTIONS : contains
    TRIPS ||--o| BUDGETS : has
    TRIPS ||--o{ EXPENSES : contains
    TRIPS ||--o{ COMMUNITY_POSTS : referenced_by
    TRIPS ||--o{ TRIP_SHARES : shared_as
    TRIPS ||--o{ TRIP_COPIES : source_or_copy

    TRIP_STOPS ||--o{ ITINERARY_SECTIONS : groups

    ITINERARY_SECTIONS ||--o{ ITINERARY_ITEMS : contains
    ACTIVITIES ||--o{ ITINERARY_ITEMS : referenced_by

    ITINERARY_ITEMS ||--o{ EXPENSES : generates

    USERS {
        uuid id PK
        string email UK
        string password_hash
        string name
        uuid avatar_media_id FK
        string role
        string status
        timestamp created_at
        timestamp updated_at
    }

    USER_PREFERENCES {
        uuid id PK
        uuid user_id FK UK
        string preferred_currency
        string language
        string budget_level
        string travel_style
    }

    COUNTRIES {
        uuid id PK
        string name
        string code UK
    }

    REGIONS {
        uuid id PK
        uuid country_id FK
        string name
    }

    DESTINATIONS {
        uuid id PK
        uuid country_id FK
        uuid region_id FK
        string name
        string slug UK
        decimal latitude
        decimal longitude
        decimal cost_index
        decimal popularity_score
        uuid image_media_id FK
    }

    ACTIVITY_CATEGORIES {
        uuid id PK
        string name UK
        string slug UK
    }

    ACTIVITIES {
        uuid id PK
        uuid destination_id FK
        uuid category_id FK
        string name
        string slug
        integer duration_minutes
        decimal estimated_cost
        string currency
        decimal popularity_score
        uuid image_media_id FK
    }

    TRIPS {
        uuid id PK
        uuid user_id FK
        string name
        date start_date
        date end_date
        string status
        string visibility
        uuid cover_media_id FK
    }

    TRIP_STOPS {
        uuid id PK
        uuid trip_id FK
        uuid destination_id FK
        date start_date
        date end_date
        integer position
    }

    ITINERARY_SECTIONS {
        uuid id PK
        uuid trip_id FK
        uuid trip_stop_id FK
        string title
        date start_date
        date end_date
        integer position
    }

    ITINERARY_ITEMS {
        uuid id PK
        uuid section_id FK
        uuid activity_id FK
        string title
        date date
        time start_time
        time end_time
        integer position
        decimal estimated_cost
    }

    BUDGETS {
        uuid id PK
        uuid trip_id FK UK
        decimal planned_amount
        string currency
    }

    EXPENSES {
        uuid id PK
        uuid trip_id FK
        uuid itinerary_item_id FK
        string category
        decimal amount
        string currency
        boolean is_estimated
    }

    SAVED_DESTINATIONS {
        uuid id PK
        uuid user_id FK
        uuid destination_id FK
        timestamp created_at
    }

    COMMUNITY_POSTS {
        uuid id PK
        uuid user_id FK
        uuid trip_id FK
        string title
        text content
        string status
        timestamp created_at
    }

    TRIP_SHARES {
        uuid id PK
        uuid trip_id FK
        string public_token UK
        boolean is_active
        timestamp created_at
    }

    TRIP_COPIES {
        uuid id PK
        uuid source_trip_id FK
        uuid copied_trip_id FK
        uuid copied_by_user_id FK
        timestamp created_at
    }

    MEDIA {
        uuid id PK
        uuid owner_user_id FK
        string storage_provider
        string storage_key UK
        string mime_type
        bigint size_bytes
        string visibility
    }

    AUDIT_LOGS {
        uuid id PK
        uuid user_id FK
        string action
        string entity_type
        uuid entity_id
        json metadata
        timestamp created_at
    }
```

---

# 8. Indexing Strategy

Indexes should be created based on actual query patterns.

## Users

* Unique index on `email`.
* Index on `role`.
* Index on `status`.

## Trips

Recommended:

* Index on `user_id`.
* Composite index on `user_id, status`.
* Composite index on `user_id, start_date`.
* Index on `visibility`.
* Index on `created_at`.

## Destinations

* Unique index on `slug`.
* Index on `country_id`.
* Index on `region_id`.
* Index on `name`.
* Index on `popularity_score`.
* Index on `cost_index`.

## Activities

* Index on `destination_id`.
* Index on `category_id`.
* Index on `name`.
* Index on `popularity_score`.
* Composite indexes for frequent filtering combinations.

## Trip Stops

* Index on `trip_id`.
* Composite index on `trip_id, position`.
* Composite index on `trip_id, start_date`.

## Itinerary Sections

* Index on `trip_id`.
* Index on `trip_stop_id`.
* Composite index on `trip_id, position`.
* Composite index on `trip_id, start_date`.

## Itinerary Items

* Index on `section_id`.
* Index on `activity_id`.
* Composite index on `section_id, position`.
* Composite index on `section_id, date`.

## Expenses

* Index on `trip_id`.
* Index on `itinerary_item_id`.
* Composite index on `trip_id, category`.
* Composite index on `trip_id, expense_date`.

## Community

* Index on `status`.
* Index on `created_at`.
* Index on `user_id`.
* Index on `trip_id`.

## Audit Logs

* Index on `user_id`.
* Index on `entity_type, entity_id`.
* Index on `created_at`.
* Composite index on `action, created_at`.

### Search

For destination/activity search, PostgreSQL indexes may initially be sufficient.

For larger datasets, full-text search or a dedicated search engine can be introduced.

---

# 9. Validation Rules

## User Validation

* Email must be valid.
* Email must be unique.
* Name must satisfy configured length requirements.
* Password must meet security requirements.

## Trip Validation

* Name is required.
* Start date is required.
* End date is required.
* End date cannot precede start date.
* Cover media must satisfy upload restrictions.
* Visibility must be an allowed value.

## Trip Stop Validation

* Destination must exist.
* Start date must be within trip dates.
* End date must be within trip dates.
* End date cannot precede start date.
* Position cannot be negative.

## Activity Validation

* Destination must exist.
* Category must exist.
* Duration cannot be negative.
* Cost cannot be negative.

## Itinerary Validation

* Section dates must be within trip dates.
* Item date must be within section/trip dates.
* Activity must exist when referenced.
* End time cannot precede start time.
* Position cannot be negative.

## Expense Validation

* Amount cannot be negative.
* Currency must be valid.
* Category must be allowed.
* Trip must exist.

## Media Validation

* File type must be allowed.
* File size must be within limits.
* Storage reference must be valid.
* Private/public visibility must be explicitly defined.

---

# 10. Constraints

## Primary Key Constraints

All main entities must have a unique primary key.

## Foreign Key Constraints

Foreign keys must be used to preserve relationships.

Example:

```text
trips.user_id → users.id
trip_stops.trip_id → trips.id
trip_stops.destination_id → destinations.id
```

## Unique Constraints

Examples:

* `users.email`
* `destinations.slug`
* `activity_categories.slug`
* `trip_shares.public_token`
* `user_preferences.user_id`
* `budgets.trip_id`
* `saved_destinations(user_id, destination_id)`

## Check Constraints

Examples:

```text
end_date >= start_date
amount >= 0
estimated_cost >= 0
duration_minutes >= 0
position >= 0
latitude BETWEEN -90 AND 90
longitude BETWEEN -180 AND 180
```

## Delete Rules

Delete behavior must be selected carefully.

Recommended approach:

* User deletion → soft deletion initially.
* Trip deletion → soft deletion.
* Destination deletion → generally restricted if referenced.
* Activity deletion → generally deactivate instead of physically deleting.
* Reference/master data → prefer `is_active=false`.
* Child itinerary data → can use cascade only when safe and intentional.

---

# 11. Audit Data

Important user and administrative operations should be auditable.

## Audit Events

Possible events:

* Account created.
* Login.
* Failed login.
* Password changed.
* Profile changed.
* Trip created.
* Trip updated.
* Trip deleted.
* Trip published.
* Trip unpublished.
* Public trip copied.
* Admin action.
* Media upload.
* Media deletion.

## Audit Requirements

Audit data should:

* Be append-oriented.
* Not store passwords.
* Not store authentication secrets.
* Include actor/user when available.
* Include target entity where applicable.
* Include timestamps.
* Support security and debugging investigations.

---

# 12. File / Media Metadata

Media binaries should be stored in object storage.

PostgreSQL stores metadata such as:

* File ID.
* Owner.
* Provider.
* Storage key.
* Original file name.
* MIME type.
* File size.
* Dimensions.
* Checksum.
* Visibility.
* Creation timestamp.

### Example

```text
User
  │
  ▼
Media Record
  │
  ├── storage_provider = "object-storage"
  ├── storage_key = "users/.../avatar.webp"
  ├── mime_type = "image/webp"
  ├── size_bytes = ...
  └── visibility = "private"
```

References from other tables should point to the `media.id` rather than directly depending on provider-specific URLs.

---

# 13. Backup & Recovery

## Backup Strategy

Production PostgreSQL should use:

* Automated daily backups.
* Point-in-time recovery where supported.
* Periodic backup verification.
* Off-site or provider-independent backup where appropriate.

## Recovery

The recovery process should support:

* Full database restoration.
* Point-in-time restoration where available.
* Migration verification.
* Integrity checks.

## Backup Testing

Backups should periodically be restored in a non-production environment to confirm that they are actually usable.

## Media Backup

Object storage should have:

* Versioning where available.
* Provider-level redundancy.
* Appropriate retention rules.
* Backup or replication for critical user media where required.

---

# 14. Data Retention

## Active User Data

Retained while the account remains active.

## Deleted Accounts

Account deletion should follow a defined retention policy.

A possible approach:

```text
Account Deletion Request
        │
        ▼
Soft Delete
        │
        ▼
Retention Period
        │
        ▼
Permanent Deletion / Anonymization
```

The exact retention duration should be finalized based on operational and legal requirements.

## Trips

Deleted trips may remain soft-deleted for recovery before permanent removal.

## Audit Logs

Audit logs should be retained according to operational, security, and compliance requirements.

## Media

Unused media should be periodically identified and removed after a suitable grace period.

---

# 15. Security / Data Isolation

## User Isolation

Every user-owned resource must be associated with an owning user or be securely traceable through its parent resource.

Example:

```text
Request
  │
  ▼
Authenticated User
  │
  ▼
Trip ID
  │
  ▼
Check trips.user_id = authenticated_user.id
  │
  ├── TRUE  → Allow
  └── FALSE → Deny
```

## Private Trips

Private trip data must only be accessible by:

* The trip owner.
* Authorized administrators where permitted.

## Public Trips

Only explicitly published information should be exposed through public routes.

## Admin Data

Administrative access must be separated from normal user access.

## Database Credentials

Database credentials must:

* Never be committed to source control.
* Be stored in environment secrets.
* Use least-privilege database users.
* Be rotated when necessary.

## Sensitive Data

The database should never store:

* Plain-text passwords.
* Authentication tokens in raw form when hashing is appropriate.
* Unnecessary sensitive personal information.

---

# 16. Future Database Changes

The database is expected to evolve as GlobeTrotter grows.

## Multi-Currency Support

Future tables/columns may support:

* Base currency.
* Exchange rates.
* Converted totals.
* Historical conversion values.

Possible future table:

`exchange_rates`

---

## AI Recommendations

Additional structures may be introduced for:

* User travel preferences.
* Recommendation scores.
* User interaction history.
* Destination affinity.
* Activity affinity.

Possible tables:

```text
recommendation_profiles
recommendation_events
recommendation_results
```

---

## Collaboration

Future collaborative planning may require:

* Trip members.
* Permissions.
* Roles.
* Invitations.
* Activity comments.
* Change history.

Possible tables:

```text
trip_members
trip_invitations
trip_comments
trip_activity_votes
```

---

## Booking

Future booking integrations may introduce:

```text
bookings
booking_items
booking_providers
booking_payments
```

These should be isolated from the core planning tables.

---

## Community Expansion

Future social features may require:

```text
follows
likes
comments
reviews
ratings
notifications
```

---

## Advanced Analytics

Large-scale analytics may eventually move from the transactional database into a separate analytics/data warehouse.

```text
PostgreSQL
     │
     ▼
Event / ETL Pipeline
     │
     ▼
Analytics Store
     │
     ▼
Reporting / Admin Dashboard
```

This prevents analytical workloads from significantly affecting transactional application performance.

---

# Database Naming Conventions

The following conventions should be applied consistently.

### Tables

Use lowercase `snake_case` and plural names:

```text
users
trips
trip_stops
itinerary_items
expenses
```

### Columns

Use lowercase `snake_case`:

```text
user_id
created_at
start_date
estimated_cost
```

### Primary Keys

Use:

```text
id
```

### Foreign Keys

Use:

```text
<entity>_id
```

Examples:

```text
user_id
trip_id
destination_id
activity_id
```

### Timestamps

Use:

```text
created_at
updated_at
deleted_at
```

---

# Recommended Core Schema

The minimum production database should contain:

```text
users
user_preferences

countries
regions
destinations
activity_categories
activities

trips
trip_stops
itinerary_sections
itinerary_items

budgets
expenses

saved_destinations

community_posts
trip_shares
trip_copies

media
audit_logs
```

This schema provides the relational foundation required for the GlobeTrotter MVP while leaving enough flexibility for future collaboration, AI, booking, analytics, and community capabilities.
