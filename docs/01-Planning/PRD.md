
# Product Requirements Document

## 1. Project Overview

### Project Name

**GlobeTrotter – Personalized Travel Planning Platform**

### Version

**1.0**

### Status

**Proposed / Development Ready**

### Author

**GlobeTrotter Development Team**

### Project Type

**Web-based Travel Planning and Collaboration Application**

### Target Industry / Domain

**Travel, Tourism, Trip Planning, Personal Productivity, and Social Travel**

---

# 2. Product Overview

## Introduction

GlobeTrotter is a personalized travel planning platform designed to simplify the process of planning, organizing, visualizing, and sharing trips.

The application enables users to create customized multi-city trips, define travel dates, discover destinations and activities, organize day-wise itineraries, estimate expenses, visualize schedules through calendars, and share completed travel plans with other users.

The platform combines travel discovery, itinerary management, budget planning, calendar visualization, and community interaction into a single system.

## Vision

The vision of GlobeTrotter is to become a personalized, intelligent, and collaborative travel planning platform that transforms the way people plan and experience travel.

The platform aims to make travel planning as engaging and intuitive as the journey itself by allowing users to discover destinations, organize trips, manage budgets, visualize itineraries, and share their experiences.

## Mission

The mission of GlobeTrotter is to simplify complex travel planning by providing users with intuitive tools to:

* Create personalized multi-city trips.
* Add and manage travel stops.
* Assign dates and durations.
* Discover cities and activities.
* Build day-wise itineraries.
* Estimate and monitor expenses.
* Visualize trips through calendars and timelines.
* Share trips with friends or the public.
* Discover ideas and experiences through the travel community.

## Product Summary

GlobeTrotter will provide an end-to-end trip planning workflow:

**Register/Login → Dashboard → Create Trip → Select Destinations → Add Activities → Build Itinerary → Calculate Budget → View Calendar → Save/Manage Trip → Share Trip**

The product will support both individual trip planning and community-based travel discovery.

---

# 3. Problem Statement

## Current Problem

Travel planning often requires users to use multiple disconnected applications and services.

A traveler may need one service to search destinations, another to find activities, another to calculate expenses, a calendar application to organize dates, and messaging or social media platforms to share the final plan.

This fragmented process makes travel planning:

* Time-consuming.
* Difficult to organize.
* Difficult to modify.
* Difficult to track financially.
* Difficult to share.
* Difficult to visualize across multiple cities.

## Existing Limitations

Existing travel tools may focus primarily on booking flights, hotels, or individual activities rather than providing a unified personal planning workspace.

Common limitations include:

* No centralized multi-city itinerary.
* Limited day-wise planning.
* Poor visualization of travel timelines.
* Manual expense calculations.
* Limited ability to reorder destinations and activities.
* Destination and activity discovery being separated from itinerary creation.
* Limited collaboration and sharing capabilities.
* Difficulty comparing planned expenses against budgets.
* Lack of personalized travel organization.

## Why This Solution Is Needed

GlobeTrotter addresses these issues by combining travel discovery, itinerary building, budget tracking, calendar visualization, and sharing in one platform.

The system will allow users to move from travel inspiration to a structured and manageable travel plan without switching between multiple applications.

---

# 4. Objectives

## Primary Objectives

1. Enable users to create and manage personalized multi-city trips.
2. Provide an intuitive itinerary builder for organizing travel stops and activities.
3. Allow users to search and discover cities and activities.
4. Allow users to assign dates, durations, activities, and estimated costs.
5. Automatically calculate estimated trip expenses.
6. Provide calendar and timeline views of trips.
7. Allow users to manage upcoming, ongoing, and completed trips.
8. Enable users to share itineraries publicly or with other users.
9. Provide user profile and travel preference management.
10. Provide administrators with useful platform analytics and management capabilities.

## Secondary Objectives

1. Improve travel planning efficiency.
2. Encourage users to discover new destinations.
3. Provide reusable and shareable travel plans.
4. Enable users to learn from other travelers through the community.
5. Provide meaningful travel insights through analytics.
6. Create a foundation for future intelligent travel recommendations.

---

# 5. Scope

## In Scope

### Authentication

* User registration.
* Login.
* Logout.
* Password management.
* Forgot password.
* Basic authentication validation.

### User Management

* User profile.
* Profile photo.
* Personal information.
* Travel preferences.
* Account settings.
* Saved destinations.

