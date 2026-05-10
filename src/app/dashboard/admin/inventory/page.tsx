'use client';

import { Suspense, useState } from 'react';
import { useProducts } from '@/features/products/hooks/useProducts';
import { useAdjustStock, type AdjustStockInput } from '@/features/inventory/hooks/useAdjustStock';
import { useLowStockProducts } from '@/features/inventory/hooks/useLowStockProducts';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { LowStockProduct } from '@/features/inventory/hooks/useLowStockProducts';

function InventoryContent() {
  const { data: productsData } = useProducts();
  const adjustStock = useAdjustStock();
  const { data: lowStock, isLoading: lowLoading } = useLowStockProducts();
  const productsList = productsData?.data ?? [];

  const [productId, setProductId] = useState('');
  const [quantityChange, setQuantityChange] = useState(0);
  const [type, setType] = useState<AdjustStockInput['type']>('ADJUSTMENT');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!productId || quantityChange === 0) return;
    adjustStock.mutate({ productId, quantityChange, type, notes: notes || undefined }, {
      onSuccess: () => { setProductId(''); setQuantityChange(0); setNotes(''); },
    });
  };

  const lowColumns: Column<LowStockProduct>[] = [
    { header: 'Name', accessor: 'name' },
    { header: 'SKU', accessor: 'sku' },
    { header: 'Stock', accessor: (r) => <span className="font-semibold text-red-600">{r.stockQuantity}</span> },
    { header: 'Reorder Level', accessor: 'reorderLevel' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-gray-900">Inventory</h2>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-gray-900">Adjust Stock</h3>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Product</label>
            <select value={productId} onChange={(e) => setProductId(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
              <option value="">Select product</option>
              {productsList.map((p) => <option key={p.id} value={p.id}>{p.name} (Stock: {p.stockQuantity})</option>)}
            </select>
          </div>
          <Input id="inv-qty" label="Quantity Change (+/-)" type="number" value={quantityChange} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuantityChange(Number(e.target.value))} placeholder="e.g. 10 or -5" />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value as AdjustStockInput['type'])} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
              <option value="ADJUSTMENT">Adjustment</option>
              <option value="DAMAGED">Damaged</option>
              <option value="LOST">Lost</option>
              <option value="FOUND">Found</option>
              <option value="MANUAL">Manual</option>
            </select>
          </div>
          <Input id="inv-notes" label="Notes (optional)" value={notes} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNotes(e.target.value)} placeholder="Reason for adjustment" />
          {adjustStock.isError && <p className="rounded-md bg-red-50 p-2 text-sm text-red-600">{(adjustStock.error as unknown as Error)?.message ?? 'Failed'}</p>}
          {adjustStock.isSuccess && <p className="rounded-md bg-green-50 p-2 text-sm text-green-600">Stock adjusted!</p>}
          <Button onClick={handleSubmit} isLoading={adjustStock.isPending} disabled={!productId || quantityChange === 0}>
            Submit Adjustment
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-gray-900">Low Stock Alerts</h3>
        {lowLoading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : !lowStock?.length ? (
          <p className="text-center text-gray-400">All products have sufficient stock</p>
        ) : (
          <DataTable columns={lowColumns} data={lowStock} keyExtractor={(r) => r.id} />
        )}
      </div>
    </div>
  );
}

export default function InventoryPage() {
  return (
    <Suspense fallback={<p className="py-8 text-center text-gray-400">Loading...</p>}>
      <InventoryContent />
    </Suspense>
  );
}
