
# Routes

# 1. Route Overview

The GlobeTrotter routing system defines the technical URL structure of the application.

Routes are separated into:

* Public routes.
* Authentication routes.
* Authenticated application routes.
* Trip-specific routes.
* Discovery routes.
* Community routes.
* Settings routes.
* Administrative routes.
* Dynamic routes.
* Error routes.

The route structure must remain consistent with:

* `Navigation.md`
* `UI.md`
* `API.md`
* `Architecture.md`

## Route Structure

The application uses the following high-level structure:

```text
/
├── Public
├── Authentication
├── App
│   ├── Dashboard
│   ├── Trips
│   ├── Discover
│   ├── Community
│   ├── Calendar
│   ├── Saved
│   └── Settings
├── Public Trip
├── Admin
└── Error
```

---

# 2. Routing Principles

## Principle 1 — Clear URL Structure

Routes should describe the resource being displayed.

Prefer:

```text
/app/trips/:id
```

over:

```text
/app/showTrip/:id
```

## Principle 2 — Consistent Prefixes

Authenticated application routes should use:

```text
/app
```

Administrative routes should use:

```text
/admin
```

Public shared content should use:

```text
/public
```

## Principle 3 — Resource-Based Routing

Use nouns for primary resources:

```text
/trips
/destinations
/activities
/community
```

## Principle 4 — Dynamic Resources

Use route parameters for resource identifiers.

Example:

```text
/app/trips/:tripId
```

## Principle 5 — Route Protection

Protected routes must require authentication at the application/router level and authorization at the backend level.

## Principle 6 — Role Protection

Administrative routes must require an administrator role.

## Principle 7 — Deep Linking

Direct access to valid routes should work when the user is authorized.

## Principle 8 — Error Handling

Invalid, unavailable, and unauthorized routes must resolve to appropriate error states.

## Principle 9 — Backward Compatibility

Existing routes should not be changed without updating:

* Navigation.
* UI links.
* API references.
* Documentation.

---

# 3. Public Routes

Public routes are accessible without authentication.

| Route                                     | Purpose                        |
| ----------------------------------------- | ------------------------------ |
| `/`                                     | GlobeTrotter landing/home page |
| `/discover`                             | Public discovery entry point   |
| `/discover/destinations`                | Public destination discovery   |
| `/discover/destinations/:destinationId` | Destination details            |
| `/discover/activities`                  | Public activity discovery      |
| `/discover/activities/:activityId`      | Activity details               |
| `/community`                            | Public community               |
| `/community/:postId`                    | Public community post          |
| `/public/trips/:publicToken`            | Public shared itinerary        |
| `/404`                                  | Not found                      |
| `/403`                                  | Access denied                  |
| `/500`                                  | Server/application error       |

## `/`

**Purpose:** Product landing page.

**Access:** Public.

---

## `/discover`

**Purpose:** Public discovery landing page.

**Access:** Public.

---

## `/discover/destinations`

**Purpose:** Browse and search destinations.

**Access:** Public.

---

## `/discover/destinations/:destinationId`

**Purpose:** View a destination.

**Access:** Public.

**Dynamic Parameter:**

```text
destinationId
```

---

## `/discover/activities`

**Purpose:** Browse activities.

**Access:** Public.

---

## `/discover/activities/:activityId`

**Purpose:** View activity details.

**Access:** Public.

**Dynamic Parameter:**

```text
activityId
```

---

## `/community`

**Purpose:** Browse public community content.

**Access:** Public.

---

## `/community/:postId`

**Purpose:** View a public community post.

**Access:** Public when the post is published.

---

## `/public/trips/:publicToken`

**Purpose:** View a publicly shared itinerary.

**Access:** Public when the share token is active.

---

# 4. Authentication Routes

Authentication routes handle account access.

| Route                | Purpose                | Access        |
| -------------------- | ---------------------- | ------------- |
| `/login`           | Login                  | Public        |
| `/register`        | Register               | Public        |
| `/forgot-password` | Request password reset | Public        |
| `/reset-password`  | Reset password         | Public        |
| `/logout`          | Logout action          | Authenticated |

---

## `/login`

**Purpose:** User authentication.

**Access:** Public.

Successful authentication normally redirects to:

```text
/app/dashboard
```

