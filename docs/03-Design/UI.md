
# UI

# 1. UI Overview

The GlobeTrotter UI is a responsive travel-planning interface that guides users from destination discovery through trip creation, itinerary management, budgeting, calendar planning, and sharing.

The UI should prioritize:

* Simple travel planning workflows.
* Clear information hierarchy.
* Fast access to upcoming trips.
* Visual itinerary organization.
* Easy destination and activity discovery.
* Clear budget visibility.
* Responsive desktop and mobile experiences.
* Consistent interactions across all modules.

## Primary User Flow

```text
Login / Register
      ↓
Dashboard
      ↓
Create Trip
      ↓
Add Destinations
      ↓
Add Activities
      ↓
Build Itinerary
      ↓
Manage Budget
      ↓
Calendar / Timeline
      ↓
Save Trip
      ↓
Share / Publish
```

---

# 2. UI Goals

## Usability

Users should understand the primary actions without extensive instructions.

## Discoverability

Travel destinations, activities, trips, and shared itineraries should be easy to discover.

## Clarity

Dates, destinations, activities, costs, and trip status should be visually distinguishable.

## Consistency

Buttons, cards, forms, dialogs, navigation, and interaction patterns should remain consistent throughout the application.

## Responsiveness

The application should work effectively on:

* Desktop.
* Laptop.
* Tablet.
* Mobile.

## Efficiency

Common actions such as creating a trip, adding a destination, and editing activities should require minimal unnecessary navigation.

---

# 3. Global Layout

## Desktop Layout

The authenticated application should use a persistent application shell.

