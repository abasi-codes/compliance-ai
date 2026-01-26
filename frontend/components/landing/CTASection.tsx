'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="bg-[#23282d] py-24">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display text-3xl sm:text-4xl text-white mb-4">
          Ready to streamline your compliance program?
        </h2>

        <p className="text-lg text-neutral-300 max-w-2xl mx-auto mb-10">
          Start your multi-framework assessment today with AI-powered automation and explainable scoring.
        </p>

        <Link
          href="/assessments/new"
          className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4 stamp-hover"
        >
          Start Your Assessment
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
