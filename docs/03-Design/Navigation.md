
# Navigation

# 1. Navigation Overview

GlobeTrotter uses a layered navigation structure that separates:

* Public navigation.
* Authentication navigation.
* Authenticated user navigation.
* Trip-specific navigation.
* Secondary navigation.
* Role-based administrative navigation.
* Mobile navigation.

The navigation system is designed to keep the primary travel-planning workflow easily accessible while preventing less frequently used features from overwhelming the main interface.

## Primary User Navigation

```text
Dashboard
My Trips
Discover
Community
Calendar
Saved Destinations
Settings
```

The navigation should adapt based on the user's authentication state and role.

---

# 2. Navigation Principles

## Clarity

Navigation labels should clearly communicate the destination.

Prefer:

```text
My Trips
```

over:

```text
Management
```

## Consistency

Navigation placement and behavior should remain consistent throughout the application.

## Hierarchy

Primary navigation should contain high-frequency destinations.

Secondary navigation should contain contextual or less frequently used destinations.

## Minimalism

Avoid exposing every feature in the primary navigation.

## Context

When users enter a specific trip, contextual navigation should provide quick access to:

* Overview.
* Itinerary.
* Budget.
* Calendar.
* Share.

## Role Awareness

Navigation should only display options that the current user is permitted to access.

## Responsive Design

Desktop and mobile navigation may use different presentation patterns while maintaining the same information hierarchy.

---

# 3. Public Navigation

Public navigation is available to unauthenticated visitors.

```text
Home
├── Features
├── How It Works
└── Public Trips / Explore

Discover
└── Destinations

Community
└── Public Experiences

Authentication
├── Login
└── Register
```

## Public Header

Recommended navigation:

```text
GlobeTrotter
Home
Explore
Community
Login
[Get Started]
```

## Public Restrictions

Unauthenticated visitors cannot access:

* Dashboard.
* Private trips.
* Private itinerary data.
* Personal budget.
* Profile/settings.
* Private calendar.

They may access explicitly public content.

---

# 4. Authenticated Navigation

Once authenticated, the user enters the application navigation structure.

```text
GlobeTrotter
│
├── Dashboard
├── My Trips
├── Discover
├── Community
├── Calendar
├── Saved Destinations
└── Settings
```

The authenticated navigation should replace or simplify the public marketing navigation.

---

# 5. Main Navigation

## Dashboard

### Purpose

Main entry point for authenticated users.

```text
Dashboard
├── Overview
├── Upcoming Trips
├── Recent Trips
├── Recommendations
└── Budget Highlights
```

The dashboard itself should generally remain a single primary navigation destination rather than exposing all sections as top-level routes.

---

## My Trips

### Purpose

Central location for managing user-owned trips.

```text
My Trips
├── All Trips
├── Upcoming
├── Ongoing
├── Completed
└── [Trip]
    ├── Overview
    ├── Itinerary
    ├── Budget
    ├── Calendar
    └── Share
```

## All Trips

Displays the complete collection of user-created trips.

## Upcoming

Shows trips whose start date is in the future.

## Ongoing

Shows trips currently in progress.

## Completed

Shows trips whose travel period has ended.

---

# 5.1 Trip Context Navigation

When a user opens an individual trip, the interface should provide contextual navigation.

```text
Trip: European Summer Trip
├── Overview
├── Itinerary
├── Budget
├── Calendar
└── Share
```

### Overview

Provides:

* Trip summary.
* Destinations.
* Dates.
* Quick statistics.

### Itinerary

Provides:

* Itinerary builder.
* Itinerary view.
* Activities.
* Daily planning.

### Budget

Provides:

* Planned budget.
* Expenses.
* Cost breakdown.

### Calendar

Provides:

* Calendar view.
* Timeline.
* Daily itinerary.

### Share

Provides:

* Public/private status.
* Public link.
* Sharing controls.

---

# 5.2 Discover

### Purpose

Provides travel destination and activity discovery.