### Dashboard / Home

* Welcome section.
* Recent trips.
* Upcoming trips.
* Popular destinations.
* Recommended destinations.
* Quick trip creation.

### Trip Management

* Create trip.
* Edit trip.
* Delete trip.
* View trip.
* Trip description.
* Start and end dates.
* Optional cover image.
* Trip status.

### Destination Management

* Search cities.
* Search destinations.
* Destination details.
* Add destination to trip.
* Remove destination.
* Reorder destinations.
* Country/region filtering.

### Activity Management

* Search activities.
* Activity categories.
* Activity details.
* Activity cost.
* Activity duration.
* Add activity to itinerary.
* Remove activity.
* Reorder activities.

### Itinerary Builder

* Create travel stops.
* Assign dates.
* Organize activities.
* Organize cities.
* Reorder trip sections.
* Set section budgets.
* View itinerary structure.

### Budget Management

* Estimated transportation costs.
* Accommodation costs.
* Activity costs.
* Meal costs.
* Other expenses.
* Total estimated budget.
* Daily average expense.
* Budget comparison.
* Over-budget indication.

### Calendar / Timeline

* Monthly calendar.
* Trip date visualization.
* Day-wise itinerary.
* Activity timeline.
* Date-based trip organization.

### Trip Listing

* Ongoing trips.
* Upcoming trips.
* Completed trips.
* Search.
* Filter.
* Sort.
* Grouping.

### Community

* Share trip experiences.
* Browse shared trips.
* Search community content.
* Filter and sort posts.
* View shared itineraries.

### Public Itinerary

* Public itinerary URL.
* Read-only itinerary.
* Trip summary.
* Destination information.
* Activities.
* Estimated budget.
* Copy Trip functionality.

### Administration

* User management.
* Trip statistics.
* Popular cities.
* Popular activities.
* User engagement metrics.
* Platform trend analysis.

## Out of Scope

The initial version will not include:

* Direct flight booking.
* Direct hotel booking.
* Direct activity booking.
* Payment processing for travel bookings.
* Travel insurance purchasing.
* Visa application processing.
* Real-time flight tracking.
* Real-time hotel availability.
* Full travel agency functionality.
* Automated physical ticket generation.
* Real-time navigation/GPS-based trip guidance.
* Advanced AI itinerary generation unless explicitly added as a future feature.

---

# 6. Target Users

## User Types

### 1. Individual Travelers

Users who want to plan personal trips.

**Responsibilities:**

* Create trips.
* Add destinations.
* Add activities.
* Manage dates.
* Manage budgets.
* View calendars.
* Share trips.

### 2. Frequent Travelers

Users who regularly plan multiple trips.

**Responsibilities:**

* Maintain several trip plans.
* Manage completed and upcoming trips.
* Reuse previous planning information.
* Track travel history.

### 3. Travel Enthusiasts / Community Users

Users interested in discovering travel ideas from other users.

**Responsibilities:**

* Browse shared itineraries.
* View experiences.
* Share trips.
* Discover destinations and activities.

### 4. Administrator

Responsible for platform management and monitoring.

**Responsibilities:**

* Manage users.
* Monitor trips.
* Analyze platform usage.
* Monitor popular destinations and activities.
* Review platform trends.
* Manage inappropriate or problematic community content where applicable.

---

# 7. Use Cases

## Main Use Cases

### UC-001 – Register Account

User creates a GlobeTrotter account using required personal information and authentication credentials.

### UC-002 – Login

User authenticates and accesses their personal travel dashboard.

### UC-003 – Create Trip

User creates a new trip by entering trip information, dates, and optional description/cover image.

### UC-004 – Search City

User searches for a destination or city and reviews available information.

### UC-005 – Add City to Trip

User selects a city and adds it as a travel stop.

### UC-006 – Search Activity

User searches for activities available at a selected destination.

### UC-007 – Add Activity

User adds an activity to a selected itinerary day or destination.

### UC-008 – Build Itinerary

User organizes destinations, travel dates, activities, and sections into a structured itinerary.

### UC-009 – Manage Budget

User assigns estimated expenses and reviews total trip costs.

### UC-010 – View Calendar

User views the trip through a calendar or timeline.

### UC-011 – Manage Trips

User views, edits, deletes, filters, and sorts created trips.

### UC-012 – Share Trip

