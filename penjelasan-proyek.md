# Penjelasan Proyek - CrackPOS Frontend

> **CrackPOS Frontend** adalah aplikasi web untuk sistem manajemen inventaris dan Point of Sale. Dibangun dengan Next.js 16, TypeScript, Tailwind CSS 4. Terhubung ke backend NestJS.

---

## Daftar Isi
1. [Tech Stack](#-tech-stack)
2. [Struktur Folder](#-struktur-folder)
3. [Penjelasan Per File & Folder](#-penjelasan-per-file--folder)
4. [Halaman & Route](#-halaman--route)
5. [Alur Auth](#-alur-auth)
6. [Cara Jalanin](#-cara-jalanin)

---

## 🧩 Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 16 (App Router) |
| Bahasa | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 4 |
| State Management | Zustand (cart) |
| Data Fetching | TanStack React Query |
| Form | React Hook Form + Zod |
| Auth | JWT (jose) + HttpOnly Cookie + CSRF |

---

## 📁 Struktur Folder

```
src/
├── app/                              # Halaman (Next.js App Router)
│   ├── layout.tsx                    #   Layout root (HTML, font, providers)
│   ├── page.tsx                      #   Halaman utama (/)
│   ├── globals.css                   #   CSS global (Tailwind)
│   ├── login/                        #   Halaman login (belum pake (auth) group)
│   ├── register/                     #   Halaman register
│   ├── (auth)/                       #   Route group auth
│   │   └── login/                    #     Halaman login (yang dipake)
│   │       └── page.tsx              #     Form login + branding
│   ├── register/                     #   Halaman register (yang dipake)
│   │   └── page.tsx                  #     Form register
│   └── dashboard/                    #   Halaman dashboard (butuh login)
│       ├── layout.tsx                #     Layout dashboard: Sidebar + Header
│       ├── admin/                    #     Halaman admin
│       │   ├── page.tsx              #       Overview (stats + top products + trend)
│       │   ├── products/             #       Manajemen produk
│       │   │   └── page.tsx          #         Tabel produk + search + CRUD modal
│       │   ├── categories/           #       Manajemen kategori (BARU)
│       │   │   └── page.tsx          #         Tabel + CRUD modal
│       │   ├── suppliers/            #       Manajemen supplier (BARU)
│       │   │   └── page.tsx          #         Tabel + CRUD modal
│       │   └── inventory/            #       Inventaris (BARU)
│       │       └── page.tsx          #         Adjust stok + low stock alerts
│       └── cashier/                  #     Halaman kasir
│           └── page.tsx              #       POS: grid produk + cart sidebar
│
├── components/                       # Komponen UI yang dipake ulang
│   ├── ui/
│   │   ├── Button.tsx                #   Tombol (loading state, variant)
│   │   ├── Input.tsx                 #   Input form (dengan label + error)
│   │   ├── Modal.tsx                 #   Modal dialog
│   │   └── DataTable.tsx             #   Tabel generik (column definition)
│   ├── layouts/
│   │   ├── Sidebar.tsx               #   Sidebar navigasi (admin/cashier beda)
│   │   └── DashboardHeader.tsx       #   Header dashboard (role badge)
│   └── providers/
│       └── AppProviders.tsx          #   Provider React Query untuk semua halaman
│
├── features/                         # Logic bisnis per fitur
│   ├── auth/                         # 🔐 Autentikasi
│   │   ├── components/
│   │   │   ├── LoginForm.tsx         #     Form login (username + password)
│   │   │   └── RegisterForm.tsx      #     Form register (storeName + username + dll)
│   │   ├── hooks/
│   │   │   ├── useLoginMutation.ts   #     POST /auth/login
│   │   │   ├── useRegisterMutation.ts#     POST /auth/register
│   │   │   └── useLogoutMutation.ts  #     POST /auth/logout (BARU)
│   │   ├── schemas/
│   │   │   ├── loginSchema.ts        #     Validasi Zod untuk login
│   │   │   └── registerSchema.ts     #     Validasi Zod untuk register
│   │   └── types/
│   │       └── index.ts              #     TypeScript types (LoginResponse, AuthUser)
│   │
│   ├── products/                     # 📦 Produk
│   │   ├── components/
│   │   │   ├── ProductCard.tsx       #     Kartu produk (untuk POS cashier)
│   │   │   ├── ProductForm.tsx       #     Form create/edit produk
│   │   │   └── ProductSearchBar.tsx  #     Search bar (URL-driven)
│   │   ├── hooks/
│   │   │   ├── useProducts.ts        #     GET /products (pagination + search)
│   │   │   ├── useCreateProduct.ts   #     POST /products
│   │   │   ├── useUpdateProduct.ts   #     PATCH /products/:id
│   │   │   └── useDeleteProduct.ts   #     DELETE /products/:id
│   │   ├── schemas/
│   │   │   └── productSchema.ts      #     Validasi Zod untuk produk
│   │   └── types/
│   │       └── index.ts              #     Type Product, ProductQueryParams
│   │
│   ├── categories/                   # 🏷️ Kategori
│   │   ├── hooks/
│   │   │   ├── useCategories.ts      #     GET /categories
│   │   │   └── useCreateCategory.ts  #     POST/PATCH/DELETE /categories (BARU)
│   │   └── types/
│   │       └── index.ts              #     Type Category
│   │
│   ├── suppliers/                    # 🤝 Supplier (BARU)
│   │   ├── hooks/
│   │   │   ├── useSuppliers.ts       #     GET /suppliers
│   │   │   └── useCreateSupplier.ts  #     POST/PATCH/DELETE /suppliers
│   │   └── types/
│   │       └── index.ts              #     Type Supplier
│   │
│   ├── sales/                        # 🛒 Penjualan (dulu: transactions)
│   │   ├── components/
│   │   │   ├── CartSidebar.tsx       #     Sidebar keranjang (POS)
│   │   │   └── SalesOrderTable.tsx   #     Tabel riwayat penjualan + detail modal
│   │   ├── hooks/
│   │   │   ├── useCreateSalesOrder.ts#     POST /sales (checkout)
│   │   │   ├── useSalesOrders.ts     #     GET /sales
│   │   │   ├── useSalesOrderDetail.ts#     GET /sales/:id (BARU)
│   │   │   └── useCompleteSalesOrder.ts #  PATCH /sales/:id/complete|cancel (BARU)
│   │   ├── schemas/
│   │   │   └── salesOrderSchema.ts   #     Validasi Zod
│   │   ├── store/
│   │   │   └── useCartStore.ts       #     Zustand store untuk keranjang
│   │   └── types/
│   │       └── index.ts              #     Type SalesOrder, CartItem
│   │
│   ├── reports/                      # 📊 Laporan
│   │   └── hooks/
│   │       ├── useDashboardStats.ts  #     GET /dashboard/summary
│   │       ├── useTopProducts.ts     #     GET /dashboard/top-products (BARU)
│   │       ├── useSalesTrend.ts      #     GET /dashboard/sales-trend (BARU)
│   │       └── useInventoryValue.ts  #     GET /dashboard/inventory-value (BARU)
│   │
│   ├── inventory/                    # 📋 Inventaris (BARU)
│   │   ├── hooks/
│   │   │   ├── useAdjustStock.ts     #     POST /inventory/adjust
│   │   │   └── useLowStockProducts.ts#     GET /inventory/low-stock
│   │   └── types/
│   │       └── index.ts              #     Type StockAdjustment
│   │
│   └── ai/                           # 🤖 AI Chat
│       ├── components/
│       │   └── AiChatWidget.tsx      #     Floating chat bubble
│       └── hooks/
│           └── useAiChat.ts          #     Logic chat + history
│
├── infrastructure/                   # Infrastruktur global
│   ├── api/
│   │   ├── client.ts                #     API client utama (CSRF + refresh token + response wrapper)
│   │   ├── csrf.ts                   #     CSRF token fetcher + cache
│   │   ├── aiClient.ts              #     AI chat client (via NestJS proxy)
│   │   └── types.ts                 #     ApiResponse, PaginatedResponse, ApiError
│   ├── events/
│   │   └── useInventorySync.ts      #     Polling stok (30 detik refresh)
│   └── utils/
│       ├── constants.ts             #     AUTH_TOKEN_KEY, QUERY_KEYS, ROLE_HOME
│       └── formatCurrency.ts        #     Format angka ke Rp
│
└── middleware.ts                     # Proxy (Next.js 16) — JWT verify + RBAC redirect
```

---

## 📄 Penjelasan Per File & Folder

### `src/app/` — Halaman (App Router)

**`layout.tsx`** (Root)
Layout paling luar. Bungkus semua halaman dengan `<AppProviders>` yang berisi `QueryClientProvider` untuk React Query. Juga include font, metadata, CSS global.

**`login/page.tsx`**
Halaman login:
- Title: "Login — CrackPOS"
- Background gradient + card putih di tengah
- Menampilkan logo 💎 + judul CrackPOS
- Memanggil komponen `<LoginForm />`

Isi form: Username + Password

**`register/page.tsx`**
Halaman register:
- Title: "Create Account"
- Form: Store Name, Display Name, Username, Email, Password
- Link ke halaman login

**`dashboard/layout.tsx`** (Server Component)
Layout dashboard:
- Baca header `x-user-role` dari middleware (server-side)
- Kalo ga ada role → redirect ke /login
- Kalo ada → tampilkan Sidebar (kiri) + DashboardHeader (atas) + konten (tengah)
- Sidebar beda antara Admin (banyak menu) vs Staff (cuma POS)

**`dashboard/admin/page.tsx`**
Halaman utama admin:
- 4 stat cards: Total Products, Products In Stock, Revenue Today, Low Stock Items
- 2 tabel: Top Products + Sales Trend (7 hari)
- 1 card: Inventory Value
- Loading state: skeleton animation

**`dashboard/admin/products/page.tsx`**
Manajemen produk:
- Tombol "+ Add Product" → buka modal create
- Search bar (search by name/SKU)
- Tabel: Name, Price, Stock, Category, Actions (Edit/Delete)
- Klik Edit → modal form dengan data existing

**`dashboard/admin/categories/page.tsx`** (BARU)
Manajemen kategori:
- Tabel: Name, Description, Actions
- + Add Category → modal input name + description
- Edit/Delete per kategori

**`dashboard/admin/suppliers/page.tsx`** (BARU)
Manajemen supplier:
- Tabel: Name, Contact, Phone, Email, Actions
- + Add Supplier → modal: name, contact name, phone, email, address
- Edit/Delete per supplier

**`dashboard/admin/inventory/page.tsx`** (BARU)
Halaman inventaris:
- **Adjust Stock**: pilih produk, quantity (+/-), type (adjustment/damaged/lost/found/manual), notes
- **Low Stock Alerts**: tabel produk yang stoknya di bawah reorder level

**`dashboard/cashier/page.tsx`**
Halaman POS kasir:
- Kiri: grid produk (ProductCard) + search bar
- Kanan: CartSidebar (keranjang + checkout button)

### `src/components/` — UI Components

**`ui/Button.tsx`**
Tombol dengan:
- `isLoading` → spinner + disabled
- `size` → sm/md/lg
- `variant` → primary/ghost/outline
- Full width option

**`ui/Input.tsx`**
Input field dengan:
- `label` → otomatis di atas input
- `error` → tampil pesan error merah dari react-hook-form
- `type="password"` → toggle show/hide
- forwardRef untuk react-hook-form

**`ui/Modal.tsx`**
Modal dialog:
- `isOpen` + `onClose`
- Title + close button
- Children untuk konten
- Overlay klik = close

**`ui/DataTable.tsx`**
Tabel generik:
- `Column<T>` definition: header label + accessor (key atau function)
- `data` array
- `keyExtractor`
- Empty state message
- Hover effect per row

**`layouts/Sidebar.tsx`**
Sidebar navigasi:
- Brand logo + "CrackPOS"
- Menu sesuai role (admin: banyak menu, staff: cuma POS)
- Menu: Overview, Products, Categories, Suppliers, Inventory, AI Assistant
- **Logout button** di bawah (BARU)
- Active state: highlight menu yang sedang dibuka

### `src/infrastructure/api/` — API Layer

**`client.ts`** — Jantung komunikasi API
Fitur:
1. **CSRF auto-attach**: Sebelum POST/PUT/PATCH/DELETE, ambil CSRF token dari cache (atau fetch baru)
2. **Idempotency key**: Untuk mutation penting (biar ga double-charge)
3. **credentials: 'include'**: Kirim HttpOnly cookies ke backend
4. **Response wrapper extractor**: Backend return `{ statusCode, message, data, timestamp }` → apiClient extract `.data`
5. **401 auto-refresh**: Kalo dapet 401, coba refresh token dulu, baru retry request
6. **Kalo refresh gagal**: Redirect ke /login

**`csrf.ts`** — CSRF Token Manager
- fetchCsrfToken(): Ambil token dari `GET /auth/csrf-token`, cache 10 menit
- resetCsrfToken(): Reset cache (dipanggil setelah login/register/logout)

**`types.ts`**
```typescript
ApiResponse<T> = { statusCode, message, data, timestamp }
PaginatedResponse<T> = { data: T[], total: number }
ApiError = { errorCode, message, validationErrors? }
```

### `src/middleware.ts`
Next.js 16 middleware (jalan di Edge sebelum render):
1. Baca cookie `auth_token`
2. Verify JWT pake jose library
3. Kalo token invalid/hilang → redirect /login
4. Kalo role ADMIN akses /dashboard/cashier → redirect ke /dashboard/admin
5. Kalo role STAFF akses /dashboard/admin → redirect ke /dashboard/cashier
6. Forward `x-user-id` + `x-user-role` ke server components

---

## 🗺️ Halaman & Route

| Route | Akses | Deskripsi |
|---|---|---|
| / | Public | Halaman utama (redirect ke /login) |
| /login | Public | Halaman login |
| /register | Public | Halaman register |
| /dashboard/admin | Admin | Overview dashboard |
| /dashboard/admin/products | Admin | Manajemen produk |
| /dashboard/admin/categories | Admin | Manajemen kategori |
| /dashboard/admin/suppliers | Admin | Manajemen supplier |
| /dashboard/admin/inventory | Admin | Adjust stok + low stock |
| /dashboard/cashier | Staff | POS terminal (jualan) |

---

## 🔐 Alur Auth

### Login
```
User isi username + password
  → useLoginMutation()
    → apiClient POST /auth/login
      → BE validasi, set HttpOnly cookies (auth_token, refresh_token)
      → return { user: { id, username, role, tenantId } }
  → redirect ke dashboard sesuai role (/dashboard/admin atau /dashboard/cashier)
```

### Register
```
User isi form register
  → useRegisterMutation()
    → apiClient POST /auth/register
      → BE bikin PlatformUser + Tenant + TenantUser, set cookies
      → return { message, user }
  → redirect ke /login?registered=true
```

### Proteksi Route
- `middleware.ts` verify JWT dari cookie setiap kali navigasi
- Kalo ga login → redirect ke /login
- Kalo role salah → redirect ke dashboard yang sesuai

### Token Refresh (Otomatis)
- apiClient interceptor: kalo response 401, coba `POST /auth/refresh`
- Kalo berhasil → reset CSRF → retry request asli
- Kalo gagal → redirect /login

---

## 🚀 Cara Jalanin

```bash
# 1. Install dependencies
bun install

# 2. Set env (copy dari .env.example atau edit .env.local)
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_AI_URL=http://localhost:8001
JWT_SECRET=crackpos-jwt-secret-k3y-2026-very-strong-random

# 3. Jalanin development server
bun run dev

# 4. Buka browser
# → http://localhost:3001

# Build production
bun run build
bun run start
```

### Testing
```bash
bun run build    # Cek TypeScript + build
bun run lint     # ESLint
```
