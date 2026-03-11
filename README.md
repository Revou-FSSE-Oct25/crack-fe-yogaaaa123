# 💎 CrackPOS — Inventory & Point of Sale System

A production-ready frontend for an Inventory Management and Point of Sale (POS) system, built with **Next.js 16 App Router** and designed for seamless integration with a NestJS backend.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 4 |
| State Management | Zustand (client cart state) |
| Server Data Fetching | TanStack React Query |
| Forms & Validation | React Hook Form + Zod 4 |
| Auth Gateway | `proxy.ts` (Next.js 16 middleware replacement) |
| JWT Verification | jose (Edge-compatible) |

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.3+
- Node.js 20+ (for Next.js compatibility)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd crack-fe-yogaaaa123

# Install dependencies
bun install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Backend API base URL
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# JWT secret (must match the NestJS backend)
JWT_SECRET=your-jwt-secret-key-here
```

### Development

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build

```bash
bun run build
bun run start
```

---

## Project Architecture

The project follows a **feature-based architecture** with strict separation between UI components, domain logic, and infrastructure.

```
src/
├── app/                        # App Layer — Next.js App Router
│   ├── (auth)/login/           # → /login (public)
│   ├── dashboard/
│   │   ├── layout.tsx          # Dashboard shell (Server Component)
│   │   ├── admin/              # Admin routes
│   │   │   ├── page.tsx        # → /dashboard/admin
│   │   │   ├── products/       # → /dashboard/admin/products
│   │   │   └── reports/        # → /dashboard/admin/reports
│   │   └── cashier/            # Employee routes
│   │       ├── page.tsx        # → /dashboard/cashier
│   │       └── transaction/    # → /dashboard/cashier/transaction
│   └── layout.tsx              # Root layout (AppProviders)
│
├── components/                 # Component Layer — Shared UI
│   ├── ui/                     # Button, Input, Modal, DataTable
│   ├── layouts/                # Sidebar, DashboardHeader
│   └── providers/              # AppProviders (QueryClientProvider)
│
├── features/                   # Feature Layer — Domain Logic
│   ├── auth/                   # Login form, mutation, schema
│   ├── products/               # CRUD, search, product cards
│   └── transactions/           # Cart (Zustand), checkout, history
│
├── infrastructure/             # Infrastructure Layer — Global Utilities
│   ├── api/                    # API client, response/error types
│   ├── events/                 # SSE inventory sync
│   └── utils/                  # Constants, formatters
│
└── proxy.ts                    # Auth gateway (JWT + RBAC)
```

---

## Routing & Authentication

### Route Map

| Route | Access | Description |
|---|---|---|
| `/login` | Public | Login page |
| `/dashboard/admin` | Admin only | Overview with stats |
| `/dashboard/admin/products` | Admin only | Product management (CRUD) |
| `/dashboard/admin/reports` | Admin only | Sales reports |
| `/dashboard/cashier` | Employee only | POS terminal (product grid + cart) |
| `/dashboard/cashier/transaction` | Employee only | Transaction history |

### Authentication Flow

1. User submits credentials on `/login`
2. NestJS backend validates and returns JWT via `Set-Cookie` header
3. Client redirects to the appropriate dashboard based on user role
4. `proxy.ts` intercepts all subsequent requests:
   - Verifies JWT from `auth_token` cookie
   - Redirects unauthenticated users to `/login`
   - Enforces role-based access (Admin ↔ Employee)
   - Forwards `x-user-role` and `x-user-id` headers to Server Components

### Role-Based Access Control

```
proxy.ts (Edge Layer)
  ├── Admin trying /dashboard/cashier/* → redirect to /dashboard/admin
  ├── Employee trying /dashboard/admin/* → redirect to /dashboard/cashier
  └── Unauthenticated → redirect to /login
```

---

## Backend Integration Patterns

### 1. Standardized API Contracts

Every API call uses a unified response shape:

```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: { currentPage, totalPages, totalItems, perPage };
}

interface ApiError {
  errorCode: string;   // e.g. 'ERR_INSUFFICIENT_STOCK'
  message: string;
  validationErrors?: Record<string, string[]>;
}
```

> The NestJS backend only needs a single generic response interceptor.

### 2. Idempotency Keys

All mutation requests (`POST`, `PUT`, `PATCH`) automatically attach a UUID `Idempotency-Key` header to prevent duplicate transactions from network retries or double-clicks.

### 3. URL-Driven State

Table filters, search, sorting, and pagination are stored in URL search params (`?page=1&search=coffee&sort=price_desc`), NOT in client state. Benefits:
- Page refresh preserves filters
- Deep-linking works out of the box
- NestJS backend can bind query params directly with `@Query()` decorators

### 4. Symmetrical Zod Validation

Frontend Zod schemas document NestJS class-validator decorators in comments:

```typescript
// Frontend (Zod)
price: z.number().int().positive()

// NestJS equivalent (class-validator):
// @IsInt() @Min(1) price: number;
```

### 5. Real-Time Sync (SSE Ready)

The `useInventorySync` hook listens for `STOCK_UPDATED` events via Server-Sent Events and automatically invalidates TanStack Query caches, preventing overselling across terminals.

---

## Cart System

The cart is managed by a **Zustand store** (`useCartStore`) with the following capabilities:

| Action | Description |
|---|---|
| `addItem(product)` | Adds product to cart (or increments quantity, capped at stock) |
| `removeItem(productId)` | Removes item from cart |
| `updateQuantity(productId, qty)` | Sets quantity (auto-removes if 0, capped at stock) |
| `clearCart()` | Empties the cart |
| `getTotalPrice()` | Calculates sum of `price × quantity` |
| `getItemCount()` | Returns total number of items |

Checkout sends `POST /transactions` with an `Idempotency-Key` header, then clears the cart and refreshes product stock.

---

## Key Dependencies

| Package | Version | Purpose |
|---|---|---|
| `next` | 16.1.6 | Framework |
| `react` | 19.2.3 | UI library |
| `zustand` | 5.x | Client state (cart) |
| `@tanstack/react-query` | 5.x | Server state / data fetching |
| `react-hook-form` | 7.x | Form management |
| `@hookform/resolvers` | 5.x | Zod ↔ RHF bridge |
| `zod` | 4.x | Schema validation |
| `jose` | 6.x | Edge-compatible JWT verification |
| `uuid` | 13.x | Idempotency key generation |
| `tailwindcss` | 4.x | Styling |

---

## Scripts

```bash
bun run dev      # Start development server (Turbopack)
bun run build    # Production build
bun run start    # Start production server
bun run lint     # Run ESLint
```

---

## License

This project is part of the Crack Final Project.