import { HeroSection } from '@/features/landing-page/components/HeroSection';
import { FeaturesSection } from '@/features/landing-page/components/FeaturesSection';
import { AiShowcaseSection } from '@/features/landing-page/components/AiShowcaseSection';
import { PricingSection } from '@/features/landing-page/components/PricingSection';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <AiShowcaseSection />
      <PricingSection />
    </main>
  );
}