User publishes an itinerary and generates a shareable public view.

### UC-013 – Copy Trip

Another user copies a public itinerary into their own account for modification.

### UC-014 – Manage Profile

User updates profile information and preferences.

### UC-015 – Explore Community

User browses public travel plans and experiences.

### UC-016 – Admin Analytics

Administrator views platform statistics and user/trip trends.

## Main User Journey

### Journey 1 – New User

**Registration → Login → Dashboard → Create Trip → Select Dates → Search City → Add City → Add Activities → Build Itinerary → Set Budget → Save Trip**

### Journey 2 – Existing User

**Login → Dashboard → My Trips → Select Trip → View/Edit Itinerary → View Budget → View Calendar**

### Journey 3 – Discover and Copy Trip

**Community → Search Trip → View Public Itinerary → Copy Trip → Customize Trip → Save**

### Journey 4 – Share Trip

**My Trips → Select Trip → Publish → Generate Public URL → Share**

---

# 8. Core Features

## 8.1 Authentication

Provides secure account creation and login.

**Features:**

* Registration.
* Login.
* Logout.
* Forgot password.
* Input validation.
* Authentication state management.

## 8.2 Dashboard

Provides a central starting point for the user.

**Features:**

* Welcome message.
* Upcoming trips.
* Previous trips.
* Popular destinations.
* Recommended activities.
* Plan New Trip.

## 8.3 Trip Creation

Allows users to start a personalized trip.

**Features:**

* Trip name.
* Start date.
* End date.
* Description.
* Optional cover photo.

## 8.4 Itinerary Builder

Allows users to structure their journey.

**Features:**

* Add destination.
* Add section.
* Assign date range.
* Add activities.
* Reorder destinations.
* Reorder activities.
* Set section budget.

## 8.5 City Search

Allows users to discover destinations.

**Features:**

* Search.
* Region filter.
* Country filter.
* Popularity.
* Cost index.
* Destination information.

## 8.6 Activity Search

Allows users to discover experiences.

**Features:**

* Search.
* Category filtering.
* Cost filtering.
* Duration filtering.
* Activity details.
* Add to itinerary.

## 8.7 Budget Management

Provides financial visibility.

**Features:**

* Transport expenses.
* Accommodation expenses.
* Activities.
* Meals.
* Miscellaneous expenses.
* Section budget.
* Total budget.
* Daily average.
* Budget warnings.

## 8.8 Calendar and Timeline

Provides visual planning.

**Features:**

* Monthly calendar.
* Trip date ranges.
* Daily activities.
* Timeline.
* Expandable days.
* Activity ordering.

## 8.9 Trip Management

Allows users to manage saved trips.

**Features:**

* Ongoing trips.
* Upcoming trips.
* Completed trips.
* Search.
* Filtering.
* Sorting.
* Grouping.
* View.
* Edit.
* Delete.

## 8.10 Community

Provides collaborative travel discovery.

**Features:**

* Public experiences.
* Shared trips.
* Search.
* Filter.
* Sort.
* Browse public content.

## 8.11 Public Itinerary

Allows a trip to be shared.

**Features:**

* Public URL.
* Read-only trip.
* Trip summary.
* Itinerary.
* Budget overview.
* Copy Trip.

## 8.12 User Profile

Allows users to manage their account.

**Features:**

* Profile photo.
* Personal information.
* Email.
* Preferences.
* Saved destinations.
* Account deletion.

## 8.13 Admin Dashboard

Provides platform management and analytics.

**Features:**

* User management.
* Popular cities.
* Popular activities.
* User trends.
* Trip statistics.
* Platform engagement analytics.

---

# 9. Functional Requirements

## Authentication Requirements

**FR-001:** The system shall allow users to create an account.

**FR-002:** The system shall allow registered users to log in.

**FR-003:** The system shall validate required authentication fields.

**FR-004:** The system shall allow users to log out.

**FR-005:** The system shall provide password recovery functionality.

---

## User Requirements

**FR-006:** The system shall allow users to view their profiles.

**FR-007:** The system shall allow users to edit their profile information.

**FR-008:** The system shall allow users to upload or update a profile photo.

**FR-009:** The system shall allow users to manage travel preferences.

**FR-010:** The system shall allow users to delete their account subject to applicable confirmation requirements.

---

## Trip Requirements

**FR-011:** The system shall allow users to create a trip.

