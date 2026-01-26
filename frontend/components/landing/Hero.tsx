'use client';

import Link from 'next/link';
import { Shield, ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] hero-bg overflow-hidden flex items-center">
      {/* Precision grid pattern */}
      <div className="absolute inset-0 pattern-precision-grid" />

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary-900/30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white/5 border border-white/10 mb-8 animate-fadeInUp">
            <span className="text-sm font-medium text-neutral-300 tracking-wide uppercase">Enterprise Compliance Platform</span>
          </div>

          {/* Shield icon */}
          <div className="flex justify-center mb-8 animate-fadeInUp delay-100">
            <div className="h-16 w-16 rounded-lg bg-accent-500 flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Headline - Serif typography */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 animate-fadeInUp delay-200">
            <span className="text-white">Multi-Framework</span>
            <br />
            <span className="text-accent-400">Compliance Assessment</span>
          </h1>

          {/* Subheadline */}
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-on-dark-secondary mb-10 animate-fadeInUp delay-300">
            Transform your compliance program with AI-powered automation.
            NIST CSF, ISO 27001, and SOC 2 assessments with explainable scoring
            and comprehensive audit documentation.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp delay-400">
            <Link
              href="/assessments/new"
              className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-8 py-4 stamp-hover"
            >
              Start Assessment
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/frameworks"
              className="inline-flex items-center justify-center gap-2 text-lg px-8 py-4 rounded-md border border-neutral-600 text-neutral-300 hover:bg-white/5 hover:border-neutral-500 transition-all"
            >
              View Frameworks
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom fade to page background */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