```text
┌─────────────────────────────────────────────────────────────┐
│ Logo / Brand       Search             Notifications Profile │
├──────────────┬──────────────────────────────────────────────┤
│              │                                              │
│ Dashboard    │                                              │
│ My Trips     │                 Page Content                 │
│ Discover     │                                              │
│ Community    │                                              │
│ Calendar     │                                              │
│              │                                              │
│ Settings     │                                              │
│              │                                              │
│              │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

## Header

The authenticated header should include:

* GlobeTrotter logo/name.
* Global search where applicable.
* Notification indicator.
* User profile/avatar.
* User menu.

## Sidebar

Primary navigation:

* Dashboard.
* My Trips.
* Discover.
* Community.
* Calendar.
* Saved Destinations.
* Settings.

For administrators:

* Admin Dashboard.
* Users.
* Analytics.

## Mobile Layout

The sidebar should transform into a mobile navigation pattern.

Recommended:

* Compact top header.
* Bottom navigation for high-frequency actions.
* Drawer/menu for secondary navigation.

---

# 4. Public Pages

# Home / Landing Page

## Purpose

Introduce GlobeTrotter and guide visitors toward registration or login.

## Components

* Brand/header.
* Hero section.
* Main value proposition.
* Trip-planning preview.
* Destination discovery preview.
* Budget/planning preview.
* Community/sharing preview.
* Call-to-action.
* Footer.

## Primary Actions

* Get Started.
* Login.
* Explore Public Trips.

## Behavior

* Public users can browse eligible public content.
* Authentication actions should be clearly visible.
* No private trip data should be displayed.

---

# Login

## Purpose

Authenticate existing users.

## Components

* Logo.
* Email input.
* Password input.
* Show/hide password control.
* Login button.
* Forgot Password link.
* Registration link.
* Validation messages.

## Behavior

* Disable submit while authenticating.
* Display field-level validation.
* Display authentication error.
* Redirect authenticated users to Dashboard.

---

# Register

## Purpose

Create a new account.

## Components

* Name input.
* Email input.
* Password input.
* Confirm password if required.
* Terms/privacy acknowledgment if applicable.
* Register button.
* Login link.

## Behavior

* Validate fields before submission.
* Show password requirements.
* Prevent duplicate submission.
* Display registration result.
* Redirect to appropriate post-registration flow.

---

# Forgot Password

## Components

* Email field.
* Submit button.
* Back to Login.
* Success message.

## Behavior

The UI should use a generic success message that does not reveal whether an email belongs to an existing account.

---

# Public Itinerary

## Purpose

Allow visitors to view a shared travel plan.

## Components

* Trip cover image.
* Trip title.
* Date range.
* Destination summary.
* Itinerary.
* Activities.
* Budget summary when shared.
* Share controls.
* Copy Trip button for authenticated users.

## Behavior

* Read-only.
* No editing controls for visitors.
* Private information must not be exposed.

---

# 5. Dashboard

# Layout

The Dashboard is the primary authenticated landing page.

```text
┌───────────────────────────────────────────────────────────┐
│ Welcome back, User                                        │
│ Plan your next adventure                                  │
│                                      [Plan New Trip]      │
├───────────────────────────────────────────────────────────┤
│ Upcoming Trip                                              │
│ ┌───────────────────────────────────────────────────────┐ │
│ │ Cover │ Trip Name │ Dates │ Destinations │ View       │ │
│ └───────────────────────────────────────────────────────┘ │
├───────────────────────────────────────────────────────────┤
│ Recent Trips                                               │
│ [Trip Card] [Trip Card] [Trip Card]                       │
├───────────────────────────────────────────────────────────┤
│ Discover                                                  │
│ [Destination Card] [Destination Card] [Destination Card] │
└───────────────────────────────────────────────────────────┘
```

# Components

### Welcome Header

Displays:

* User name.
* Short contextual message.
* Plan New Trip button.

### Upcoming Trip Card

Displays:

* Trip cover.
* Trip name.
* Date range.
* Destination count.
* Trip status.
* Progress where supported.
* View/Edit action.

### Recent Trips

Displays recently modified or recently created trips.

### Recommended Destinations

Displays destination cards with:

* Image.
* City.
* Country.
* Cost index.
* Popularity.
* Add/View action.

### Budget Highlight

Displays:

* Total planned amount.
* Estimated spending.
* Remaining budget.
* Budget status.

# KPIs

Recommended dashboard summaries:

* Upcoming Trips.
* Active Trips.
* Completed Trips.
* Saved Destinations.

# Quick Actions

* Plan New Trip.
* My Trips.
* Explore Destinations.
* Open Calendar.
* View Community.

# Charts

The core user dashboard does not require complex charts.

Optional:

* Spending by category.
* Trip budget summary.
* Travel history.

---

# 6. Module Screens

# 6.1 My Trips

## List Page

### Purpose

Show all user-owned trips.

### Components

* Page title.
* Plan New Trip button.
* Search field.
* Filter controls.
* Sort controls.
* Status tabs.
* Trip cards/list.
* Pagination where required.

### Trip Card

Displays:

* Cover image.
* Trip name.
* Date range.
* Destination count.
* Status.
* Visibility.
* Last updated.
* View.
* Edit.
* More actions.

### Status Categories

* Upcoming.
* Ongoing.
* Completed.

## Create Page

### Fields

* Trip name.
* Start date.
* End date.
* Description.
* Cover image.
* Visibility.

### Actions

* Create Trip.
* Cancel.

### Validation

* Required fields.
* Valid dates.
* End date must not precede start date.
* Valid media upload.

## Detail Page

Displays:

* Trip header.
* Cover image.
* Trip title.
* Dates.
* Destination summary.
* Budget summary.
* Itinerary summary.
* Calendar shortcut.
* Share button.
* Edit button.

## Edit Page

Same core fields as Create Trip.

Additional actions:

* Save changes.
* Cancel.
* Delete Trip.

---

# 6.2 Destination / City Search

## Search Page

### Components

* Search input.
* Search icon.
* Recent searches where applicable.
* Country filter.
* Region filter.
* Cost filter.
* Popularity sorting.
* Destination result cards.

### Destination Card

Displays:

* Image.
* City.
* Country.
* Cost index.
* Popularity.
* Add to Trip.
* View Details.

## Detail Page

Displays:

* Destination image.
* Destination name.
* Country/region.
* Description.
* Cost index.
* Popularity.
* Coordinates/map area where supported.
* Popular activities.
* Add to Trip.
* Save Destination.

## Add to Trip

Open a modal/drawer allowing the user to:

* Select trip.
* Set start date.
* Set end date.
* Set order/position.

---

# 6.3 Activity Search

## Search Page

### Components

* Search input.
* Destination selector.
* Category filter.
* Cost filter.
* Duration filter.
* Sort.
* Activity results.

## Activity Card

Displays:

* Image.
* Activity name.
* Category.
* Duration.
* Estimated cost.
* Rating/popularity where available.
* Add to Itinerary.

## Detail View

Displays:

* Image.
* Activity title.
* Description.
* Duration.
* Estimated cost.
* Destination.
* Category.
* Add to Itinerary.

---

# 6.4 Itinerary Builder

## Purpose

Provide the primary interactive trip-planning workspace.

## Layout

```text
┌──────────────────────────────────────────────────────────────┐
│ Trip Name                          [Save] [Share]            │
│ Date Range                                                   │
├──────────────────────────────────────────────────────────────┤
│ Trip Stops                                                   │
│ [Paris] [Rome] [Florence] [+ Add Stop]                     │
├──────────────────────────────────────────────────────────────┤
│ Day / Section                                                │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ Destination / Date                                       │ │
│ │                                                          │ │
│ │ 10:00  Louvre Museum                  €40                │ │
│ │ 14:00  Lunch                          €20                │ │
│ │ 18:00  City Tour                      €30                │ │
│ │                                                          │ │
│ │ [+ Add Activity]                                         │ │
│ └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

