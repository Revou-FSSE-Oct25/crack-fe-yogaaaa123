// ---
// Product Domain Types
// ---

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  categoryId: string;
  categoryName?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/** Query params for product listing — maps 1:1 to URL search params */
export interface ProductQueryParams {
  page?: number;
  perPage?: number;
  search?: string;
  categoryId?: string;
  sort?: 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | 'stock_asc' | 'stock_desc';
}
