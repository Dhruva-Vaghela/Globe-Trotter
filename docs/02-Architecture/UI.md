# UI Architecture & Design System — Minimal, Product-Heavy Consumer Tech Specification

This document defines the UI/UX architecture and design system for **GlobeTrotter**. It enforces a **production-grade consumer product aesthetic** inspired by the usability, information density, and simplicity of top Indian tech platforms such as **Swiggy, Zomato, and Goibibo**.

---

## 1. Design Philosophy

> **Core Principle:** Minimal UI, maximum product clarity. Use imagery, typography, spacing, and content hierarchy instead of excessive cards, pills, gradients, and decorative components.

### Inspiration & Principles
1. **Product-Heavy over Dashboard-Heavy**: Focus on actionable travel items (destinations, tours, prices, ratings, dates) rather than generic admin widgets.
2. **High Information Density**: Present key metadata at a glance (e.g. ₹3,500/person · 4 Hours · ⭐ 4.9 · Goa) so users can make instant decisions.
3. **Image-Led Experiences**: Real photography does the heavy lifting rather than decorative icons and background boxes.
4. **Familiarity & Trust**: Clean, functional interfaces built for speed, scannability, and high conversion.

---

## 2. Elimination of "AI-Generated UI" Anti-Patterns

To ensure GlobeTrotter looks like an intentionally shipped product by senior product designers, the following anti-patterns are strictly forbidden:

| Forbidden AI Anti-Pattern | Required Product Approach |
| :--- | :--- |
| **Glassmorphism / Backdrop Blurs** | Solid, opaque `#FFFFFF` cards and `#F9FAFB` surface panels with clean 1px borders (`#E5E7EB`). |
| **Purple / Neon Gradient Palettes** | Restrained palette: Charcoal text (`#111827`), Muted gray (`#4B5563`), Deep Blue (`#2563EB`), Crimson accent (`#E11D48`). |
| **Pills for Everything** | Rectangular buttons (`var(--radius-sm)` = 6px). Reserve pill shapes strictly for interactive category filter tags. |
| **Cards Inside Cards** | Flat section layouts separated by whitespace, subtle dividers, and clean typography hierarchy. |
| **Hero Marketing Wall-of-Text** | Compact top header navigation and direct category/product discovery rails. |
| **Fake Image Placeholders (`/placeholder.jpg`)** | Mandatory high-resolution real Unsplash URLs (`https://images.unsplash.com/...`). |
| **Decorative Floating Containers** | Flush grid cards with consistent 16:9 or 4:3 image ratios and clear CTA hierarchy. |

---

## 3. Color System

Color is used strictly to establish hierarchy and emphasize product status, never for pure decoration.

| Token Name | Hex Code | Usage / Context |
| :--- | :--- | :--- |
| `--bg-canvas` | `#F9FAFB` | Main application background (Clean Slate Off-White) |
| `--bg-surface` | `#FFFFFF` | Product cards, headers, modal dialog containers |
| `--text-primary` | `#111827` | Headings, titles, prices, primary labels |
| `--text-secondary` | `#4B5563` | Body copy, secondary metadata, locations |
| `--text-muted` | `#9CA3AF` | Captions, dates, inactive indicators |
| `--border-subtle` | `#E5E7EB` | 1px card borders and horizontal section dividers |
| `--brand-primary` | `#2563EB` | Primary CTA buttons, active tab indicators, links (Goibibo Blue) |
| `--brand-accent` | `#E11D48` | Ratings ⭐ highlights, discount tags, price highlights (Crimson) |
| `--status-success` | `#059669` | Booking confirmed, active status tags |
| `--status-warning` | `#D97706` | Pending, limited seats remaining |

---

## 4. Curated Unsplash Image Asset Registry

All imagery across GlobeTrotter must pull from real, high-resolution Unsplash assets. Fake paths (`/placeholder.jpg`) or placeholder services are prohibited.

| Destination / Experience | Direct Unsplash URL | Aspect Ratio |
| :--- | :--- | :--- |
| **Goa (Beaches & Palms)** | `https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80` | 16:9 |
| **Paris (Eiffel & Cityscape)** | `https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80` | 16:9 |
| **Kyoto (Shrines & Bamboo)** | `https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80` | 16:9 |
| **Bali (Rice Terraces & Villas)** | `https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80` | 16:9 |
| **Tokyo (Shinjuku Night Lights)** | `https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80` | 16:9 |
| **Scuba Diving Experience** | `https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80` | 4:3 |
| **Food & Dining Walk** | `https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80` | 4:3 |
| **Heritage Temple Walk** | `https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=800&q=80` | 4:3 |

---

## 5. Typography Scale

Clean sans-serif typography (`Inter` / system font stack) prioritizing legibility:

- **Page Heading (`h1`)**: `1.75rem` (28px), Weight `800`, Line-height `1.2`, Charcoal (`#111827`).
- **Section Heading (`h2`)**: `1.25rem` (20px), Weight `700`, Line-height `1.3`, Charcoal (`#111827`).
- **Product Title (`h3`)**: `1.05rem` (16.8px), Weight `700`, Line-height `1.35`.
- **Body Text**: `0.875rem` (14px), Weight `400`, Line-height `1.5`, Dark Gray (`#4B5563`).
- **Metadata / Microcopy**: `0.775rem` (12.4px), Weight `600`, Muted Gray (`#9CA3AF`).

---

## 6. Component Standards

### Product Cards
- **Container**: White background (`#FFFFFF`), 1px solid border (`#E5E7EB`), border-radius `6px` (`var(--radius-sm)`).
- **Image Banner**: Top position, fixed aspect ratio (`16:9`), `object-fit: cover`.
- **Card Content**: 1rem padding, structured row for title + price + rating.

### Buttons & Controls
- **Primary Buttons**: Rectangular with `6px` radius (`var(--radius-sm)`), background `#2563EB`, text `#FFFFFF`, compact padding (`0.5rem 1rem`).
- **Secondary Buttons**: Background `#F3F4F6`, border `1px solid #E5E7EB`, text `#111827`.
- **Filter Tags**: Pill-shaped (`var(--radius-full)`), used strictly for multi-select category chips.

### Navigation Header
- **Top Header**: Clean logo, Location selector (`📍 Goa ▾`), compact command search, user avatar.
- **Sub-Header Rail**: Category filter pills (*All, Beaches, Heritage, Treks, Food Walks*).

---

## 7. Final Quality Bar Checklist

Before finalizing any screen, verify against the following 10 checks:

1. ✅ Does this look like a real consumer product shipped by Swiggy/Goibibo/Zomato?
2. ✅ Is all UI decoration removed (no glassmorphism, no artificial floating drop shadows)?
3. ✅ Are cards used selectively without nesting cards inside cards?
4. ✅ Are pill controls restricted strictly to interactive filter tags?
5. ✅ Are high-resolution Unsplash images doing the visual heavy lifting?
6. ✅ Is the color palette restrained to Charcoal, Off-white, Goibibo Blue, and Crimson?
7. ✅ Is information density high (Prices, Ratings, Durations clearly visible)?
8. ✅ Is the primary action/CTA immediately obvious within 2 seconds?
9. ✅ Does the design feel human-crafted rather than component-library generated?
10. ✅ Does every UI element directly serve a user decision or task?
