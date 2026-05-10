import type { Metadata } from 'next';
import { AIProductInput } from '@/features/ai-product-input/components/AIProductInput';

export const metadata: Metadata = {
  title: 'AI Product Input — CrackPOS',
};

export default function AIProductPage() {
  return <AIProductInput />;
}
