import type { Metadata } from 'next';
import { StockMovementsTable } from '@/features/inventory/components/StockMovementsTable';

export const metadata: Metadata = { title: 'Barang Masuk & Keluar — CrackPOS' };

export default function InventoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Inventory (Masuk / Keluar)</h2>
        {/* Placeholder for future "Record Stock In/Out" modal trigger */}
      </div>

      <p className="text-gray-500">
        Lacak semua pergerakan stok barang di sini berdasarkan tanggal dan jamnya secara detail.
      </p>

      <StockMovementsTable />
    </div>
  );
}