## Components

* Trip header.
* Destination tabs/sections.
* Date range.
* Day sections.
* Activity blocks.
* Add Stop.
* Add Activity.
* Reordering controls.
* Budget summary.
* Save action.

## Activity Block

Displays:

* Time.
* Activity name.
* Duration.
* Cost.
* Notes.
* Edit.
* Delete.
* Drag/reorder control.

## Behavior

* Users can reorder destinations.
* Users can reorder activities.
* Users can change dates.
* Invalid date combinations should be blocked.
* Changes should provide visible save state.
* Unsaved changes should be clearly indicated.

---

# 6.5 Itinerary View

## Purpose

Provide a clean read-oriented representation of the completed itinerary.

## Layout Modes

### List View

```text
Day 1
 ├── Activity
 ├── Activity
 └── Activity

Day 2
 ├── Activity
 └── Activity
```

### Timeline View

```text
10:00 ── Activity
12:30 ── Activity
15:00 ── Activity
19:00 ── Activity
```

## Components

* Trip header.
* Date selector.
* Destination headers.
* Day sections.
* Activity blocks.
* Cost summary.
* Edit itinerary button.

---

# 6.6 Budget & Cost Breakdown

## Purpose

Provide a financial overview of the trip.

## Components

### Budget Header

Displays:

* Planned budget.
* Estimated total.
* Remaining amount.
* Budget status.

### Category Breakdown

Categories:

* Transportation.
* Accommodation.
* Activities.
* Meals.
* Miscellaneous.

### Visualization

Possible visualizations:

* Donut/pie chart.
* Bar chart.
* Category progress indicators.

### Expense List

Columns:

* Description.
* Category.
* Date.
* Amount.
* Currency.
* Estimated/Actual.
* Actions.

## Actions

* Add expense.
* Edit expense.
* Delete expense.
* Edit budget.

## Warning State

Display an explicit warning when estimated spending exceeds planned budget.

---

# 6.7 Calendar / Timeline

## Calendar Page

### Components

* Calendar header.
* Month navigation.
* Date grid.
* Trip date range.
* Activity indicators.
* Selected-day detail panel.

## Day Detail

Displays:

* Destination.
* Activities.
* Start/end times.
* Cost.
* Edit shortcut.

