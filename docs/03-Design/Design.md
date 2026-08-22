# Design

# 1. Design Overview

GlobeTrotter's design system defines the visual language, interaction patterns, component behavior, layout principles, and responsive rules used throughout the application.

The design should communicate:

* Travel and exploration.
* Simplicity.
* Personalization.
* Reliability.
* Modern productivity.
* Visual organization.
* Calm and intuitive trip planning.

The design system should remain consistent across:

* Public pages.
* Authentication.
* Dashboard.
* Trip management.
* Itinerary planning.
* Budget management.
* Calendar.
* Community.
* Profile/settings.
* Administration.

`Design.md` defines the visual system. Specific screens and their content are defined in `UI.md`.

---

# 2. Design Objectives

## Clarity

Important travel information such as dates, destinations, activities, and costs must be immediately understandable.

## Simplicity

The interface should minimize visual and interaction complexity while still supporting advanced trip planning.

## Discoverability

Destinations, activities, community content, and planning tools should be easy to find.

## Consistency

The same interaction and visual patterns should be reused across the platform.

## Personalization

The interface should feel personal without becoming visually cluttered.

## Responsiveness

The design system must work consistently across desktop, tablet, and mobile devices.

## Accessibility

Visual choices must support users with different accessibility needs.

---

# 3. Design Philosophy

GlobeTrotter follows a **modern travel-productivity design philosophy**.

## Core Principles

### Plan Visually

Dates, locations, and activities should be presented in a way that helps users understand the journey at a glance.

### Reduce Cognitive Load

Complex planning operations should be broken into understandable sections.

### Progressive Disclosure

Show the most important information first and expose secondary information when needed.

### Action-Oriented Design

Primary actions should always be obvious.

### Information Hierarchy

The visual hierarchy should clearly distinguish:

1. Page title.
2. Primary information.
3. Secondary information.
4. Supporting metadata.
5. Actions.

### Visual Calm

The design should avoid excessive decoration, unnecessary shadows, excessive colors, and crowded interfaces.

---

# 4. Brand / Visual Identity

## Brand Personality

GlobeTrotter should feel:

* Adventurous.
* Friendly.
* Intelligent.
* Organized.
* Trustworthy.
* Modern.
* Approachable.

## Visual Direction

The visual identity should combine:

**Travel Inspiration + Modern SaaS/Productivity**

The interface should not resemble a traditional booking website or an overly corporate dashboard.

## Imagery

Images should emphasize:

* Destinations.
* Landscapes.
* Architecture.
* Local experiences.
* Food.
* Cultural activities.
* Travel moments.

## Image Treatment

Images should generally:

* Have consistent aspect ratios.
* Use appropriate cropping.
* Maintain visual quality.
* Avoid excessive overlays.
* Use overlays only when required to maintain text readability.

## Iconography

Icons should be:

* Simple.
* Consistent.
* Recognizable.
* Minimal.
* Used to support labels rather than replace important text.

---

# 5. Color System

The color system should be defined using semantic roles rather than hard-coded colors throughout the application.

## Primary Colors

The primary brand color should be used for:

* Primary buttons.
* Active navigation.
* Important links.
* Selected states.
* Key interactive elements.

Suggested semantic tokens:

```text
--color-primary
--color-primary-hover
--color-primary-active
--color-primary-subtle
```

## Neutral Colors

Neutral colors form the majority of the interface.

```text
--color-background
--color-surface
--color-surface-secondary
--color-border
--color-text-primary
--color-text-secondary
--color-text-muted
```

## Status Colors

Status colors should be semantic.

```text
--color-success
--color-warning
--color-error
--color-info
```

### Usage

**Success**

* Successful operations.
* Completed states.
* Positive budget status.

**Warning**

* Budget approaching limit.
* Pending action.
* Attention-required states.

**Error**

* Failed operations.
* Validation errors.
* Destructive states.

**Info**

* Informational messages.
* Neutral system notices.

## Color Rules

* Do not use color as the only indicator of meaning.
* Status labels should include text or icons.
* Avoid using many accent colors simultaneously.
* Primary color should remain visually dominant.
* Decorative colors should not compete with critical actions.

---

# 6. Typography

Typography should prioritize readability and clear hierarchy.

## Font Family

The final font family should be selected during implementation and documented here once finalized.

Recommended characteristics:

* Modern sans-serif.
* Excellent screen readability.
* Multiple weights.
* Good numeric readability.
* Strong support for dates and financial values.

## Type Scale

A consistent type scale should be used.

Example:

| Token          | Purpose                     |
| -------------- | --------------------------- |
| `display-xl` | Major landing-page headings |
| `display-lg` | Large page hero heading     |
| `heading-xl` | Main page heading           |
| `heading-lg` | Section heading             |
| `heading-md` | Card/subsection heading     |
| `heading-sm` | Small heading               |
| `body-lg`    | Large body/important text   |
| `body-md`    | Standard body text          |
| `body-sm`    | Supporting text             |
| `caption`    | Metadata/helper text        |