**FR-012:** The system shall require a trip name.

**FR-013:** The system shall allow users to define trip start and end dates.

**FR-014:** The system shall allow users to add a trip description.

**FR-015:** The system shall allow users to upload an optional trip cover image.

**FR-016:** The system shall allow users to edit trips.

**FR-017:** The system shall allow users to delete trips.

**FR-018:** The system shall maintain trip status such as upcoming, ongoing, and completed.

---

## Destination Requirements

**FR-019:** The system shall allow users to search destinations.

**FR-020:** The system shall display destination information.

**FR-021:** The system shall allow users to filter destinations.

**FR-022:** The system shall allow users to add destinations to trips.

**FR-023:** The system shall allow users to remove destinations.

**FR-024:** The system shall allow users to reorder destinations.

---

## Activity Requirements

**FR-025:** The system shall allow users to search activities.

**FR-026:** The system shall categorize activities.

**FR-027:** The system shall allow users to filter activities by applicable criteria.

**FR-028:** The system shall display activity details.

**FR-029:** The system shall allow users to add activities to itineraries.

**FR-030:** The system shall allow users to remove activities.

**FR-031:** The system shall allow users to reorder activities.

---

## Itinerary Requirements

**FR-032:** The system shall allow users to create multiple itinerary sections/stops.

**FR-033:** The system shall allow users to assign date ranges to itinerary sections.

**FR-034:** The system shall allow activities to be assigned to specific dates.

**FR-035:** The system shall display itinerary information chronologically.

**FR-036:** The system shall allow users to modify itinerary information.

**FR-037:** The system shall preserve itinerary changes.

---

## Budget Requirements

**FR-038:** The system shall allow expense estimates to be associated with itinerary items.

**FR-039:** The system shall calculate the estimated total trip cost.

**FR-040:** The system shall provide expense categories.

**FR-041:** The system shall calculate average estimated cost per day.

**FR-042:** The system shall display budget breakdowns.

**FR-043:** The system shall identify trips or days that exceed configured budgets.

---

## Calendar Requirements

**FR-044:** The system shall provide a calendar representation of trips.

**FR-045:** The system shall display trip dates within the calendar.

**FR-046:** The system shall display itinerary activities by date.

**FR-047:** The system shall provide a timeline/list representation of itinerary information.

---

## Community Requirements

**FR-048:** The system shall allow eligible users to publish trips or travel experiences.

**FR-049:** The system shall provide a community browsing interface.

**FR-050:** The system shall allow users to search community content.

**FR-051:** The system shall allow users to filter and sort community content.

**FR-052:** The system shall provide a public read-only itinerary view.

**FR-053:** The system shall allow users to copy eligible public itineraries.

---

## Admin Requirements

**FR-054:** The system shall provide an administrator dashboard.

**FR-055:** The administrator shall be able to view registered users.

**FR-056:** The administrator shall be able to view platform trip statistics.

**FR-057:** The system shall provide popular destination statistics.

**FR-058:** The system shall provide popular activity statistics.

**FR-059:** The system shall provide user engagement analytics.

---

# 10. Non-Functional Requirements

## Performance

* Primary application pages should load within an acceptable response time under normal conditions.
* Search operations should return results efficiently.
* Database queries should be optimized for frequently accessed travel data.
* Images should be optimized before delivery.
* The frontend should avoid unnecessary network requests.
* UI interactions should remain responsive.

## Security

* User authentication credentials must be securely handled.
* Passwords must never be stored as plain text.
* Authorization must be enforced for protected resources.
* Users must only access their own private trips and account information.
* Administrative functions must require appropriate authorization.
* Public itineraries must expose only information explicitly marked as public.
* Input validation must be implemented on client and server sides.
* Sensitive configuration values must not be exposed through the frontend.

## Scalability

The architecture should support growth in:

* Number of users.
* Number of trips.
* Number of destinations.
* Number of activities.
* Community content.
* Analytics data.

Database design should support relational relationships between users, trips, stops, activities, expenses, and itinerary entries.

## Availability

* The application should be available to users whenever the underlying infrastructure is operational.
* Application failures should not result in accidental loss of saved trip information.
* Database backups should be considered for production deployment.

## Accessibility

* The interface should support keyboard navigation where applicable.
* Form controls should have clear labels.
* Text should remain readable across screen sizes.
* Color should not be the only indicator of state.
* Interactive controls should have understandable labels.
* The application should support responsive desktop and mobile layouts.