---

## `/register`

**Purpose:** Create a GlobeTrotter account.

**Access:** Public.

Successful registration should redirect according to the configured onboarding flow.

---

## `/forgot-password`

**Purpose:** Request a password reset.

**Access:** Public.

---

## `/reset-password`

**Purpose:** Set a new password using a valid reset token.

Example:

```text
/reset-password?token=<reset-token>
```

---

## `/logout`

**Purpose:** End the authenticated session.

**Access:** Authenticated.

After logout:

```text
/app/*
    ↓
/login
```

---

# 5. Application Routes

Authenticated application routes use the `/app` prefix.

```text
/app
```

## Application Route Tree

```text
app
├── dashboard
├── trips
│   ├── upcoming
│   ├── ongoing
│   ├── completed
│   ├── new
│   └── :tripId
│       ├── overview
│       ├── itinerary
│       ├── budget
│       ├── calendar
│       ├── share
│       └── edit
│
├── discover
│   ├── destinations
│   ├── destinations/:destinationId
│   ├── activities
│   └── activities/:activityId
│
├── community
│   ├── explore
│   ├── shared-trips
│   └── mine
│
├── calendar
├── saved
│   └── destinations
│
└── settings
    ├── profile
    ├── preferences
    ├── security
    └── account
```

---

# 5.1 Dashboard

## `/app`

**Purpose:** Authenticated application entry point.

The route should redirect to:

```text
/app/dashboard
```

---

## `/app/dashboard`

**Purpose:** Main user dashboard.

**Access:** Authenticated.

---

# 5.2 Trips

## `/app/trips`

**Purpose:** List all user-owned trips.

**Access:** Authenticated.

---

## `/app/trips/upcoming`

**Purpose:** Show upcoming trips.

**Access:** Authenticated.

---

## `/app/trips/ongoing`

**Purpose:** Show currently active trips.

**Access:** Authenticated.

---

## `/app/trips/completed`

**Purpose:** Show completed trips.

**Access:** Authenticated.

---

## `/app/trips/new`

**Purpose:** Create a new trip.

**Access:** Authenticated.

---

## `/app/trips/:tripId`

**Purpose:** Trip detail/overview.

**Access:** Authenticated + resource authorization.

**Dynamic Parameter:**

```text
tripId
```

---

## `/app/trips/:tripId/overview`

**Purpose:** Trip overview page.

**Access:** Trip owner or authorized administrator.

---

## `/app/trips/:tripId/edit`

**Purpose:** Edit trip information.

**Access:** Trip owner or authorized administrator.

---

## `/app/trips/:tripId/itinerary`

**Purpose:** Build and manage itinerary.

**Access:** Trip owner or authorized administrator.

---

## `/app/trips/:tripId/budget`

**Purpose:** Manage budget and expenses.

**Access:** Trip owner or authorized administrator.

---

## `/app/trips/:tripId/calendar`

**Purpose:** View trip calendar and timeline.

**Access:** Trip owner or authorized administrator.

---

## `/app/trips/:tripId/share`

**Purpose:** Manage public sharing.

**Access:** Trip owner or authorized administrator.

---

# 5.3 Discover

## `/app/discover`

**Purpose:** Authenticated discovery landing page.

**Access:** Authenticated.

---

## `/app/discover/destinations`

**Purpose:** Search and discover destinations.

**Access:** Authenticated.

---

## `/app/discover/destinations/:destinationId`

**Purpose:** View destination details.

**Access:** Authenticated.

---

## `/app/discover/activities`

**Purpose:** Search and discover activities.

**Access:** Authenticated.

---

## `/app/discover/activities/:activityId`

**Purpose:** View activity details.

**Access:** Authenticated.

---

# 5.4 Community

## `/app/community`

**Purpose:** Community discovery.

**Access:** Authenticated.

---

## `/app/community/explore`

**Purpose:** Browse public community content.

**Access:** Authenticated.

---

## `/app/community/shared-trips`

**Purpose:** Browse shared trip itineraries.

**Access:** Authenticated.

---

## `/app/community/mine`

**Purpose:** Manage the authenticated user's community content.

**Access:** Authenticated.

---

## `/app/community/:postId`

**Purpose:** View a community post inside the authenticated application.

