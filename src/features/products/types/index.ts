// ---
// Product Domain Types — match BE Prisma + ResponseInterceptor shapes
// ---

export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  price: number; // BE returns Prisma.Decimal as string — parsed to number by FE
  stockQuantity: number;
  reorderLevel: number;
  categoryId: string;
  category?: { id: string; name: string };
  supplier?: { id: string; name: string };
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/** Query params for product listing — maps to BE GET /products?skip=&take=&search=&categoryId= */
export interface ProductQueryParams {
  page?: number;
  perPage?: number;
  search?: string;
  categoryId?: string;
}
