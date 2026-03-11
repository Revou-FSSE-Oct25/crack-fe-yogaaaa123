'use client';

import { useStockMovements } from '../hooks/useStockMovements';
import { DataTable, type Column } from '@/components/ui/DataTable';
import type { StockMovement } from '../schemas/inventorySchema';

const columns: Column<StockMovement>[] = [
  { 
    header: 'Waktu (Tgl/Bln/Thn)', 
    accessor: (row) => {
      const date = new Date(row.createdAt);
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  },
  { header: 'Nama Barang', accessor: 'productName' },
  { 
    header: 'Jenis', 
    accessor: (row) => (
      <span className={`rounded-full px-2 py-1 text-xs font-medium ${
        row.type === 'IN' ? 'bg-green-100 text-green-700' : 
        row.type === 'OUT' ? 'bg-red-100 text-red-700' : 
        'bg-yellow-100 text-yellow-700'
      }`}>
        {row.type}
      </span>
    )
  },
  { 
    header: 'Jumlah', 
    accessor: (row) => (
      <span className={row.quantityChange > 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
        {row.quantityChange > 0 ? `+${row.quantityChange}` : row.quantityChange}
      </span>
    )
  },
  { header: 'Admin', accessor: 'adminName' },
  { header: 'Keterangan', accessor: 'notes' },
];

export function StockMovementsTable() {
  const { data, isLoading } = useStockMovements();

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-500 shadow-sm">
        Memuat riwayat stok...
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-gray-900">Riwayat Barang Masuk / Keluar</h3>
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        keyExtractor={(row) => row.id}
      />
    </div>
  );
}
