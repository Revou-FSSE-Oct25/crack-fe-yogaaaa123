'use client';

import { use } from 'react';
import { TransactionDetail } from '@/features/transactions/components/TransactionDetail';

export default function TransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  return <TransactionDetail id={id} />;
}
