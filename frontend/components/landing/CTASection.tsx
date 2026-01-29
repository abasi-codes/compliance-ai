'use client';

import Link from 'next/link';
import { ArrowRight, Layers } from 'lucide-react';

export function CTASection() {
  return (
    <section className="cta-gradient py-24 relative overflow-hidden">
      {/* Floating orbs */}
      <div className="orb orb-primary w-96 h-96 top-0 right-0 animate-float" />
      <div className="orb orb-accent w-72 h-72 bottom-0 left-1/4 animate-float" style={{ animationDelay: '3s' }} />
      <div className="orb orb-primary w-48 h-48 top-1/2 left-0 animate-float" style={{ animationDelay: '1.5s' }} />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mb-6">
          Ready to streamline your compliance program?
        </h2>

        <p className="text-lg sm:text-xl text-on-dark-secondary max-w-2xl mx-auto mb-10">
          Start your multi-framework assessment today with AI-powered automation and explainable scoring.
        </p>

        {/* Dual CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Link
            href="/assessments/new"
            className="btn-light inline-flex items-center justify-center gap-2 text-lg px-8 py-4 stamp-hover"
          >
            Start Assessment
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/frameworks"
            className="btn-ghost-light inline-flex items-center justify-center gap-2 text-lg px-8 py-4"
          >
            <Layers className="h-5 w-5" />
            View Frameworks
          </Link>
        </div>

        {/* Urgency/trust text */}
        <p className="text-on-dark-tertiary text-sm">
          No credit card required. Get started in minutes.
        </p>
      </div>

      {/* Visual separator line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </section>
  );
}