---

# 11. Business Rules

## General Rules

**BR-001:** A user must be authenticated to create or modify a private trip.

**BR-002:** A trip must have a valid name.

**BR-003:** A trip must have a valid start date and end date.

**BR-004:** Trip end date cannot be earlier than the start date.

**BR-005:** A destination can be associated with a trip only when the destination exists in the system.

**BR-006:** Activities added to an itinerary should belong to or be relevant to the selected destination where applicable.

**BR-007:** Activities must fall within the applicable trip or itinerary date range.

**BR-008:** An itinerary must maintain chronological date ordering.

**BR-009:** Expense values cannot be negative.

**BR-010:** Budget totals must be calculated from associated expense records rather than manually duplicated values where possible.

## Privacy Rules

**BR-011:** Private trips shall only be visible to authorized users.

**BR-012:** A trip must be explicitly published before it becomes publicly accessible.

**BR-013:** Public itinerary views shall not expose private user information unnecessarily.

**BR-014:** Users must be able to control whether eligible trips are public or private.

## Administrative Rules

**BR-015:** Administrative functions shall only be available to authorized administrators.

**BR-016:** Administrative analytics shall use system data and should not modify trip information unless the administrator has the appropriate management permission.

## Validation Rules

**BR-017:** Required fields must be validated before submission.

**BR-018:** Email addresses must follow valid email formatting.

**BR-019:** Password requirements must be enforced during registration and password changes.

**BR-020:** Invalid date combinations must be rejected.

**BR-021:** Uploaded images must comply with configured file type and size restrictions.

---

# 12. Assumptions

The following assumptions are made during planning:

1. Users have access to an internet connection.
2. Users have a supported modern browser or mobile-compatible environment.
3. Destination and activity information is available through a database or suitable data source.
4. Estimated prices are informational and may differ from actual market prices.
5. The first release focuses on planning rather than directly booking travel services.
6. Users are responsible for verifying actual travel prices, availability, regulations, and bookings.
7. The relational database will be the primary source for persistent application data.
8. Community functionality will initially focus on sharing and discovery rather than a full social-network experience.
9. The first release may use static or seeded destination/activity data before integration with external travel APIs.
10. Advanced recommendation and AI functionality can be introduced after the core planning workflow is stable.

---

# 13. Constraints

## Budget

The initial project is intended to be suitable for a student/hackathon-style implementation with controlled infrastructure and development costs.

The solution should prioritize free or low-cost services during initial development.

## Technology

The final technology stack must support:

* Responsive frontend development.
* Backend API development.
* Relational database integration.
* Authentication.
* Image handling.
* Search and filtering.
* Analytics.
* Deployment.

The exact technology choices may be finalized during architecture planning.

## Time

The project must prioritize the core travel planning workflow before optional features.

The minimum viable product should focus on:

**Authentication → Trip Creation → Destination Selection → Activity Selection → Itinerary → Budget → Calendar → Trip Management**

## Infrastructure

The system should be deployable using a reasonably low-cost cloud environment.

Infrastructure should support:

* Application hosting.
* Relational database hosting.
* Image/file storage where required.
* Secure environment variables.
* Basic monitoring and backups.

## Data Constraints

Destination and activity information may initially be limited by the availability and quality of the selected data source.

Travel costs are estimates and should not be treated as guaranteed booking prices.

---

# 14. Success Criteria

The GlobeTrotter project will be considered successful when:

### Functional Success

1. Users can successfully register and log in.
2. Users can create a complete trip.
3. Users can add multiple destinations.
4. Users can add activities to destinations.
5. Users can assign dates to travel stops and activities.
6. Users can reorder itinerary items.
7. Users can calculate and view estimated trip costs.
8. Users can view their trip through a calendar/timeline.
9. Users can save and manage multiple trips.
10. Users can distinguish ongoing, upcoming, and completed trips.
11. Users can share eligible itineraries.
12. Other users can view public itineraries.
13. Users can copy public trips where supported.
14. Administrators can access basic analytics.

### Usability Success

* Users can understand the primary navigation without assistance.
* Creating a basic trip requires a minimal number of unnecessary steps.
* The itinerary remains understandable as the number of destinations and activities increases.
* The interface works effectively on supported screen sizes.

### Technical Success