**Access:** Authenticated + content visibility rules.

---

# 5.5 Calendar

## `/app/calendar`

**Purpose:** Global calendar showing the user's relevant trips and itinerary events.

**Access:** Authenticated.

---

# 5.6 Saved Destinations

## `/app/saved`

**Purpose:** Saved-content entry point.

**Access:** Authenticated.

---

## `/app/saved/destinations`

**Purpose:** View saved destinations.

**Access:** Authenticated.

---

# 5.7 Settings

## `/app/settings`

**Purpose:** Settings overview.

**Access:** Authenticated.

---

## `/app/settings/profile`

**Purpose:** Manage profile information.

**Access:** Authenticated.

---

## `/app/settings/preferences`

**Purpose:** Manage travel preferences.

**Access:** Authenticated.

---

## `/app/settings/security`

**Purpose:** Manage password and account security.

**Access:** Authenticated.

---

## `/app/settings/account`

**Purpose:** Manage account-level settings, including account deletion.

**Access:** Authenticated.

---

# 6. Admin Routes

Administrative routes use the `/admin` prefix.

```text
admin
├── dashboard
├── users
│   ├── :userId
│   └── :userId/edit
├── trips
│   ├── :tripId
│   └── :tripId/edit
├── destinations
│   ├── new
│   ├── :destinationId
│   └── :destinationId/edit
├── activities
│   ├── new
│   ├── :activityId
│   └── :activityId/edit
└── analytics
```

---

## `/admin`

**Purpose:** Administrative application entry point.

Should redirect to:

```text
/admin/dashboard
```

---

## `/admin/dashboard`

**Purpose:** Platform overview and analytics.

**Access:** Administrator only.

---

## `/admin/users`

**Purpose:** Manage platform users.

**Access:** Administrator only.

---

## `/admin/users/:userId`

**Purpose:** View user details.

**Access:** Administrator only.

---

## `/admin/users/:userId/edit`

**Purpose:** Edit permitted user information.

**Access:** Administrator only.

---

## `/admin/trips`

**Purpose:** View and manage platform trips.

**Access:** Administrator only.

---

## `/admin/trips/:tripId`

**Purpose:** View a platform trip.

**Access:** Administrator only.

---

## `/admin/trips/:tripId/edit`

**Purpose:** Perform permitted administrative trip management.

**Access:** Administrator only.

---

## `/admin/destinations`

**Purpose:** Manage destination master data.

**Access:** Administrator only.

---

## `/admin/destinations/new`

**Purpose:** Create a destination.

**Access:** Administrator only.

---

## `/admin/destinations/:destinationId`

**Purpose:** View destination information.

**Access:** Administrator only.

---

## `/admin/destinations/:destinationId/edit`

**Purpose:** Edit destination data.

**Access:** Administrator only.

---

## `/admin/activities`

**Purpose:** Manage activity master data.

**Access:** Administrator only.

---

## `/admin/activities/new`

**Purpose:** Create an activity.

**Access:** Administrator only.

---

## `/admin/activities/:activityId`

**Purpose:** View activity information.

**Access:** Administrator only.

---

## `/admin/activities/:activityId/edit`

**Purpose:** Edit activity information.

**Access:** Administrator only.

---

## `/admin/analytics`

**Purpose:** View platform usage analytics.

**Access:** Administrator only.

---

# 7. Dynamic Routes

Dynamic routes use named parameters.

## Trip

```text
/app/trips/:tripId
```

Example:

```text
/app/trips/8f4a0d7c
```

## Destination

```text
/app/discover/destinations/:destinationId
```

## Activity

```text
/app/discover/activities/:activityId
```

## Community Post

```text
/app/community/:postId
```

## Public Trip

```text
/public/trips/:publicToken
```

## Admin User

```text
/admin/users/:userId
```

## Dynamic Route Rules

* Parameter values must be validated.
* Invalid identifiers must return Not Found.
* Resource access must be authorized.
* Routes must not expose sensitive database implementation details.

---

# 8. Protected Routes

Protected routes require authentication.

## Protected Route Groups

```text
/app/*
/admin/*
```

## Authentication Flow