## Font Weights

Recommended:

* Regular — body.
* Medium — labels and navigation.
* Semibold — headings and primary emphasis.
* Bold — major emphasis only.

## Typography Rules

* Avoid excessive font-weight variation.
* Do not use all-caps for large amounts of text.
* Keep line lengths readable.
* Use tabular or consistent numeric formatting for financial values where appropriate.

---

# 7. Spacing System

A consistent spacing scale must be used instead of arbitrary margins.

Recommended base unit:

**4px**

Example scale:

```text
4
8
12
16
20
24
32
40
48
64
80
96
```

## Usage

### Small spacing

Used for:

* Icon-to-label gaps.
* Form elements.
* Inline metadata.

### Medium spacing

Used for:

* Card sections.
* Form groups.
* Navigation items.

### Large spacing

Used for:

* Major page sections.
* Dashboard sections.
* Hero areas.
* Page separation.

## Spacing Rules

* Related elements should be closer together.
* Unrelated sections should have larger separation.
* Avoid inconsistent spacing between repeated components.

---

# 8. Grid System

The grid system should provide consistent alignment across the application.

## Desktop

Use a responsive 12-column grid where appropriate.

```text
| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
```

## Tablet

Use a reduced column structure as required by content.

## Mobile

Use a single-column primary layout.

## Container

Content should be centered within a maximum-width container.

Example:

```text
┌────────────────────────────────────────────────────────────┐
│                    Application Container                   │
│                                                            │
│                    Page Content                            │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## Grid Rules

* Maintain consistent gutters.
* Keep related content aligned.
* Avoid overly wide text areas.
* Allow tables and large visualizations to use more available width.

---

# 9. Layout System

## Public Layout

Public pages use a marketing/content-oriented layout.

```text
Header
   ↓
Main Content
   ↓
Sections
   ↓
Footer
```

## Application Layout

Authenticated pages use a product shell.

```text
┌──────────── Sidebar ───────────┐
│                                │
│ Navigation                     │
│                                │
└────────────────────────────────┘
               +
        Main Content Area
```

## Page Header

Standard page headers should contain:

* Breadcrumb/context where useful.
* Page title.
* Supporting description.
* Primary action.
* Optional secondary actions.

## Content Sections

Use consistent section spacing.

Example:

```text
Page Header

Section
  Content

Section
  Content

Section
  Content
```

## Layout Principles

* Keep navigation predictable.
* Keep primary actions near their relevant content.
* Avoid unnecessary nesting.
* Use whitespace to separate concepts.
* Maintain consistent alignment.

---

# 10. Component Design

Components should be designed as reusable building blocks.

## Core Components

* Button.
* Input.
* Text area.
* Select.
* Search field.
* Date picker.
* Time picker.
* Checkbox.
* Radio group.
* Toggle.
* Card.
* Badge.
* Avatar.
* Modal.
* Drawer.
* Tooltip.
* Dropdown.
* Table.
* Tabs.
* Pagination.
* Toast.
* Alert.
* Skeleton.
* Empty state.

## Component States

Interactive components should define:

* Default.
* Hover.
* Focus.
* Active.
* Disabled.
* Loading.
* Error.
* Selected where applicable.

## Component Consistency

A component should behave consistently wherever it appears.

For example, the same button hierarchy should be used on:

* Trip pages.
* Itinerary pages.
* Budget pages.
* Community pages.

---

# 11. Button Design

Buttons communicate action hierarchy.

## Primary Button

Used for the main action of a screen.

Examples:

* Plan New Trip.
* Create Trip.
* Save.
* Add Activity.
* Publish.

## Secondary Button

Used for supporting actions.

Examples:

* Cancel.
* View Details.
* Edit.

## Tertiary / Ghost Button

Used for lightweight actions.

Examples:

* Back.
* Clear Filter.
* More Details.

## Destructive Button

Used for irreversible actions.

Examples:

* Delete Trip.
* Delete Account.

## Icon Button

Used for compact contextual actions.

Examples:

* More.
* Close.
* Edit.
* Delete.
* Search.

## Button Rules

* Primary actions should be visually dominant.
* Do not use multiple primary buttons for unrelated actions in the same area.
* Destructive actions should require confirmation when necessary.
* Buttons should have clear labels.
* Loading state should prevent duplicate submission.

---

# 12. Form Design

Forms should prioritize clarity and completion speed.

## Field Structure

```text
Label
Input
Help / Supporting Text
Validation Message
```

## Labels

Labels should remain visible rather than relying solely on placeholders.

## Required Fields

Required fields should be clearly indicated.

## Validation

Validation should be:

* Clear.
* Specific.
* Near the relevant field.
* Actionable.

Example:

```text
End Date
[ 2026-06-05 ]