## Timeline Page

Displays the trip chronologically.

## Behavior

Selecting an event should provide quick access to its itinerary item.

---

# 6.8 Profile / Settings

## Profile Page

Displays:

* Profile image.
* Name.
* Email.
* Bio.
* Saved destinations.
* Travel preferences.

## Edit Profile

Fields:

* Name.
* Bio.
* Avatar.

## Preferences

Fields:

* Language.
* Currency.
* Budget level.
* Travel style.

## Account Settings

Actions:

* Change password.
* Delete account.
* Logout.

## Delete Account

Use a confirmation modal with explicit confirmation text.

---

# 6.9 Community

## Community Page

### Components

* Search.
* Filters.
* Sort.
* Community cards.
* Shared trip cards.
* Pagination/infinite scrolling depending on implementation.

## Community Card

Displays:

* Creator.
* Trip/post title.
* Cover image.
* Destination summary.
* Date range where applicable.
* Short description.
* View button.
* Copy Trip where supported.

## Community Detail

Displays:

* Creator information.
* Content.
* Trip information.
* Destinations.
* Itinerary.
* Budget where shared.
* Copy Trip.
* Share.

## Behavior

* Only published content appears in public discovery.
* User-owned content has edit/delete controls.
* Moderation controls are visible only to authorized administrators.

---

# 6.10 Public / Shared Itinerary

## Header

Displays:

* Trip name.
* Destination summary.
* Date range.
* Creator display name where permitted.

## Main Content

* Cover image.
* Itinerary.
* Activities.
* Budget summary if public.
* Trip highlights.

## Actions

* Share.
* Copy Trip.
* Back to community where applicable.

## Behavior

The page remains read-only unless the visitor copies the trip.

---

# 6.11 Admin Dashboard

## Layout

```text
┌───────────────────────────────────────────────────────────┐
│ Admin Dashboard                                           │
├───────────────────────────────────────────────────────────┤
│ Users │ Trips │ Active Users │ Community Activity        │
├───────────────────────────────────────────────────────────┤
│ User Growth Chart                Trip Growth Chart        │
├───────────────────────────────────────────────────────────┤
│ Popular Destinations             Popular Activities       │
├───────────────────────────────────────────────────────────┤
│ Recent Users / Management Table                          │
└───────────────────────────────────────────────────────────┘
```

## KPIs

* Total users.
* New users.
* Total trips.
* Active trips.
* Completed trips.
* Public trips.
* Community posts.

## Charts

* User growth.
* Trip creation.
* Popular destinations.
* Popular activities.
* Engagement.

## Admin Tables

### Users Table

Columns:

* Name.
* Email.
* Role.
* Status.
* Created date.
* Actions.

### Trips Table

Columns:

* Trip.
* Owner.
* Date range.
* Status.
* Visibility.
* Created date.

---

# 7. Tables

Tables should be used for structured data that benefits from comparison.

## Standard Table Structure

```text
┌───────────────────────────────────────────────────────────────┐
│ Search                 Filter        Sort                     │
├───────────────────────────────────────────────────────────────┤
│ Column │ Column │ Column │ Column │ Actions                  │
├───────────────────────────────────────────────────────────────┤
│ Data   │ Data   │ Data   │ Data   │ View Edit Delete          │
│ Data   │ Data   │ Data   │ Data   │ View Edit Delete          │
└───────────────────────────────────────────────────────────────┘
```

## Table Requirements

* Clear column headers.
* Sortable columns where appropriate.
* Pagination for large datasets.
* Responsive behavior.
* Horizontal scrolling on small screens where necessary.
* Empty state.
* Loading state.
* Error state.
* Row actions.
* Confirmation for destructive actions.

---

# 8. Forms

## Form Structure

Forms should use:

* Clear field labels.
* Supporting descriptions where needed.
* Required indicators.
* Inline validation.
* Appropriate input types.
* Logical grouping.
* Primary and secondary actions.

