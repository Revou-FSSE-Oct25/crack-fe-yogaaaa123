'use client';

import { useTransactionHistory } from '../hooks/useTransactionHistory';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { formatCurrency } from '@/infrastructure/utils/formatCurrency';
import type { TransactionHistory } from '../schemas/historySchema';

const columns: Column<TransactionHistory>[] = [
  { header: 'ID Transaksi', accessor: (row) => row.id.split('-')[0].toUpperCase() },
  { 
    header: 'Waktu (Tgl/Bln/Thn)', 
    accessor: (row) => {
      const date = new Date(row.createdAt);
      // Detailed formatting requested by user
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  },
  { header: 'Kasir', accessor: 'cashierName' },
  { header: 'Metode', accessor: 'paymentMethod' },
  { header: 'Total', accessor: (row) => formatCurrency(row.totalAmount) },
  { 
    header: 'Detail Barang', 
    accessor: (row) => (
      <div className="text-xs text-gray-500">
        {row.items.map(item => `${item.quantity}x ${item.productName}`).join(', ')}
      </div>
    )
  },
];

export function TransactionHistoryTable() {
  const { data, isLoading } = useTransactionHistory();

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-500 shadow-sm">
        Memuat riwayat transaksi...
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-gray-900">Riwayat Transaksi Terakhir</h3>
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        keyExtractor={(row) => row.id}
      />
    </div>
  );
}