End date must be on or after the start date.
```

## Form Layout

Group logically related information.

### Trip Details

* Name.
* Description.
* Dates.
* Cover image.

### Preferences

* Language.
* Currency.
* Budget.
* Travel style.

## Date Inputs

Travel dates should use appropriate date-picker components.

## Currency Inputs

Currency inputs should clearly display:

* Amount.
* Currency code.

---

# 13. Table Design

Tables are primarily for administration and structured expense information.

## Table Structure

```text
Header
────────────────────────────────────────
Row
Row
Row
────────────────────────────────────────
Pagination
```

## Table Rules

* Use concise column labels.
* Right-align numerical/financial values where appropriate.
* Align dates consistently.
* Keep actions in a dedicated area.
* Avoid unnecessary columns.
* Use pagination for large data sets.
* Provide empty and loading states.

## Responsive Tables

On mobile:

* Convert rows to cards where possible.
* Allow horizontal scrolling where comparison is essential.
* Preserve access to important actions.

---

# 14. Card Design

Cards provide visual grouping for travel-related objects.

## General Card Structure

```text
┌──────────────────────────────┐
│ Image / Header               │
├──────────────────────────────┤
│ Title                        │
│ Supporting information       │
│ Metadata                     │
├──────────────────────────────┤
│ Actions                      │
└──────────────────────────────┘
```

## Trip Cards

Emphasize:

* Trip name.
* Dates.
* Destinations.
* Status.

## Destination Cards

Emphasize:

* Destination image.
* City.
* Country.
* Cost.
* Popularity.

## Activity Cards

Emphasize:

* Activity image.
* Activity title.
* Duration.
* Cost.
* Category.

## Card Rules

* Keep card content focused.
* Use consistent image ratios.
* Do not overload cards with actions.
* Maintain consistent internal spacing.

---

# 15. Modal / Drawer Design

## Modal

Use for:

* Confirmation.
* Short forms.
* Focused actions.
* Quick selection.

## Drawer

Use for:

* Detailed contextual information.
* Filters.
* Mobile navigation.
* Extended quick editing.

## Modal Structure

```text
Title
Supporting text
Content
Secondary Action    Primary Action
```

## Destructive Confirmation

Should include:

* Clear title.
* Explanation of consequence.
* Cancel action.
* Destructive confirmation action.

## Interaction Rules

* Preserve context behind the modal/drawer.
* Prevent accidental dismissal during important actions when appropriate.
* Support keyboard interaction.
* Provide accessible focus management.

---

# 16. Badge / Status Design

Badges provide concise state information.

## Trip Status

Possible statuses:

* Upcoming.
* Ongoing.
* Completed.

## Visibility

* Private.
* Public.

## Budget

* Under Budget.
* Near Limit.
* Over Budget.

## Generic Status

* Active.
* Inactive.
* Draft.
* Published.
* Pending.

## Rules

* Status text must remain understandable without color.
* Use consistent badge styling.
* Do not use too many statuses.
* Status colors should follow the semantic color system.

---

# 17. Navigation Design

## Primary Navigation

Authenticated users should have predictable navigation to:

* Dashboard.
* My Trips.
* Discover.
* Community.
* Calendar.
* Saved Destinations.
* Settings.

## Secondary Navigation

Context-specific navigation may include:

* Trip Overview.
* Itinerary.
* Budget.
* Calendar.
* Share.

## Navigation States

Navigation items should support:

* Default.
* Hover.
* Active.
* Focus.
* Disabled where applicable.

## Active Navigation

The active section should be visually identifiable without relying only on color.

## Breadcrumbs

Breadcrumbs should be used when users navigate deeply into hierarchical content.

Example:

```text
My Trips / European Summer Trip / Itinerary
```

---

# 18. Dashboard Design

The Dashboard should act as a personalized travel command center.

## Visual Hierarchy

Priority should generally follow:

1. Welcome/context.
2. Primary action.
3. Upcoming trip.
4. Recent trips.
5. Discovery.
6. Budget insights.
7. Additional recommendations.

## Dashboard Cards

Cards may represent:

* Upcoming trip.
* Recent trips.
* Saved destinations.
* Budget status.
* Recommendations.

## Dashboard Density

The dashboard should remain visually calm.

Avoid:

* Too many charts.
* Excessive KPIs.
* Large amounts of secondary information.
* Multiple competing primary actions.

## Data Visualization

Charts should be:

* Simple.
* Clearly labeled.
* Easy to interpret.
* Supported by text summaries.

---

# 19. Page Design Patterns

These patterns define reusable visual structures rather than specific application pages.

## Overview Page

Used when summarizing a module.

```text
Page Header
     ↓