## Common Inputs

* Text.
* Text area.
* Email.
* Password.
* Date picker.
* Time picker.
* Select.
* Multi-select.
* Search input.
* File upload.
* Currency input.
* Number input.

## Form Behavior

* Validate on submit.
* Use field-level validation where appropriate.
* Preserve entered values after non-critical validation failures.
* Disable submit during processing.
* Show success/error state after submission.

---

# 9. Modals

Modals should be used for focused actions that do not require a complete page.

## Appropriate Uses

* Delete confirmation.
* Add destination.
* Add activity.
* Share trip.
* Copy trip.
* Quick edit.
* Confirmation dialogs.

## Modal Structure

```text
┌──────────────────────────────────┐
│ Modal Title                  X   │
├──────────────────────────────────┤
│                                  │
│ Content                          │
│                                  │
├──────────────────────────────────┤
│             Cancel   Confirm     │
└──────────────────────────────────┘
```

## Rules

* Clear title.
* Clear primary action.
* Escape/close behavior where appropriate.
* Destructive actions must be visually distinguishable.
* Do not use modals for lengthy workflows.

---

# 10. Drawers

Drawers should be used for contextual editing or additional information.

## Appropriate Uses

* Activity details.
* Destination details.
* Quick trip editing.
* Notification center.
* Mobile navigation.

## Behavior

* Open from the relevant edge.
* Preserve page context where possible.
* Close without losing saved data.
* Support mobile adaptation.

---

# 11. Cards

Cards should be used for:

* Trips.
* Destinations.
* Activities.
* Community posts.
* Dashboard summaries.

## Trip Card

Displays:

* Cover image.
* Trip name.
* Dates.
* Destination count.
* Status.
* Primary action.
* Secondary actions.

## Destination Card

Displays:

* Image.
* City.
* Country.
* Cost index.
* Popularity.
* View/Add action.

## Activity Card

Displays:

* Image.
* Activity name.
* Category.
* Duration.
* Cost.
* Action.

## Community Card

Displays:

* Creator.
* Image.
* Title.
* Summary.
* Destination.
* View/Copy action.

---

# 12. Search & Filters

## Search

Search fields should provide:

* Placeholder explaining the search.
* Clear button after input.
* Loading indication.
* Empty state.
* Result count where useful.

## Filters

Filters should be context-specific.

### Destinations

* Country.
* Region.
* Cost.
* Popularity.

### Activities

* Category.
* Cost.
* Duration.
* Destination.

### Trips

* Status.
* Visibility.
* Date.
* Sort order.

### Community

* Content type.
* Destination.
* Date.
* Popularity/recent.

## Mobile Filter Behavior

On smaller screens, filters should open inside a drawer or bottom sheet.

---

# 13. Empty States

Empty states should explain what is missing and guide the user toward the next action.

## No Trips

```text
You haven't created a trip yet.

Start planning your next adventure.

[Plan New Trip]
```

## No Search Results

```text
No destinations found.

Try a different search or change your filters.
```

## No Activities

```text
No activities match your search.

Try another category or destination.
```

## Empty Community

```text
No shared trips are available yet.

Explore destinations or create your own trip.
```

## Empty Calendar

```text
Nothing planned for this date.

[Add Activity]
```

---

# 14. Loading States

Loading indicators should be used for asynchronous operations.

## Page Loading

Use skeleton layouts for:

* Dashboard.
* Trip lists.
* Destination results.
* Activity results.
* Community feeds.

## Button Loading

During submission:

```text
[Creating Trip...]
```

rather than allowing duplicate clicks.

## Inline Loading

Use small loaders for:

* Search.
* Filters.
* Individual cards.
* Quick actions.

## Rules

* Do not block the whole interface when only a small component is loading.
* Preserve the page structure where possible.
* Avoid unnecessary loading flashes for very fast requests.

---

# 15. Error States

Errors should be understandable and actionable.

## Form Error

Show the error close to the affected field.

