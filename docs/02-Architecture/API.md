
# API Design

# 1. API Overview

The GlobeTrotter API defines the backend contract used by the frontend application and other authorized clients.

The API follows a **RESTful architecture** and uses **JSON** for request and response bodies.

The API is responsible for:

* Authentication and authorization.
* User management.
* Trip management.
* Destination discovery.
* Activity discovery.
* Itinerary management.
* Budget and expense management.
* Calendar/timeline data.
* Community features.
* Public itinerary sharing.
* Notifications.
* Administrative analytics.
* Media management.

## API Principles

* REST-based resource design.
* JSON request/response format.
* HTTPS in production.
* Versioned API paths.
* Standard HTTP status codes.
* Consistent response structures.
* Backend-enforced validation.
* Authentication for protected resources.
* Resource-level authorization.
* Pagination for collection endpoints.
* Filtering and sorting where applicable.

---

# 2. API Architecture

The API is implemented within the GlobeTrotter modular monolith.

```text
┌──────────────────────┐
│   Frontend Client    │
└──────────┬───────────┘
           │ HTTPS
           ▼
┌──────────────────────┐
│      API Router      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│             API Modules                  │
│                                          │
│ Auth │ Users │ Trips │ Destinations     │
│ Activities │ Itinerary │ Budget         │
│ Calendar │ Community │ Public Trips     │
│ Notifications │ Admin │ Media           │
└──────────────────┬───────────────────────┘
                   │
                   ▼
             ┌──────────────┐
             │   Services   │
             └──────┬───────┘
                    │
                    ▼
             ┌──────────────┐
             │ Repositories │
             └──────┬───────┘
                    │
                    ▼
             ┌──────────────┐
             │ PostgreSQL   │
             └──────────────┘
```

## API Layers

### Router Layer

* Defines endpoint paths.
* Connects middleware.
* Routes requests to controllers.

### Controller Layer

* Reads request data.
* Calls application services.
* Returns HTTP responses.

### Service Layer

* Implements business logic.
* Coordinates module operations.
* Handles business workflows.

### Repository Layer

* Executes database operations.
* Handles persistence and queries.

---

# 3. Base URL

## Development

```text
http://localhost:5000/api/v1
```

## Production

```text
https://api.<domain>/api/v1
```

The production domain should be finalized before deployment.

All application endpoints should be placed under the versioned `/api/v1` path.

Example:

```text
GET https://api.globetrotter.example/api/v1/trips
```

---

# 4. Authentication

Protected API endpoints require an authenticated user.

## Recommended Authentication

The initial implementation may use either:

* Secure HTTP-only session cookies, or
* Short-lived access tokens with an appropriate refresh mechanism.

The final implementation must select one approach and use it consistently.

## Authentication Header

For bearer-token authentication:

```http
Authorization: Bearer <access_token>
```

For cookie-based authentication, authentication credentials are supplied automatically through secure HTTP-only cookies.

## Public Endpoints

Examples:

```text
POST /auth/register
POST /auth/login
POST /auth/forgot-password
POST /auth/reset-password

GET /public/trips/:publicToken
```

## Protected Endpoints

Most user-specific resources require authentication.

Example:

```text
GET /users/me
GET /trips
POST /trips
PUT /trips/:id
```

## Authentication Errors

### 401 Unauthorized

Returned when:

* No authentication is provided.
* Authentication is invalid.
* Authentication is expired.
* User account is disabled.

Example:

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication is required."
  }
}
```

---

# 5. Request Standards

## Content Type

JSON requests should use:

```http
Content-Type: application/json
```

File uploads should use:

```http
Content-Type: multipart/form-data
```

## Request Format

Example:

```json
{
  "name": "European Summer Trip",
  "startDate": "2026-06-10",
  "endDate": "2026-06-20",
  "description": "Multi-city European trip"
}
```

## Naming Convention

API JSON properties should use **camelCase**.

```json
{
  "userId": "uuid",
  "startDate": "2026-06-10",
  "estimatedCost": 500
}
```

Database fields may use `snake_case` internally.

## Dates

Dates use ISO 8601 format:

```text
YYYY-MM-DD
```

Example:

```text
2026-08-22
```

## Date-Time

Date-time values should use ISO 8601.

Example:

```text
2026-08-22T10:30:00Z
```

## Currency

Monetary values should be accompanied by a currency code.

```json
{
  "amount": 250.50,
  "currency": "USD"
}
```

## IDs

Resources should use UUIDs or another consistent non-sequential identifier strategy.

---

# 6. Response Standards

All API responses should follow a consistent structure.

## Successful Response

```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully."
}
```

## Collection Response

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## Single Resource Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "European Summer Trip"
  }
}
```

## Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "One or more fields are invalid.",
    "details": []
  }
}
```

## Response Principles

* `success` indicates operation status.
* `data` contains successful result data.
* `message` provides a human-readable message.
* `error` contains structured error information.
* `meta` contains pagination or other metadata.

---

# 7. Error Handling

The API must use standard HTTP status codes.

| Status | Meaning                                  |
| ------ | ---------------------------------------- |
| 200    | Successful request                       |
| 201    | Resource created                         |
| 204    | Successful request with no response body |
| 400    | Bad request                              |
| 401    | Unauthorized                             |
| 403    | Forbidden                                |
| 404    | Resource not found                       |
| 409    | Conflict                                 |
| 422    | Validation error                         |
| 429    | Rate limit exceeded                      |
| 500    | Internal server error                    |
| 502    | External service failure                 |
| 503    | Service unavailable                      |

## Error Codes

Common application error codes:

```text
VALIDATION_ERROR
UNAUTHORIZED
FORBIDDEN
NOT_FOUND
CONFLICT
INVALID_CREDENTIALS
ACCOUNT_DISABLED
TRIP_ACCESS_DENIED
INVALID_DATE_RANGE
BUDGET_INVALID
FILE_TOO_LARGE
FILE_TYPE_NOT_ALLOWED
RATE_LIMIT_EXCEEDED
INTERNAL_ERROR
EXTERNAL_SERVICE_ERROR
```

## Example Validation Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please correct the highlighted fields.",
    "details": [
      {
        "field": "endDate",
        "message": "End date must be on or after start date."
      }
    ]
  }
}
```

## Internal Errors

Internal stack traces, database errors, credentials, and sensitive infrastructure information must never be returned to clients.

---

# 8. Pagination

Collection endpoints should support pagination.

## Query Parameters

```text
?page=1&pageSize=20
```

### Parameters

| Parameter    | Default | Description       |
| ------------ | ------: | ----------------- |
| `page`     |       1 | Page number       |
| `pageSize` |      20 | Number of results |

The API must enforce a maximum page size.

Example:

```text
?page=2&pageSize=25
```

## Response

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 2,
    "pageSize": 25,
    "total": 125,
    "totalPages": 5
  }
}
```

---

# 9. Filtering

Filtering should use query parameters.

## Trip Example

```text
GET /trips?status=upcoming
```

Multiple filters:

```text
GET /trips?status=upcoming&visibility=private
```

## Destination Example

```text
GET /destinations?countryId=uuid&regionId=uuid
```

## Activity Example

```text
GET /activities?destinationId=uuid&categoryId=uuid
```

## Community Example

```text
GET /community?status=published
```

Filtering parameters must be validated against supported fields.

---

# 10. Sorting

Sorting should use a consistent query parameter.

Example:

```text
GET /trips?sortBy=startDate&sortOrder=asc
```

### Parameters

```text
sortBy
sortOrder
```

Supported values should be explicitly defined by each endpoint.

Example:

```text
sortBy=createdAt
sortOrder=desc
```

The API must reject unsupported sort fields rather than directly using arbitrary client-supplied column names.

---

# 11. File Uploads

Files are uploaded through the Media API and stored in external object storage.

## Supported Operations

* Upload.
* Retrieve metadata.
* Delete.
* Associate media with supported resources.

## Upload Request

```http
POST /api/v1/media
Content-Type: multipart/form-data
```

Example fields:

```text
file=<binary>
visibility=private
```

## Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "mimeType": "image/webp",
    "sizeBytes": 182340,
    "visibility": "private"
  }
}
```

## Validation

* Maximum file size must be enforced.
* MIME type must be validated.
* File extension must not be trusted by itself.
* Uploaded content should be checked where appropriate.
* Executable files must not be accepted.
* Private media must not automatically receive public access.

---

# 12. API Endpoints

# Authentication

## POST /auth/register

**Purpose:** Create a new GlobeTrotter account.

**Authentication:** Not required.

**Authorization:** Public.

### Request

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

### Response