Summary
     ↓
Primary Content
     ↓
Secondary Content
```

## List Page

```text
Page Header + Primary Action
     ↓
Search / Filters
     ↓
List / Grid
     ↓
Pagination
```

## Detail Page

```text
Header
     ↓
Summary
     ↓
Primary Content
     ↓
Supporting Information
     ↓
Actions
```

## Create Page

```text
Page Header
     ↓
Form Sections
     ↓
Primary / Secondary Actions
```

## Edit Page

Same structure as Create, with existing data populated.

## Settings Page

```text
Settings Navigation
      ↓
Settings Section
      ↓
Related Form
      ↓
Save
```

## Wizard / Multi-Step Page

Useful for complex workflows such as trip creation where required.

```text
Step 1 → Step 2 → Step 3 → Step 4
```

Rules:

* Show current progress.
* Allow users to go back.
* Preserve entered data.
* Validate each step.
* Clearly identify completion.

---

# 20. Responsive Rules

The design system should use responsive layouts instead of separate visual systems for each device.

## Desktop

* Multi-column layouts.
* Persistent navigation.
* Larger content containers.
* Full dashboards.
* Expanded calendar/table views.

## Tablet

* Flexible columns.
* Collapsible navigation.
* Reduced visual density.
* Responsive cards.

## Mobile

* Single-column layouts.
* Compact navigation.
* Stacked content.
* Bottom navigation or drawer.
* Full-width primary actions.
* Reduced card padding where appropriate.

## Breakpoint Strategy

Exact breakpoints should be defined by the implementation framework, but the system should support at least:

* Mobile.
* Tablet.
* Desktop.
* Large desktop.

## Responsive Priorities

When space is limited:

1. Preserve primary content.
2. Preserve primary action.
3. Preserve navigation.
4. Reduce secondary metadata.
5. Move advanced controls into menus/drawers.

---

# 21. Accessibility

Accessibility must be considered during component and layout design rather than added afterward.

## Color

* Maintain sufficient contrast.
* Never rely solely on color.
* Status should include text or icon support.

## Typography

* Maintain readable text sizes.
* Avoid overly small supporting text.
* Preserve clear hierarchy.

## Focus

Interactive elements must have visible focus indicators.

## Keyboard

All interactive components should be keyboard accessible.

## Forms

* Labels must be associated with controls.
* Errors must be identifiable.
* Required fields must be communicated.
* Help text should be programmatically associated where needed.

## Images

Meaningful images should include appropriate alternative text.

Decorative images should not interfere with screen readers.

## Motion

Animations should remain subtle and should not be required to understand application state.

Where appropriate, support reduced-motion preferences.

---

# 22. Design Principles

The following principles are mandatory for the GlobeTrotter interface.

## 1. Travel First

Travel information should remain the primary visual focus.

## 2. One Clear Primary Action

Each major interface context should have a clear primary action.

## 3. Information Before Decoration

Visual decoration must never compete with important travel information.

## 4. Consistency Over Novelty

Reuse established components instead of creating unique patterns for every screen.

## 5. Progressive Disclosure

Keep complex interfaces manageable by revealing secondary information when necessary.

## 6. Visual Hierarchy

Important information should be immediately distinguishable from supporting details.

## 7. Predictable Interaction

Users should know what will happen before they click or submit.

## 8. Responsive by Default

Every component must account for smaller screens.

## 9. Accessible by Default

Accessibility requirements are part of the base design system.

## 10. Data Clarity

Dates, times, locations, and costs must always be displayed using consistent formats.

## 11. Minimal Visual Noise

Avoid excessive borders, shadows, gradients, animations, and decorative elements.

## 12. Reusable Components

A component introduced into the design system should be reusable across multiple modules wherever the interaction is equivalent.

---

# Design Tokens

The final implementation should centralize design tokens.

Example:

```text
colors/
  primary
  secondary
  background
  surface
  border
  text
  success
  warning
  error
  info

typography/
  display
  heading
  body
  caption

spacing/
  xs
  sm
  md
  lg
  xl
  2xl

radius/
  sm
  md
  lg
  full

shadow/
  subtle
  medium
  strong

motion/
  fast
  normal
  slow
```

These tokens should be referenced by components instead of using arbitrary values repeatedly.

---

# Design System Governance

Any new UI component or visual pattern should:

1. Reuse an existing design token where possible.
2. Reuse an existing component when the interaction is equivalent.
3. Define all relevant interaction states.
4. Support responsive behavior.
5. Consider accessibility requirements.
6. Be documented before becoming a global pattern.

The purpose of `Design.md` is to ensure that GlobeTrotter feels like **one coherent product**, even as new modules and screens are added.