```text
User requests protected route
          ↓
Authentication check
          ↓
Authenticated?
      ┌───┴───┐
     No      Yes
     │         │
     ▼         ▼
 /login   Authorization
             │
        ┌────┴────┐
      Allowed   Denied
        │          │
        ▼          ▼
      Page       /403
```

## Redirect Behavior

When a user attempts to open a protected route while unauthenticated:

```text
/app/trips/123
      ↓
/login?returnUrl=/app/trips/123
```

After successful authentication, the application may return the user to the original route.

## Resource Protection

Authentication alone does not provide access to another user's private trip.

Example:

```text
Authenticated User
      ↓
/app/trips/:tripId
      ↓
Check Trip Ownership
      ↓
Allowed / Forbidden
```

---

# 9. Role-Based Routes

## User

Regular authenticated users can access:

```text
/app/*
```

subject to resource ownership and visibility rules.

## Administrator

Administrators can access:

```text
/app/*
/admin/*
```

## Role Guard

```text
/admin/*
    ↓
Authenticated?
    ↓
Admin role?
    ↓
Yes → Continue
No  → /403
```

## Navigation and Routing

Role restrictions must exist at both levels:

### Frontend

* Hide unauthorized navigation.
* Prevent unnecessary access attempts.

### Backend

* Enforce actual authorization.
* Never trust frontend route protection alone.

---

# 10. Error Routes

# `/404`

**Purpose:** Requested route or resource does not exist.

Typical causes:

* Invalid route.
* Invalid resource ID.
* Deleted resource.
* Unknown public share token.

---

# `/403`

**Purpose:** User is authenticated but does not have permission.

Examples:

* Accessing another user's private trip.
* Accessing admin routes as a normal user.
* Editing content not owned by the current user.

---

# `/500`

**Purpose:** Unexpected application/server failure.

The error screen should:

* Explain that an unexpected error occurred.
* Avoid exposing technical details.
* Provide a retry action.
* Provide navigation back to a safe page.

---

# 11. Route Redirects

## Root Redirect

```text
/
    ↓
Public Home
```

## Authenticated Application Root

```text
/app
    ↓
/app/dashboard
```

## Admin Root

```text
/admin
    ↓
/admin/dashboard
```

## Login Redirect

Authenticated user accessing:

```text
/login
/register
```

may be redirected to:

```text
/app/dashboard
```

## Logout

```text
/logout
    ↓
/login
```

---

# 12. Query Parameters

Query parameters should be used for filters, search, sorting, pagination, and temporary UI state.

## Search

```text
/app/discover/destinations?search=Paris
```

## Filtering

```text
/app/trips?status=upcoming
```

## Sorting

```text
/app/trips?sortBy=startDate&sortOrder=asc
```

## Pagination

```text
/app/trips?page=2&pageSize=20
```

## Combined

```text
/app/discover/activities
  ?destinationId=123
  &categoryId=456
  &sortBy=popularity
  &sortOrder=desc
  &page=1
&pageSize=20
```

Query parameters must not be used to bypass resource-level authorization.

---

# 13. Route Naming Conventions

Routes should follow these rules:

### Use lowercase

```text
/app/trips
```

not:

```text
/app/Trips
```

### Use plural resource names

```text
/trips
/destinations
/activities
```

### Use hyphens for multi-word static segments

Example:

```text
/public-trips
```

where such a static route is required.

### Use parameters for individual resources

```text
/trips/:tripId
```

### Avoid action-heavy paths

Prefer:

```text
/trips/new
```

over:

```text
/create-new-trip
```

For resource state transitions, explicit action routes may be used only when appropriate.

---

# 14. Complete Route Tree