**201 Created**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com"
    }
  },
  "message": "Account created successfully."
}
```

**Errors:**

* `400` Invalid request.
* `409` Email already registered.
* `422` Validation error.

**Validation:**

* Name required.
* Valid email required.
* Email must be unique.
* Password must meet security requirements.

**Permissions:** Public.

---

## POST /auth/login

**Purpose:** Authenticate a user.

**Authentication:** Not required.

**Authorization:** Public.

### Request

```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER"
    }
  },
  "message": "Login successful."
}
```

**Errors:**

* `400` Invalid request.
* `401` Invalid credentials.
* `403` Account disabled.
* `429` Too many attempts.

**Validation:**

* Email required.
* Password required.

**Permissions:** Public.

---

## POST /auth/logout

**Purpose:** End the authenticated session.

**Authentication:** Required.

**Authorization:** Authenticated user.

### Request

```json
{}
```

### Response

```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

**Errors:**

* `401` Unauthorized.

**Permissions:** Authenticated user.

---

## POST /auth/forgot-password

**Purpose:** Request password reset.

**Authentication:** Not required.

**Authorization:** Public.

### Request

```json
{
  "email": "john@example.com"
}
```

### Response

```json
{
  "success": true,
  "message": "If the account exists, password reset instructions will be sent."
}
```

**Errors:**

* `400` Invalid email.
* `429` Rate limit exceeded.

**Security Rule:** The endpoint should not reveal whether an email exists.

---

## POST /auth/reset-password

**Purpose:** Reset a forgotten password.

**Authentication:** Not required.

**Authorization:** Valid reset token.

### Request

```json
{
  "token": "reset-token",
  "newPassword": "NewSecurePassword123"
}
```

### Response

```json
{
  "success": true,
  "message": "Password reset successfully."
}
```

**Errors:**

* `400` Invalid request.
* `401` Invalid or expired token.
* `422` Weak password.

---

# Users

## GET /users/me

**Purpose:** Retrieve the authenticated user's profile.

**Authentication:** Required.

**Authorization:** Authenticated user.

### Request

```text
GET /api/v1/users/me
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "Travel enthusiast",
    "role": "USER"
  }
}
```

**Errors:**

* `401` Unauthorized.
* `404` User not found.

---

## PUT /users/me

**Purpose:** Update the authenticated user's profile.

**Authentication:** Required.

**Authorization:** Own profile.

### Request

```json
{
  "name": "John Doe",
  "bio": "Travel enthusiast"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "bio": "Travel enthusiast"
  }
}
```

**Errors:**

* `401` Unauthorized.
* `422` Validation error.

---

## DELETE /users/me

**Purpose:** Request account deletion.

**Authentication:** Required.

**Authorization:** Own account.

### Request

```json
{
  "confirmation": "DELETE"
}
```

### Response

```json
{
  "success": true,
  "message": "Account deletion initiated."
}
```

**Business Rules:**

* Explicit confirmation required.
* Applicable retention rules must be followed.

---

# User Preferences

## GET /users/me/preferences

**Purpose:** Retrieve travel preferences.

**Authentication:** Required.

**Authorization:** Own preferences.

### Response

```json
{
  "success": true,
  "data": {
    "preferredCurrency": "USD",
    "language": "en",
    "budgetLevel": "medium",
    "travelStyle": "adventure"
  }
}
```

---

## PUT /users/me/preferences

**Purpose:** Update travel preferences.

**Authentication:** Required.

**Authorization:** Own preferences.

### Request

```json
{
  "preferredCurrency": "USD",
  "language": "en",
  "budgetLevel": "medium",
  "travelStyle": "adventure"
}
```

---

# Dashboard

## GET /dashboard

**Purpose:** Retrieve dashboard information for the authenticated user.

**Authentication:** Required.

**Authorization:** Authenticated user.

### Response

```json
{
  "success": true,
  "data": {
    "upcomingTrips": [],
    "recentTrips": [],
    "popularDestinations": [],
    "recommendedDestinations": [],
    "budgetHighlights": {}
  }
}
```

---

# Trips

## GET /trips

**Purpose:** List the authenticated user's trips.

**Authentication:** Required.

**Authorization:** Own trips.

### Query Parameters

```text
?page=1
&pageSize=20
&status=upcoming
&sortBy=startDate
&sortOrder=asc
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "European Summer Trip",
      "startDate": "2026-06-10",
      "endDate": "2026-06-20",
      "status": "UPCOMING",
      "visibility": "PRIVATE"
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

---

## POST /trips

**Purpose:** Create a new trip.

**Authentication:** Required.

**Authorization:** Authenticated user.

### Request

```json
{
  "name": "European Summer Trip",
  "description": "A multi-city European vacation",
  "startDate": "2026-06-10",
  "endDate": "2026-06-20",
  "visibility": "PRIVATE"
}
```

### Response

**201 Created**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "European Summer Trip",
    "startDate": "2026-06-10",
    "endDate": "2026-06-20",
    "status": "UPCOMING",
    "visibility": "PRIVATE"
  }
}
```

