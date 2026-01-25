'use client';

import Link from 'next/link';
import { ArrowRight, Shield } from 'lucide-react';

export function CTASection() {
  return (
    <section className="cta-section py-24">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-8">
          <Shield className="h-8 w-8 text-accent-400" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Ready to assess your NIST CSF 2.0 compliance?
        </h2>

        <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10">
          Start your compliance journey today with AI-powered automation and explainable scoring.
        </p>

        <Link
          href="/assessments/new"
          className="btn-accent-gradient inline-flex items-center gap-2 text-lg px-8 py-4"
        >
          Start Your Assessment
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