```text
/
│
├── login
├── register
├── forgot-password
├── reset-password
│
├── discover
│   ├── destinations
│   │   └── :destinationId
│   └── activities
│       └── :activityId
│
├── community
│   └── :postId
│
├── public
│   └── trips
│       └── :publicToken
│
├── app
│   ├── dashboard
│   │
│   ├── trips
│   │   ├── upcoming
│   │   ├── ongoing
│   │   ├── completed
│   │   ├── new
│   │   └── :tripId
│   │       ├── overview
│   │       ├── edit
│   │       ├── itinerary
│   │       ├── budget
│   │       ├── calendar
│   │       └── share
│   │
│   ├── discover
│   │   ├── destinations
│   │   │   └── :destinationId
│   │   └── activities
│   │       └── :activityId
│   │
│   ├── community
│   │   ├── explore
│   │   ├── shared-trips
│   │   ├── mine
│   │   └── :postId
│   │
│   ├── calendar
│   │
│   ├── saved
│   │   └── destinations
│   │
│   └── settings
│       ├── profile
│       ├── preferences
│       ├── security
│       └── account
│
├── admin
│   ├── dashboard
│   ├── users
│   │   ├── :userId
│   │   └── :userId/edit
│   ├── trips
│   │   ├── :tripId
│   │   └── :tripId/edit
│   ├── destinations
│   │   ├── new
│   │   ├── :destinationId
│   │   └── :destinationId/edit
│   ├── activities
│   │   ├── new
│   │   ├── :activityId
│   │   └── :activityId/edit
│   └── analytics
│
├── 403
├── 404
└── 500
```

---

# 15. Route-to-Navigation Mapping

| Route                                     | Navigation         | Access      |
| ----------------------------------------- | ------------------ | ----------- |
| `/`                                     | Home               | Public      |
| `/login`                                | Login              | Public      |
| `/register`                             | Register           | Public      |
| `/discover`                             | Discover           | Public      |
| `/discover/destinations`                | Destinations       | Public      |
| `/discover/destinations/:destinationId` | Destination Detail | Public      |
| `/discover/activities`                  | Activities         | Public      |
| `/discover/activities/:activityId`      | Activity Detail    | Public      |
| `/community`                            | Community          | Public      |
| `/community/:postId`                    | Community Detail   | Public      |
| `/public/trips/:publicToken`            | Public Trip        | Public      |
| `/app/dashboard`                        | Dashboard          | User        |
| `/app/trips`                            | My Trips           | User        |
| `/app/trips/upcoming`                   | Upcoming           | User        |
| `/app/trips/ongoing`                    | Ongoing            | User        |
| `/app/trips/completed`                  | Completed          | User        |
| `/app/trips/new`                        | Create Trip        | User        |
| `/app/trips/:tripId`                    | Trip Overview      | Owner/Admin |
| `/app/trips/:tripId/itinerary`          | Itinerary          | Owner/Admin |
| `/app/trips/:tripId/budget`             | Budget             | Owner/Admin |
| `/app/trips/:tripId/calendar`           | Calendar           | Owner/Admin |
| `/app/trips/:tripId/share`              | Share              | Owner/Admin |
| `/app/discover/destinations`            | Discover           | User        |
| `/app/discover/activities`              | Discover           | User        |
| `/app/community`                        | Community          | User        |
| `/app/calendar`                         | Calendar           | User        |
| `/app/saved/destinations`               | Saved Destinations | User        |
| `/app/settings/profile`                 | Profile            | User        |
| `/app/settings/preferences`             | Preferences        | User        |
| `/app/settings/security`                | Security           | User        |
| `/app/settings/account`                 | Account            | User        |
| `/admin/dashboard`                      | Admin Dashboard    | Admin       |
| `/admin/users`                          | Users              | Admin       |
| `/admin/trips`                          | Trips              | Admin       |
| `/admin/destinations`                   | Destinations       | Admin       |
| `/admin/activities`                     | Activities         | Admin       |
| `/admin/analytics`                      | Analytics          | Admin       |
| `/403`                                  | Access Denied      | All         |
| `/404`                                  | Not Found          | All         |
| `/500`                                  | Server Error       | All         |

---

# 16. Route Definition of Done

A route is considered complete when:

* [ ] Route path is defined.
* [ ] Route purpose is documented.
* [ ] Access level is defined.
* [ ] Authentication requirement is defined.
* [ ] Authorization requirement is defined.
* [ ] Dynamic parameters are documented.
* [ ] Query parameters are documented where applicable.
* [ ] Loading state exists.
* [ ] Error state exists.
* [ ] Not-found state exists where applicable.
* [ ] Navigation link exists where required.
* [ ] Backend API integration is defined.
* [ ] Route works with direct navigation/deep linking.
* [ ] Mobile navigation behavior is supported where applicable.
* [ ] Route is consistent with `Navigation.md`.
* [ ] Route is consistent with `UI.md`.