**Validation:**

* Name required.
* Valid date range.
* Visibility must be supported.

---

## GET /trips/:id

**Purpose:** Retrieve a specific trip.

**Authentication:** Required.

**Authorization:** Owner or authorized administrator.

### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "European Summer Trip",
    "description": "A multi-city European vacation",
    "startDate": "2026-06-10",
    "endDate": "2026-06-20",
    "status": "UPCOMING",
    "visibility": "PRIVATE"
  }
}
```

**Errors:**

* `401` Unauthorized.
* `403` Forbidden.
* `404` Trip not found.

---

## PUT /trips/:id

**Purpose:** Update a trip.

**Authentication:** Required.

**Authorization:** Trip owner or authorized administrator.

### Request

```json
{
  "name": "Updated European Trip",
  "description": "Updated description",
  "startDate": "2026-06-10",
  "endDate": "2026-06-22"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Updated European Trip",
    "startDate": "2026-06-10",
    "endDate": "2026-06-22"
  }
}
```

**Validation:**

* End date cannot precede start date.
* Existing stops/itinerary records must remain valid.

---

## DELETE /trips/:id

**Purpose:** Delete a trip.

**Authentication:** Required.

**Authorization:** Trip owner or administrator.

### Response

```json
{
  "success": true,
  "message": "Trip deleted successfully."
}
```

---

## PATCH /trips/:id/visibility

**Purpose:** Change trip visibility.

**Authentication:** Required.

**Authorization:** Trip owner.

### Request

```json
{
  "visibility": "PUBLIC"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "visibility": "PUBLIC"
  }
}
```

---

# Trip Stops / Destinations

## GET /destinations

**Purpose:** Search available destinations.

**Authentication:** Optional.

**Authorization:** Public for published destination data.

### Query Parameters

```text
?search=Paris
&countryId=uuid
&regionId=uuid
&minCostIndex=1
&maxCostIndex=5
&sortBy=popularityScore
&sortOrder=desc
&page=1
&pageSize=20
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Paris",
      "country": "France",
      "costIndex": 4,
      "popularityScore": 9.3
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

---

## GET /destinations/:id

**Purpose:** Retrieve destination details.

**Authentication:** Optional.

**Authorization:** Public destination data.

### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Paris",
    "description": "Capital of France",
    "country": "France",
    "region": "Île-de-France",
    "latitude": 48.8566,
    "longitude": 2.3522,
    "costIndex": 4,
    "popularityScore": 9.3
  }
}
```

---

## POST /trips/:tripId/stops

**Purpose:** Add a destination to a trip.

**Authentication:** Required.

**Authorization:** Trip owner.

### Request

```json
{
  "destinationId": "destination-uuid",
  "startDate": "2026-06-10",
  "endDate": "2026-06-13",
  "position": 0
}
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "stop-uuid",
    "tripId": "trip-uuid",
    "destinationId": "destination-uuid",
    "startDate": "2026-06-10",
    "endDate": "2026-06-13",
    "position": 0
  }
}
```

**Validation:**

* Destination must exist.
* Dates must fall within trip dates.
* End date cannot precede start date.
* Position must be valid.

---

## DELETE /trips/:tripId/stops/:stopId

**Purpose:** Remove a destination from a trip.

**Authentication:** Required.

**Authorization:** Trip owner.

### Response

```json
{
  "success": true,
  "message": "Trip stop removed successfully."
}
```

---

## PATCH /trips/:tripId/stops/reorder

**Purpose:** Reorder destinations.

**Authentication:** Required.

**Authorization:** Trip owner.

### Request

```json
{
  "stopIds": [
    "stop-2",
    "stop-1",
    "stop-3"
  ]
}
```

### Response

```json
{
  "success": true,
  "message": "Trip stops reordered successfully."
}
```

---

# Activities

## GET /activities

**Purpose:** Search activities.

**Authentication:** Optional.

**Authorization:** Public activity data.

### Query Parameters

```text
?search=museum
&destinationId=uuid
&categoryId=uuid
&minCost=0
&maxCost=100
&minDuration=30
&maxDuration=240
&page=1
&pageSize=20
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Louvre Museum Tour",
      "durationMinutes": 180,
      "estimatedCost": 40,
      "currency": "EUR"
    }
  ]
}
```

---

## GET /activities/:id

**Purpose:** Retrieve activity details.

**Authentication:** Optional.

**Authorization:** Public activity data.

### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Louvre Museum Tour",
    "description": "Museum tour",
    "durationMinutes": 180,
    "estimatedCost": 40,
    "currency": "EUR"
  }
}
```

