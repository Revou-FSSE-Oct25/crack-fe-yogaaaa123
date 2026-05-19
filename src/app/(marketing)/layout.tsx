import { ReactNode } from 'react';
import { MarketingNavbar } from '@/features/landing-page/components/MarketingNavbar';
import { MarketingFooter } from '@/features/landing-page/components/MarketingFooter';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <MarketingNavbar />
      {children}
      <MarketingFooter />
    </>
  );
}
