'use client';

import { Suspense, useState } from 'react';
import { useProducts } from '@/features/products/hooks/useProducts';
import { useAdjustStock, type AdjustStockInput } from '@/features/inventory/hooks/useAdjustStock';
import { useLowStockProducts } from '@/features/inventory/hooks/useLowStockProducts';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Warehouse, AlertTriangle, Package } from 'lucide-react';
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
    <div className="flex flex-col gap-6 pb-8">
      <div className="animate-fade-in">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Inventory</h2>
        <p className="mt-1 text-sm text-slate-500">Manage stock levels and monitor low stock items</p>
      </div>

      <div className="animate-fade-in rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
        <h3 className="mb-5 flex items-center gap-2 text-base font-semibold text-slate-900">
          <Package className="h-4.5 w-4.5 text-indigo-500" />
          Adjust Stock
        </h3>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Product</label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="" className="text-slate-400">Select product</option>
              {productsList.map((p) => (
                <option key={p.id} value={p.id} className="text-slate-700">
                  {p.name} (Stock: {p.stockQuantity})
                </option>
              ))}
            </select>
          </div>

          <Input
            id="inv-qty"
            label="Quantity Change (+/-)"
            type="number"
            value={quantityChange}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuantityChange(Number(e.target.value))}
            placeholder="e.g. 10 or -5"
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as AdjustStockInput['type'])}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ADJUSTMENT">Adjustment</option>
              <option value="DAMAGED">Damaged</option>
              <option value="LOST">Lost</option>
              <option value="FOUND">Found</option>
              <option value="MANUAL">Manual</option>
            </select>
          </div>

          <Input
            id="inv-notes"
            label="Notes (optional)"
            value={notes}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNotes(e.target.value)}
            placeholder="Reason for adjustment"
          />

          {adjustStock.isError && (
            <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {(adjustStock.error as unknown as Error)?.message ?? 'Failed'}
            </p>
          )}
          {adjustStock.isSuccess && (
            <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-600">Stock adjusted!</p>
          )}

          <Button
            onClick={handleSubmit}
            isLoading={adjustStock.isPending}
            disabled={!productId || quantityChange === 0}
          >
            Submit Adjustment
          </Button>
        </div>
      </div>

      <div className="animate-fade-in rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
        <h3 className="mb-5 flex items-center gap-2 text-base font-semibold text-slate-900">
          <AlertTriangle className="h-4.5 w-4.5 text-amber-500" />
          Low Stock Alerts
        </h3>
        {lowLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          </div>
        ) : !lowStock?.length ? (
          <div className="flex flex-col items-center py-12 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
              <Warehouse className="h-6 w-6 text-emerald-500" />
            </div>
            <p className="text-sm font-medium text-slate-600">All products have sufficient stock</p>
          </div>
        ) : (
          <DataTable columns={lowColumns} data={lowStock} keyExtractor={(r) => r.id} />
        )}
      </div>
    </div>
  );
}

export default function InventoryPage() {
  return (
    <Suspense fallback={<p className="py-8 text-center text-slate-400">Loading...</p>}>
      <InventoryContent />
    </Suspense>
  );
}
