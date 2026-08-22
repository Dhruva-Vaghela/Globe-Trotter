# Testing Strategy & Execution Guide

## 1. Testing Strategy Overview

GlobeTrotter follows a multi-layered testing strategy to guarantee stability, security, data integrity, and usability:

```text
               / \
              /   \
             / UI  \        (End-to-End / Visual Smoke Tests)
            /-------\
           / Integr. \      (API Endpoints & DB Transactions)
          /-----------\
         / Unit Tests  \    (Utilities, Calculations, Validators)
        /---------------\
```

---

## 2. Test Classifications

### 2.1 Unit Testing
- **Target**: Pure utility functions, budget calculators, date range formatters, validation schemas (`Zod`), and isolated service methods.
- **Framework**: Vitest / Jest.
- **Key Test Cases**:
  - `calculateTripBudget()`: Verifies transport + lodging + activity cost summation.
  - `validateDateRange()`: Ensures trip end date is not before start date.
  - `authValidators`: Verifies valid email and minimum password length rules.

### 2.2 Integration Testing
- **Target**: API controllers, database interactions via Prisma, middleware chains, and authentication flows.
- **Framework**: Supertest + Vitest / Jest.
- **Key Test Cases**:
  - User registration -> Login -> JWT token return.
  - Trip creation -> Add destination stop -> Verify relational database integrity.
  - Unauthorized access attempt -> Verify `401 Unauthorized` / `403 Forbidden`.

### 2.3 UI & End-to-End Testing
- **Target**: Critical user journeys in browser environment.
- **Tools**: Playwright / Cypress.
- **Core User Journey**:
  - `Register -> Login -> Dashboard -> Create Trip -> Search City -> Add Activity -> Build Itinerary -> View Budget -> View Calendar -> Logout`

### 2.4 Security & Performance Testing
- **Security**: Verify protection against SQL injection, XSS, CSRF, IDOR (Insecure Direct Object References), and unauthorized trip edits.
- **Performance**: Lighthouse frontend audits (Target > 90 score on performance & accessibility), API latency under 200ms for core endpoints.