```text
Discover
├── Destinations
│   ├── All Destinations
│   ├── Popular
│   └── Saved
│
└── Activities
    ├── All Activities
    ├── Popular
    └── Categories
```

## Destinations

Users can search and filter cities and destinations.

## Activities

Users can discover activities associated with destinations.

## Saved

Displays destinations saved by the current user.

---

# 5.3 Community

### Purpose

Allows users to discover shared travel plans and travel experiences.

```text
Community
├── Explore
├── Shared Trips
└── My Shared Content
```

### Explore

Displays public community content.

### Shared Trips

Displays public trip itineraries.

### My Shared Content

Displays the authenticated user's published content.

---

# 5.4 Calendar

### Purpose

Provides a combined calendar access point for the user's trips.

```text
Calendar
├── All Trips
├── Upcoming
└── Selected Trip
```

The global calendar should allow the user to see relevant trip dates while individual trip calendars provide more detailed itinerary information.

---

# 5.5 Saved Destinations

### Purpose

Provides quick access to destinations saved for future planning.

```text
Saved Destinations
├── All Saved
└── Destination Detail
```

Users can:

* View saved destinations.
* Remove destinations.
* Add a destination to a trip.

---

# 5.6 Settings

### Purpose

Central location for user account and application preferences.

```text
Settings
├── Profile
├── Preferences
├── Security
└── Account
```

### Profile

* Name.
* Bio.
* Profile image.

### Preferences

* Language.
* Currency.
* Budget preference.
* Travel style.

### Security

* Password.
* Authentication settings.

### Account

* Account information.
* Delete account.
* Logout.

---

# 6. Secondary Navigation

Secondary navigation should be used for contextual or less frequently accessed actions.

## User Menu

The user avatar/menu can contain:

```text
Profile
Settings
Saved Destinations
Help
Logout
```

## Trip Actions

The trip header may contain:

```text
Edit Trip
Share
More
```

The More menu may include:

```text
Duplicate
Archive / Delete
```

## Contextual Tabs

Within a module, tabs may be used instead of expanding the global sidebar.

Example:

```text
Trip
Overview | Itinerary | Budget | Calendar | Share
```

## Search Navigation

Search should provide contextual navigation without becoming a separate primary module when the current feature already provides relevant search.

---

# 7. Breadcrumb Navigation

Breadcrumbs should be used for deeper hierarchical pages.

## Example

```text
My Trips
└── European Summer Trip
    └── Itinerary
```

Displayed as:

```text
My Trips / European Summer Trip / Itinerary
```

## Destination Example

```text
Discover / Destinations / Paris
```

## Community Example

```text
Community / Shared Trips / European Summer Trip
```

## Rules

* The current page should be the final breadcrumb.
* Parent breadcrumbs should be clickable.
* Do not use breadcrumbs for simple top-level pages.
* Mobile may collapse long breadcrumb paths.

---

# 8. Role-Based Navigation

GlobeTrotter initially defines two primary application roles:

* User.
* Administrator.

---

# 8.1 User Navigation

Standard users see:

```text
Dashboard
My Trips
Discover
Community
Calendar
Saved Destinations
Settings
```

They must not see administrative navigation.

---

# 8.2 Administrator Navigation

Administrators receive the standard user navigation plus an Admin area.

```text
Dashboard
My Trips
Discover
Community
Calendar
Saved Destinations
Settings

Admin
├── Dashboard
├── Users
├── Trips
├── Destinations
├── Activities
└── Analytics
```

## Admin Dashboard

Provides:

* Platform statistics.
* User statistics.
* Trip statistics.
* Engagement.

## Admin Users

Provides:

* User list.
* Search.
* Filtering.
* User management.

## Admin Trips

Provides:

* Platform trips.
* Trip statistics.
* Management actions.

## Admin Destinations

Provides:

* Destination management.
* Destination statistics.

## Admin Activities

Provides:

* Activity management.
* Category management.

## Admin Analytics

