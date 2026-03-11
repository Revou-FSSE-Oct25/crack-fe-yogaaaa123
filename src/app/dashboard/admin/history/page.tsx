import type { Metadata } from 'next';
import { TransactionHistoryTable } from '@/features/transactions/components/TransactionHistoryTable';

export const metadata: Metadata = { title: 'Riwayat Transaksi — CrackPOS' };

export default function HistoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-gray-900">Riwayat Transaksi (Kasir)</h2>

      <p className="text-gray-500">
        Berikut adalah catatan semua transaksi pelanggan di kasir beserta detail tanggal, waktu, dan barang yang dibeli.
      </p>

      <TransactionHistoryTable />
    </div>
  );
}