---

# Itinerary

## GET /trips/:tripId/itinerary

**Purpose:** Retrieve the complete itinerary for a trip.

**Authentication:** Required for private trips.

**Authorization:** Trip owner, authorized administrator, or public access when explicitly published.

### Response

```json
{
  "success": true,
  "data": {
    "tripId": "uuid",
    "sections": [
      {
        "id": "section-uuid",
        "title": "Paris",
        "startDate": "2026-06-10",
        "endDate": "2026-06-13",
        "items": []
      }
    ]
  }
}
```

---

## POST /trips/:tripId/itinerary/sections

**Purpose:** Create an itinerary section.

**Authentication:** Required.

**Authorization:** Trip owner.

### Request

```json
{
  "tripStopId": "stop-uuid",
  "title": "Paris",
  "startDate": "2026-06-10",
  "endDate": "2026-06-13",
  "position": 0
}
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "section-uuid",
    "title": "Paris"
  }
}
```

---

## PUT /itinerary/sections/:id

**Purpose:** Update an itinerary section.

**Authentication:** Required.

**Authorization:** Trip owner.

### Request

```json
{
  "title": "Paris Sightseeing",
  "startDate": "2026-06-10",
  "endDate": "2026-06-13"
}
```

---

## DELETE /itinerary/sections/:id

**Purpose:** Delete an itinerary section.

**Authentication:** Required.

**Authorization:** Trip owner.

### Response

```json
{
  "success": true,
  "message": "Itinerary section deleted successfully."
}
```

---

## POST /itinerary/sections/:sectionId/items

**Purpose:** Add an activity to an itinerary.

**Authentication:** Required.

**Authorization:** Trip owner.

### Request

```json
{
  "activityId": "activity-uuid",
  "title": "Louvre Museum",
  "date": "2026-06-11",
  "startTime": "10:00",
  "endTime": "13:00",
  "position": 0,
  "estimatedCost": 40,
  "currency": "EUR"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "item-uuid",
    "activityId": "activity-uuid",
    "date": "2026-06-11",
    "startTime": "10:00",
    "endTime": "13:00"
  }
}
```

**Validation:**

* Activity must exist if supplied.
* Date must belong to the section/trip.
* End time cannot precede start time.
* Cost cannot be negative.

---

## PUT /itinerary/items/:id

**Purpose:** Update an itinerary item.

**Authentication:** Required.

**Authorization:** Trip owner.

### Request

```json
{
  "date": "2026-06-12",
  "startTime": "11:00",
  "endTime": "14:00",
  "notes": "Arrive 15 minutes early."
}
```

---

## DELETE /itinerary/items/:id

**Purpose:** Remove an itinerary item.

**Authentication:** Required.

**Authorization:** Trip owner.

### Response

```json
{
  "success": true,
  "message": "Itinerary item deleted successfully."
}
```

---

## PATCH /itinerary/items/reorder

**Purpose:** Reorder itinerary activities.

**Authentication:** Required.

**Authorization:** Trip owner.

### Request

```json
{
  "sectionId": "section-uuid",
  "itemIds": [
    "item-2",
    "item-1",
    "item-3"
  ]
}
```

---

# Budget

## GET /trips/:tripId/budget

**Purpose:** Retrieve trip budget and expense summary.

**Authentication:** Required for private trips.

**Authorization:** Trip owner or authorized administrator.

### Response

```json
{
  "success": true,
  "data": {
    "plannedAmount": 2500,
    "currency": "USD",
    "totalEstimated": 2180,
    "remaining": 320,
    "averagePerDay": 218,
    "categories": {
      "transport": 500,
      "accommodation": 900,
      "activities": 380,
      "meals": 300,
      "miscellaneous": 100
    }
  }
}
```

---

## POST /trips/:tripId/budget

**Purpose:** Create or define a trip budget.

**Authentication:** Required.

**Authorization:** Trip owner.

### Request

