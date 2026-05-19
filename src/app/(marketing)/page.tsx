import { HeroSection } from '@/features/landing-page/components/HeroSection';
import { AiShowcaseSection } from '@/features/landing-page/components/AiShowcaseSection';
import { PricingSection } from '@/features/landing-page/components/PricingSection';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      {/* Placeholder for Features section */}
      <AiShowcaseSection />
      <PricingSection />
    </main>
  );
}