* Relational relationships between users, trips, destinations, activities, itinerary entries, and expenses are correctly maintained.
* Data persists correctly across sessions.
* Protected resources are secured through authentication and authorization.
* Common operations provide acceptable response times.
* Application errors do not silently corrupt trip data.

### Demonstration Success

For a complete demonstration, a user should be able to perform the following flow:

**Register → Login → Create Trip → Add Multiple Cities → Add Activities → Assign Dates → Build Itinerary → Set Budget → View Calendar → Save Trip → Publish/Share Trip → View Shared Trip**

This end-to-end workflow represents the core value proposition of GlobeTrotter.

---

# 15. Future Scope

The following features may be introduced after the initial release.

## AI-Powered Travel Planning

* AI-generated itineraries.
* Personalized destination recommendations.
* AI-based activity recommendations.
* Budget-aware itinerary suggestions.
* Automatic itinerary optimization.
* Travel preference learning.

## Real-Time Travel Data

* Live flight prices.
* Hotel prices and availability.
* Real-time activity availability.
* Weather information.
* Local transportation information.
* Travel alerts.

## Booking Integration

* Flight booking.
* Hotel booking.
* Activity booking.
* Transportation booking.
* Direct payment integration.

## Advanced Collaboration

* Collaborative trip editing.
* Friends/family trip groups.
* Shared expenses.
* Comments on itinerary items.
* Voting on destinations or activities.
* Real-time collaborative planning.

## Advanced Community Features

* Likes/reactions.
* Comments.
* Following travelers.
* Travel profiles.
* Ratings and reviews.
* Trending itineraries.
* Personalized community recommendations.

## Maps and Location Features

* Interactive destination maps.
* Route visualization.
* Distance calculations.
* Travel-time estimation.
* GPS integration.
* Navigation integration.

## Advanced Budgeting

* Multiple currencies.
* Currency conversion.
* Actual vs estimated expenses.
* Shared expenses.
* Expense splitting.
* Budget forecasting.
* Financial reports.

## Notifications

* Trip reminders.
* Activity reminders.
* Travel date notifications.
* Budget alerts.
* Itinerary change notifications.
* Community notifications.

## Offline Support

* Offline itinerary access.
* Offline trip data.
* Offline maps.
* Local itinerary storage.

## Personalization

* Saved travel preferences.
* Interest-based recommendations.
* Preferred budget ranges.
* Preferred activity types.
* Travel history-based recommendations.

## Advanced Analytics

* Personal travel analytics.
* Spending patterns.
* Destination history.
* Activity preferences.
* Travel frequency.
* Admin-level predictive analytics.

---

# MVP Priority

To ensure the project remains achievable within the available development time, the initial implementation should prioritize the following features:

### Priority 1 – Essential

* Authentication
* Dashboard
* Create Trip
* My Trips
* City Search
* Activity Search
* Itinerary Builder
* Itinerary View
* Budget Calculation
* Calendar View
* User Profile

### Priority 2 – Important

* Public/Shared Itinerary
* Community
* Search/Filter/Sort
* Copy Trip
* Basic Admin Dashboard

### Priority 3 – Future / Optional

* AI recommendations
* Real-time travel APIs
* Booking integrations
* Collaborative editing
* Advanced analytics
* Maps
* Notifications
* Offline functionality

---

# Product Screen Mapping

The provided GlobeTrotter mockups map to the product requirements approximately as follows:

| Screen | Screen Name            | Primary Requirement              |
| ------ | ---------------------- | -------------------------------- |
| 1      | Login                  | Authentication                   |
| 2      | Registration           | Authentication / User Management |
| 3      | Main Landing Page      | Dashboard / Home                 |
| 4      | Create New Trip        | Create Trip                      |
| 5      | Build Itinerary        | Itinerary Builder                |
| 6      | User Trip Listing      | My Trips                         |
| 7      | User Profile           | Profile / Settings               |
| 8      | Activity / City Search | Destination & Activity Discovery |
| 9      | Itinerary View         | Itinerary + Budget               |
| 10     | Community              | Community / Shared Trips         |
| 11     | Calendar               | Calendar / Timeline              |
| 12     | Admin Panel            | Admin / Analytics                |

The mockups therefore cover the primary product workflow, while features such as detailed expense breakdowns, public itinerary sharing, password recovery, and some administrative controls may require additional states, dialogs, components, or sub-pages rather than separate top-level screens.
