'use client';

import { useEffect } from 'react';
import {
  Hero,
  TrustBar,
  FeaturesSection,
  HowItWorks,
  StatsSection,
  CTASection,
  Footer
} from '@/components/landing';
import { useScrollReveal } from '@/lib/hooks/useScrollAnimation';

export default function Home() {
  useScrollReveal();

  return (
    <>
      <Hero />
      <TrustBar />
      <FeaturesSection />
      <HowItWorks />
      <StatsSection />
      <CTASection />
      <Footer />
    </>
  );
}