Example:

```text
End Date
[ 10/06/2026 ]

End date must be on or after the start date.
```

## Page Error

```text
Something went wrong.

We couldn't load your itinerary.

[Try Again]
```

## Network Error

Provide:

* Clear message.
* Retry action.
* No loss of unsaved input where possible.

## Permission Error

```text
You don't have permission to view this trip.
```

## Not Found

```text
This trip could not be found.

[Back to My Trips]
```

---

# 16. Success States

Successful operations should produce clear but non-intrusive feedback.

## Examples

### Trip Created

```text
Trip created successfully.
```

### Destination Added

```text
Paris was added to your trip.
```

### Activity Added

```text
Activity added to Day 2.
```

### Trip Shared

```text
Your trip is now public.
```

## Success UI

Preferred patterns:

* Toast.
* Inline confirmation.
* Updated content state.
* Redirect after completed workflows where appropriate.

---

# 17. Notifications

## Notification Center

The notification interface should display:

* Notification title.
* Short message.
* Timestamp.
* Read/unread state.
* Related action.

## Notification Types

Potential notifications:

* Trip reminders.
* Activity reminders.
* Budget warnings.
* Itinerary changes.
* Trip share confirmation.
* Community updates.
* Account/security notifications.

## Notification States

* Unread.
* Read.
* Archived where supported.

## Interaction

Selecting a notification should navigate to the related screen/resource where applicable.

---

# 18. Responsive Behavior

The UI should adapt rather than simply scale down.

## Desktop

* Persistent sidebar.
* Multi-column layouts.
* Larger tables.
* Side-by-side panels.
* Full calendar.

## Tablet

* Reduced sidebar width or collapsible sidebar.
* Fewer columns.
* Adaptive cards.
* Compact forms.

## Mobile

* Bottom navigation or navigation drawer.
* Single-column layout.
* Stacked cards.
* Full-width forms.
* Drawer-based filters.
* Horizontally scrollable tabs when necessary.
* Compact calendar representations.

## Responsive Rules

* Avoid fixed-width content that causes unnecessary horizontal scrolling.
* Preserve primary actions on smaller screens.
* Keep touch targets sufficiently large.
* Move secondary actions into contextual menus.
* Ensure tables have a usable mobile fallback.

---

# 19. Accessibility

The UI should follow accessible interaction principles.

## Requirements

* Semantic HTML.
* Keyboard navigation.
* Visible focus states.
* Proper form labels.
* Accessible error messages.
* Sufficient text contrast.
* Meaningful button labels.
* Alternative text for meaningful images.
* ARIA attributes where appropriate.
* Do not rely only on color to communicate state.

## Forms

Every input should have:

* Associated label.
* Error state.
* Help text where applicable.

## Interactive Components

Buttons, links, dialogs, drawers, menus, and tabs should be keyboard accessible.

---

# 20. Mobile UI

Mobile should be treated as a first-class experience rather than a reduced desktop version.

## Bottom Navigation

Recommended primary destinations:

```text
┌────────────────────────────────────────────┐
│ Home │ Trips │ Discover │ Calendar │ Profile│
└────────────────────────────────────────────┘
```

Community may be placed under Discover depending on final navigation priorities.

## Mobile Dashboard

Stack:

1. Welcome.
2. Plan New Trip.
3. Upcoming Trip.
4. Recent Trips.
5. Destination Discovery.
6. Budget Summary.

## Mobile Trip Builder

Use a vertically structured experience:

```text
Trip Header
   ↓
Trip Stops
   ↓
Day 1
   ├── Activity
   ├── Activity
   └── Add Activity
   ↓
Day 2
   ├── Activity
   └── Add Activity
```

## Mobile Activity Editor

Prefer a bottom sheet/drawer containing:

* Activity.
* Date.
* Time.
* Cost.
* Notes.
* Save.

## Mobile Budget

Stack financial information:

```text
Planned Budget
Estimated Cost
Remaining
Category Breakdown
Expense List
```