Provides:

* User growth.
* Trip growth.
* Popular destinations.
* Popular activities.
* Engagement trends.

---

# 8.3 Unauthorized Navigation

If a user directly accesses an administrative URL without permission:

```text
Requested Admin Page
        ↓
Authorization Check
        ↓
Not Authorized
        ↓
403 / Access Denied
```

The UI should not expose administrative data through hidden client-side assumptions.

Authorization must be enforced by the backend.

---

# 9. Mobile Navigation

Mobile navigation should prioritize the highest-frequency actions.

## Recommended Bottom Navigation

```text
┌───────────────────────────────────────────────┐
│ Home │ Trips │ Discover │ Calendar │ Profile │
└───────────────────────────────────────────────┘
```

## Home

Opens Dashboard.

## Trips

Opens My Trips.

## Discover

Opens Destination and Activity discovery.

## Calendar

Opens the user's travel calendar.

## Profile

Opens profile/settings.

## Community

Community can be accessed through Discover or a secondary navigation item depending on final usage patterns.

---

# 9.1 Mobile Secondary Navigation

A menu/drawer should contain lower-frequency destinations:

```text
Community
Saved Destinations
Settings
Help
Logout
```

For administrators:

```text
Admin Dashboard
Users
Trips
Analytics
```

---

# 9.2 Mobile Trip Navigation

When inside a trip, use a horizontal tab/navigation pattern:

```text
Overview
Itinerary
Budget
Calendar
Share
```

If the screen width is insufficient, use horizontally scrollable tabs.

---

# 10. Navigation Rules

## Rule 1 — Authentication

Unauthenticated users can access only public routes.

## Rule 2 — Protected Resources

Authenticated routes require a valid authentication state.

## Rule 3 — Ownership

Private trip navigation must verify that the authenticated user owns the trip or has explicit permission.

## Rule 4 — Public Trips

Public itineraries may be accessed through their public share path.

## Rule 5 — Admin

Admin navigation is displayed only to users with administrator permissions.

## Rule 6 — Deep Links

Direct navigation to a page should work when the user is authorized.

## Rule 7 — Invalid Resources

If a resource does not exist, display a Not Found state instead of an empty page.

## Rule 8 — Unauthorized Resources

If the user is authenticated but lacks permission, display an appropriate access-denied state.

## Rule 9 — Redirects

Typical authentication redirects:

```text
Not Authenticated
       ↓
Login
       ↓
Dashboard
```

Authenticated users attempting to access Login/Register should normally be redirected to Dashboard.

## Rule 10 — Unsaved Changes

When navigating away from an editor with unsaved changes, provide a confirmation when appropriate.

## Rule 11 — Active State

The current navigation item must be visually distinguishable.

## Rule 12 — Browser History

Back and forward navigation should behave predictably.

---

# 11. Navigation Hierarchy

## Complete Application Hierarchy

```text
GlobeTrotter
│
├── Public
│   ├── Home
│   ├── Explore
│   │   ├── Destinations
│   │   └── Activities
│   ├── Community
│   ├── Public Trips
│   ├── Login
│   └── Register
│
└── Authenticated
    │
    ├── Dashboard
    │
    ├── My Trips
    │   ├── All Trips
    │   ├── Upcoming
    │   ├── Ongoing
    │   ├── Completed
    │   │
    │   └── Trip
    │       ├── Overview
    │       ├── Itinerary
    │       ├── Budget
    │       ├── Calendar
    │       └── Share
    │
    ├── Discover
    │   ├── Destinations
    │   │   ├── All
    │   │   ├── Popular
    │   │   ├── Saved
    │   │   └── Destination Detail
    │   │
    │   └── Activities
    │       ├── All
    │       ├── Popular
    │       ├── Categories
    │       └── Activity Detail
    │
    ├── Community
    │   ├── Explore
    │   ├── Shared Trips
    │   ├── Public Trip
    │   └── My Shared Content
    │
    ├── Calendar
    │   ├── All Trips
    │   ├── Upcoming
    │   └── Trip Calendar
    │
    ├── Saved Destinations
    │
    ├── Settings
    │   ├── Profile
    │   ├── Preferences
    │   ├── Security
    │   └── Account
    │
    └── Admin
        ├── Dashboard
        ├── Users
        ├── Trips
        ├── Destinations
        ├── Activities
        └── Analytics
```

