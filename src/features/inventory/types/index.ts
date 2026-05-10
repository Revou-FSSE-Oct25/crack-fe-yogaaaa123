export interface StockAdjustment {
  id: string;
  productId: string;
  quantity: number;
  type: string;
  notes?: string;
  createdAt: string;
}