## Mobile Calendar

Use:

* Compact month selector.
* Selected-day itinerary.
* Vertical activity timeline.

## Mobile Tables

Tables should transform into:

* Cards.
* Stacked rows.
* Horizontal scrolling when tabular comparison is essential.

---

# 21. UI Interaction Standards

All screens should follow common interaction behavior.

## Primary Actions

Each screen should have a clearly identifiable primary action.

Examples:

* Dashboard → Plan New Trip.
* My Trips → Create Trip.
* City Search → Add to Trip.
* Activity Search → Add to Itinerary.
* Itinerary Builder → Save.
* Budget → Add Expense.
* Community → View/Copy Trip.

## Destructive Actions

Delete actions must:

* Require confirmation.
* Clearly identify what will be deleted.
* Explain irreversible consequences where applicable.

## Navigation

Users should always have a clear way to:

* Return to the previous context.
* Return to the parent module.
* Access primary navigation.

## Unsaved Changes

When a form/editor contains unsaved changes:

* Display an unsaved state.
* Prevent accidental navigation where practical.
* Ask for confirmation before discarding meaningful changes.

---

# 22. Screen-to-Feature Mapping

| Screen            | Primary Features                                    |
| ----------------- | --------------------------------------------------- |
| Home              | Product introduction, discovery, authentication CTA |
| Login             | Authentication                                      |
| Register          | Account creation                                    |
| Dashboard         | Trip summary, recommendations, quick actions        |
| My Trips          | Trip listing, search, filter, sorting               |
| Create Trip       | Trip creation                                       |
| Trip Detail       | Trip overview, itinerary/budget/share access        |
| City Search       | Destination discovery                               |
| Activity Search   | Activity discovery                                  |
| Itinerary Builder | Destination and activity planning                   |
| Itinerary View    | Day-wise itinerary                                  |
| Budget            | Expense and budget management                       |
| Calendar          | Date and timeline visualization                     |
| Community         | Shared trips and travel discovery                   |
| Public Itinerary  | Read-only shared trip                               |
| Profile           | User profile and preferences                        |
| Settings          | Account and preferences                             |
| Admin Dashboard   | Users, trips, analytics                             |

---

# 23. UI State Requirements

Every major screen should define the following states:

### Default State

Normal loaded content.

### Loading State

Content is being retrieved.

### Empty State

No data exists.

### Error State

Data could not be loaded.

### Success State

Requested action completed successfully.

### Unauthorized State

User authentication is missing or invalid.

### Forbidden State

User is authenticated but lacks permission.

### Not Found State

Requested resource does not exist.

### Offline / Connectivity State

The application cannot currently reach backend services.

---

# 24. UI Definition of Done

A screen is considered complete when:

* [ ] Layout implemented.
* [ ] Required components implemented.
* [ ] Navigation implemented.
* [ ] Primary actions implemented.
* [ ] Forms and validation implemented.
* [ ] Loading state implemented.
* [ ] Empty state implemented.
* [ ] Error state implemented.
* [ ] Success state implemented.
* [ ] Permission behavior implemented.
* [ ] Responsive behavior implemented.
* [ ] Accessibility reviewed.
* [ ] API integration completed.
* [ ] Mobile behavior verified.
* [ ] Visual consistency with `Design.md` verified.

---

# 25. Relationship Between Design.md and UI.md

The two documents must remain separate.

### Design.md

Defines **how the application should look**:

* Colors.
* Typography.
* Spacing.
* Grid.
* Components.
* Visual identity.
* Design principles.
* Responsive design rules.

### UI.md

Defines **what each application screen contains and how it behaves**:

* Pages.
* Sections.
* Components used on each page.
* Forms.
* Tables.
* Modals.
* User actions.
* Loading states.
* Error states.
* Empty states.
* Screen-specific responsive behavior.

Therefore:

**Design.md = Design System**

**UI.md = Screen & Interaction Specification**
