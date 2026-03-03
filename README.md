#  Inventory Management SaaS — Frontend Architecture

Frontend architecture documentation for an **Inventory & Sales Management System** built using **Next.js + TypeScript**.
This project follows a **feature-driven architecture** designed to simulate a real SaaS product used by UMKM and retail stores.

---

#  Project Overview

This application allows store owners to:

* View marketing website (landing page & pricing)
* Register and login
* Subscribe to access the system
* Create their own store workspace
* Manage inventory
* Track stock in/out
* Monitor daily sales
* Generate reports

Each user owns a **private store workspace** — data is isolated per store.

---

#  Architecture Philosophy

The project uses:

* **Feature-Based Architecture**
* **Thin Page Pattern**
* **Separation of Concerns**
* **Scalable SaaS Structure**

Core principle:

```
app/        → routing & page entry
features/   → business logic + feature UI
components/ → reusable UI
lib/        → system utilities
```

---

#  Project Structure

```
src/
│
├── app/
├── features/
├── components/
├── providers/
├── lib/
├── hooks/
├── types/
├── styles/
└── middleware.ts
```

---

#  app/ — Routing Layer

Defines all website routes using **Next.js App Router**.

```
app/
├── layout.tsx
├── page.tsx
├── (marketing)/
├── (auth)/
├── onboarding/
└── (dashboard)/
```

## Purpose

* Defines URL routes
* Composes pages
* Loads feature components

 No business logic should live here.

---

## Key Files

### `layout.tsx`

Root layout:

* Inject global providers
* Apply global styles

### `page.tsx`

Landing route `/`.

```tsx
return <LandingPage />
```

---

## Route Groups

### `(marketing)`

Public pages:

* landing
* pricing
* features
* about

Accessible without login.

---

### `(auth)`

Authentication pages:

* login
* register

---

### `onboarding`

Executed after first login.

User creates:

* store name
* business type

Creates workspace identity.

---

### `(dashboard)`

Protected application area:

* Dashboard overview
* Products
* Transactions
* Reports
* Settings

---

#  features/ — Business Domains 

Each folder represents a **product feature**.

```
features/
├── marketing/
├── auth/
├── workspace/
├── inventory/
├── transactions/
└── reports/
```

---

##  marketing/

Landing website components.

```
landing/
├── LandingPage.tsx
├── components/
└── data/
```

### Files

* `LandingPage.tsx` → Composes landing sections
* `HeroSection.tsx` → Product introduction
* `FeatureSection.tsx` → Benefits explanation
* `PricingPreview.tsx` → Pricing overview
* `CTASection.tsx` → Call-to-action
* `landing.data.ts` → Static marketing data

---

##  auth/

Authentication system.

```
auth/
├── components/
├── hooks/
├── services/
├── auth.store.ts
└── types.ts
```

### Responsibilities

* Login & register
* Session handling
* Token storage

Key files:

| File             | Purpose           |
| ---------------- | ----------------- |
| LoginForm.tsx    | Login UI          |
| RegisterForm.tsx | Signup UI         |
| useAuth.ts       | Auth logic        |
| auth.api.ts      | API calls         |
| auth.store.ts    | Global auth state |

---

##  workspace/

Represents a user's store.

```
workspace/
├── WorkspaceForm.tsx
├── useWorkspace.ts
└── workspace.api.ts
```

Flow:

```
Login → Create Store → Dashboard Access
```

---

##  inventory/

Core inventory management.

```
inventory/
├── components/
├── hooks/
├── services/
└── types.ts
```

### Features

* Create products
* Edit products
* Track stock
* Category grouping

Key components:

* ProductTable.tsx
* ProductForm.tsx
* StockBadge.tsx

Hooks:

* useProducts()
* useCreateProduct()
* useUpdateProduct()

---

##  transactions/

Handles sales and restocking.

```
transactions/
├── StockOutForm.tsx
├── StockInForm.tsx
├── TransactionTable.tsx
├── useTransactions.ts
└── transaction.api.ts
```

Logic:

```
Sell product → stock decreases automatically
```

---

##  reports/

Sales analytics & reporting.

```
reports/
├── SalesSummary.tsx
├── RevenueCard.tsx
├── SalesChart.tsx
└── useReports.ts
```

Displays:

* daily revenue
* product performance
* sales charts

---

#  components/ui/ — Reusable UI

Generic components used across features.

```
components/ui/
├── Button.tsx
├── Input.tsx
├── Modal.tsx
├── Table.tsx
├── Card.tsx
├── Badge.tsx
├── Spinner.tsx
└── ConfirmDialog.tsx
```

Rules:

* No business logic
* Pure visual components

---

#  providers/

Global React providers.

```
providers/
├── QueryProvider.tsx
├── AuthProvider.tsx
└── ThemeProvider.tsx
```

Responsibilities:

* React Query setup
* Authentication context
* Theme management

---

#  lib/

Core utilities and configurations.

```
lib/
├── api.ts
├── queryClient.ts
├── constants.ts
├── utils.ts
└── env.ts
```

Examples:

* Axios instance
* API interceptors
* helpers

---

#  hooks/

Shared reusable hooks.

```
hooks/
├── useDebounce.ts
├── usePagination.ts
└── useLocalStorage.ts
```

Used across multiple features.

---

#  types/

Global TypeScript types.

```
types/
├── user.ts
├── api.ts
└── common.ts
```

---

#  styles/

Global styling.

```
styles/
├── globals.css
└── variables.css
```

---

#  proxy.ts

Route protection logic.

Example rules:

```
if not logged in → /login
if no subscription → /pricing
if no workspace → /onboarding
```

---

# 🔄 Data Flow Example (Selling Product)

```
User clicks Sell
      ↓
StockOutForm
      ↓
useCreateTransaction()
      ↓
transaction.api.ts
      ↓
Backend updates stock
      ↓
React Query invalidates cache
      ↓
ProductTable re-renders automatically
```

No page reload required.

---

# 🧠 Engineering Principles Applied

* Feature-driven design
* Domain separation
* Scalable component hierarchy
* Server-state management via React Query
* SaaS-ready architecture

---

# 🚀 Result

This architecture enables:

* Multi-store isolation
* Scalable feature growth
* Maintainable codebase
* Production-ready frontend structure

---

**Status:** Startup-level MVP Architecture
**Purpose:** Portfolio + Real SaaS Simulation

---









[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/-nyOcXJT)