```json
{
  "plannedAmount": 2500,
  "currency": "USD"
}
```

### Validation

* Amount cannot be negative.
* Currency must be valid.

---

## PUT /trips/:tripId/budget

**Purpose:** Update a trip budget.

**Authentication:** Required.

**Authorization:** Trip owner.

### Request

```json
{
  "plannedAmount": 3000,
  "currency": "USD"
}
```

---

# Expenses

## GET /trips/:tripId/expenses

**Purpose:** List trip expenses.

**Authentication:** Required for private trips.

**Authorization:** Trip owner or authorized administrator.

### Query Parameters

```text
?category=ACTIVITY
&isEstimated=true
&page=1
&pageSize=20
```

---

## POST /trips/:tripId/expenses

**Purpose:** Add an expense.

**Authentication:** Required.

**Authorization:** Trip owner.

### Request

```json
{
  "category": "ACTIVITY",
  "description": "Louvre Museum",
  "amount": 40,
  "currency": "EUR",
  "expenseDate": "2026-06-11",
  "isEstimated": true
}
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "expense-uuid",
    "amount": 40,
    "currency": "EUR",
    "category": "ACTIVITY"
  }
}
```

---

## PUT /expenses/:id

**Purpose:** Update an expense.

**Authentication:** Required.

**Authorization:** Owner of the associated trip.

### Request

```json
{
  "amount": 45,
  "description": "Updated museum estimate"
}
```

---

## DELETE /expenses/:id

**Purpose:** Delete an expense.

**Authentication:** Required.

**Authorization:** Owner of the associated trip.

---

# Calendar / Timeline

## GET /trips/:tripId/calendar

**Purpose:** Retrieve calendar events for a trip.

**Authentication:** Required for private trips.

**Authorization:** Trip owner or authorized public access.

### Query Parameters

```text
?startDate=2026-06-01
&endDate=2026-06-30
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "item-uuid",
      "title": "Louvre Museum",
      "date": "2026-06-11",
      "startTime": "10:00",
      "endTime": "13:00",
      "type": "ACTIVITY"
    }
  ]
}
```

---

## GET /trips/:tripId/timeline

**Purpose:** Retrieve chronological itinerary data.

**Authentication:** Required for private trips.

**Authorization:** Trip owner or permitted public viewer.

### Response

```json
{
  "success": true,
  "data": [
    {
      "date": "2026-06-11",
      "items": []
    }
  ]
}
```

---

# Community

## GET /community

**Purpose:** Browse published community content.

**Authentication:** Optional.

**Authorization:** Public published content.

### Query Parameters

```text
?search=paris
&sortBy=createdAt
&sortOrder=desc
&page=1
&pageSize=20
```

### Response

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

---

## GET /community/:id

**Purpose:** Retrieve a published community post.

**Authentication:** Optional.

**Authorization:** Public if published.

---

## POST /community

**Purpose:** Create a community post.

**Authentication:** Required.

**Authorization:** Authenticated user.

### Request

```json
{
  "title": "My Paris Experience",
  "content": "A summary of my trip.",
  "tripId": "trip-uuid"
}
```

### Response

**201 Created**

```json
{
  "success": true,
  "data": {
    "id": "post-uuid",
    "title": "My Paris Experience",
    "status": "DRAFT"
  }
}
```

---

## PUT /community/:id

**Purpose:** Update an owned community post.

**Authentication:** Required.

**Authorization:** Post owner.

---

## DELETE /community/:id

**Purpose:** Delete an owned community post.

**Authentication:** Required.

**Authorization:** Post owner or administrator.

---

# Public / Shared Trips

## POST /trips/:tripId/share

**Purpose:** Generate a public share link.

**Authentication:** Required.

**Authorization:** Trip owner.

### Response

```json
{
  "success": true,
  "data": {
    "publicToken": "secure-public-token",
    "url": "https://app.example.com/public/trips/secure-public-token"
  }
}
```

---

## DELETE /trips/:tripId/share

**Purpose:** Disable a public share link.

**Authentication:** Required.

**Authorization:** Trip owner.

---

## GET /public/trips/:publicToken

**Purpose:** View a published itinerary without exposing private information.

**Authentication:** Not required.

**Authorization:** Public if share is active.

### Response

```json
{
  "success": true,
  "data": {
    "trip": {
      "name": "European Summer Trip",
      "startDate": "2026-06-10",
      "endDate": "2026-06-20"
    },
    "stops": [],
    "itinerary": [],
    "budget": {}
  }
}
```