---

# 12. Route-to-Navigation Mapping

| Navigation Item    | Route                          | Access                       |
| ------------------ | ------------------------------ | ---------------------------- |
| Home               | `/`                          | Public                       |
| Login              | `/login`                     | Public                       |
| Register           | `/register`                  | Public                       |
| Explore            | `/discover`                  | Public/Auth                  |
| Community          | `/community`                 | Public/Auth                  |
| Dashboard          | `/dashboard`                 | Authenticated                |
| My Trips           | `/trips`                     | Authenticated                |
| Upcoming           | `/trips/upcoming`            | Authenticated                |
| Ongoing            | `/trips/ongoing`             | Authenticated                |
| Completed          | `/trips/completed`           | Authenticated                |
| Create Trip        | `/trips/new`                 | Authenticated                |
| Trip Overview      | `/trips/:id`                 | Owner/Admin                  |
| Itinerary          | `/trips/:id/itinerary`       | Owner/Admin/Public if shared |
| Budget             | `/trips/:id/budget`          | Owner/Admin                  |
| Calendar           | `/trips/:id/calendar`        | Owner/Admin/Public if shared |
| Share              | `/trips/:id/share`           | Owner/Admin                  |
| Destinations       | `/discover/destinations`     | Public/Auth                  |
| Destination Detail | `/discover/destinations/:id` | Public/Auth                  |
| Activities         | `/discover/activities`       | Public/Auth                  |
| Activity Detail    | `/discover/activities/:id`   | Public/Auth                  |
| Saved Destinations | `/saved`                     | Authenticated                |
| Community          | `/community`                 | Public/Auth                  |
| Public Trip        | `/public/trips/:token`       | Public                       |
| Profile            | `/settings/profile`          | Authenticated                |
| Preferences        | `/settings/preferences`      | Authenticated                |
| Security           | `/settings/security`         | Authenticated                |
| Account            | `/settings/account`          | Authenticated                |
| Admin Dashboard    | `/admin`                     | Admin                        |
| Admin Users        | `/admin/users`               | Admin                        |
| Admin Trips        | `/admin/trips`               | Admin                        |
| Admin Destinations | `/admin/destinations`        | Admin                        |
| Admin Activities   | `/admin/activities`          | Admin                        |
| Admin Analytics    | `/admin/analytics`           | Admin                        |

---

# 13. Navigation State Model

Navigation should recognize the following application states:

```text
Public
  ↓
Authenticated
  ↓
Authenticated + User
  ↓
Authenticated + Admin
```

And resource states:

```text
Resource
├── Existing
├── Not Found
├── Private
├── Public
└── Forbidden
```

Navigation behavior must respond correctly to each state.

---

# 14. Navigation Definition of Done

The navigation system is complete when:

* [ ] Public navigation is implemented.
* [ ] Authentication navigation is implemented.
* [ ] Authenticated navigation is implemented.
* [ ] Trip contextual navigation is implemented.
* [ ] Secondary navigation is implemented.
* [ ] Breadcrumbs are implemented where required.
* [ ] Role-based navigation is implemented.
* [ ] Admin navigation is protected.
* [ ] Mobile navigation is implemented.
* [ ] Active navigation states are implemented.
* [ ] Unauthorized route handling is implemented.
* [ ] Not-found route handling is implemented.
* [ ] Deep linking works for authorized routes.
* [ ] Navigation state is preserved appropriately.
* [ ] Unsaved-change handling is implemented where required.
* [ ] Navigation matches `Routes.md`.
* [ ] Navigation matches `UI.md`.