---

## POST /public/trips/:publicToken/copy

**Purpose:** Copy a public itinerary into the authenticated user's account.

**Authentication:** Required.

**Authorization:** Authenticated user + active public share.

### Response

```json
{
  "success": true,
  "data": {
    "tripId": "new-trip-uuid"
  },
  "message": "Trip copied successfully."
}
```

### Business Rules

* Copied trip becomes independently owned by the requesting user.
* Source user's private information must not be copied.
* Future edits to the source trip do not modify the copied trip.

---

# Saved Destinations

## GET /users/me/saved-destinations

**Purpose:** Retrieve saved destinations.

**Authentication:** Required.

**Authorization:** Own data.

---

## POST /users/me/saved-destinations

**Purpose:** Save a destination.

**Authentication:** Required.

**Authorization:** Own data.

### Request

```json
{
  "destinationId": "destination-uuid"
}
```

---

## DELETE /users/me/saved-destinations/:destinationId

**Purpose:** Remove a saved destination.

**Authentication:** Required.

**Authorization:** Own data.

---

# Notifications

## GET /notifications

**Purpose:** Retrieve the authenticated user's notifications.

**Authentication:** Required.

**Authorization:** Own notifications.

### Query Parameters

```text
?page=1
&pageSize=20
&isRead=false
```

---

## PATCH /notifications/:id/read

**Purpose:** Mark a notification as read.

**Authentication:** Required.

**Authorization:** Notification recipient.

### Response

```json
{
  "success": true,
  "message": "Notification marked as read."
}
```

---

## PATCH /notifications/read-all

**Purpose:** Mark all notifications as read.

**Authentication:** Required.

**Authorization:** Authenticated user.

---

# Media

## POST /media

**Purpose:** Upload an image/media file.

**Authentication:** Required.

**Authorization:** Authenticated user.

### Request

```http
Content-Type: multipart/form-data
```

```text
file=<binary>
visibility=private
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "media-uuid",
    "mimeType": "image/webp",
    "sizeBytes": 182340,
    "visibility": "private"
  }
}
```

---

## GET /media/:id

**Purpose:** Retrieve media metadata or authorized file access information.

**Authentication:** Required for private files.

**Authorization:** Owner or authorized viewer.

---

## DELETE /media/:id

**Purpose:** Delete media.

**Authentication:** Required.

**Authorization:** Media owner or authorized administrator.

---

# Admin

## GET /admin/dashboard

**Purpose:** Retrieve platform-level analytics.

**Authentication:** Required.

**Authorization:** Administrator.

### Response

```json
{
  "success": true,
  "data": {
    "users": {
      "total": 1200,
      "newThisMonth": 130
    },
    "trips": {
      "total": 3200,
      "newThisMonth": 420
    },
    "popularDestinations": [],
    "popularActivities": []
  }
}
```

---

## GET /admin/users

**Purpose:** List platform users.

**Authentication:** Required.

**Authorization:** Administrator.

### Query Parameters

```text
?search=john
&status=active
&role=USER
&page=1
&pageSize=20
```

---

## GET /admin/trips/stats

**Purpose:** Retrieve trip analytics.

**Authentication:** Required.

**Authorization:** Administrator.

---

## GET /admin/destinations/stats

**Purpose:** Retrieve destination usage analytics.

**Authentication:** Required.

**Authorization:** Administrator.

---

## GET /admin/activities/stats

**Purpose:** Retrieve activity usage analytics.

**Authentication:** Required.

**Authorization:** Administrator.

---

## GET /admin/engagement

**Purpose:** Retrieve platform engagement statistics.

**Authentication:** Required.

**Authorization:** Administrator.

---

# 13. Webhooks

GlobeTrotter may consume webhooks from external services in future integrations.

Potential sources include:

* Email providers.
* Payment providers if booking/payment functionality is added.
* Travel providers.
* Media processing services.
* Notification providers.

## Webhook Rules

* Every webhook endpoint must verify authenticity.
* Webhook signatures must be validated.
* Duplicate events must be safely handled.
* Event IDs should be stored where idempotency is required.
* Processing should be asynchronous where appropriate.
* Webhook endpoints should not expose internal implementation details.

Example:

```text
POST /api/v1/webhooks/{provider}
```

---

# 14. External APIs

External API integrations should be isolated behind backend services.

## Potential Integrations

### Maps / Geolocation

Possible capabilities:

* Geocoding.
* Reverse geocoding.
* Distance.
* Routing.
* Maps.

### Weather

Possible capabilities:

* Destination weather.
* Trip weather.
* Weather alerts.

### Travel Data

Future possibilities:

* Flights.
* Hotels.
* Activities.
* Transportation.

### Email

Possible capabilities:

* Password reset.
* Verification.
* Trip reminders.
* Notifications.

## Integration Rule

The frontend must not directly expose secret API credentials for external services.

External API calls should normally pass through the backend when credentials or business logic are involved.

---

# 15. Rate Limiting

Rate limiting must protect API resources from abuse.

## Recommended Categories

### Authentication

Strict rate limits for:

```text
/auth/login
/auth/register
/auth/forgot-password
/auth/reset-password
```

### Search

Moderate limits for:

```text
/destinations
/activities
/community
```

### Public APIs

Rate limits should be applied to public itinerary endpoints.

### Admin

Administrators should still be subject to reasonable limits.

## Rate Limit Response

**429 Too Many Requests**

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later."
  }
}
```

Where possible, responses should include:

```http
Retry-After: 60
```

---

# 16. API Security

## Transport Security

Production API traffic must use HTTPS.

## Authentication

Protected endpoints require valid authentication.

## Authorization

Every protected resource must verify ownership or role-based permissions.

## Input Validation

All external input must be validated on the backend.

Frontend validation is supplementary and must not replace backend validation.

## CORS

CORS must allow only approved application origins.

## Security Headers

The backend should configure appropriate security headers.

## Rate Limiting

Authentication and abuse-prone endpoints must be rate limited.

## Sensitive Data

The API must never expose:

* Password hashes.
* Authentication secrets.
* Database credentials.
* Internal infrastructure details.
* Unnecessary private user data.

## File Security

File uploads must be validated and restricted.

## Injection Protection

Database access must use:

* Parameterized queries.
* Safe ORM/query-builder methods.

Client input must never be concatenated into raw SQL queries.

## Auditability

Sensitive operations should generate audit records where appropriate.

---

# 17. API Versioning

The API will use URL-based versioning.

Current version:

```text
/api/v1
```

Example:

```text
GET /api/v1/trips
```

## Versioning Rules

* Breaking changes require a new API version.
* Non-breaking additions may remain within the current version.
* Deprecated endpoints must be documented.
* Old versions should have a defined support period.
* API version changes should not silently change existing response contracts.

## Future Version

Example:

```text
/api/v2/trips
```

A new version should only be introduced when compatibility cannot reasonably be preserved.

---

# API Development Standards

All new endpoints must follow these standards:

1. Use RESTful resource naming.
2. Use plural resource names where appropriate.
3. Use HTTP methods according to operation semantics.
4. Return standard HTTP status codes.
5. Use the common response format.
6. Validate every request.
7. Enforce authentication where required.
8. Enforce authorization at the resource level.
9. Support pagination for large collections.
10. Support filtering and sorting where applicable.
11. Never expose sensitive internal information.
12. Document all new endpoints in `API.md`.
13. Write tests for successful and failure scenarios.
14. Maintain backward compatibility within the same API version.

---

# API Naming Convention

Recommended endpoint naming:

```text
/api/v1/auth/*
/api/v1/users/*
/api/v1/trips/*
/api/v1/destinations/*
/api/v1/activities/*
/api/v1/itinerary/*
/api/v1/budgets/*
/api/v1/expenses/*
/api/v1/community/*
/api/v1/public/*
/api/v1/notifications/*
/api/v1/media/*
/api/v1/admin/*
```

Use nouns rather than actions wherever practical.

Prefer:

```text
POST /trips
```

over:

```text
POST /createTrip
```

For operations that represent a meaningful state transition, action-like subpaths are acceptable:

```text
POST /trips/:id/share
POST /public/trips/:token/copy
PATCH /notifications/:id/read
```

---

# API Definition of Done

An endpoint is considered complete when:

* [ ] Purpose is documented.
* [ ] HTTP method and path are defined.
* [ ] Authentication requirement is defined.
* [ ] Authorization requirement is defined.
* [ ] Request format is documented.
* [ ] Response format is documented.
* [ ] Errors are documented.
* [ ] Validation rules are documented.
* [ ] Permission checks are implemented.
* [ ] Business rules are implemented.
* [ ] Database operations are implemented.
* [ ] Automated tests are written.
* [ ] API documentation is updated.
* [ ] Frontend integration is verified where applicable.
