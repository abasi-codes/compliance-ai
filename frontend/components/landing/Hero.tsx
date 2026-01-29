'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-[85vh] hero-bg overflow-hidden flex items-center">
      {/* Animated orbs - Stripe style */}
      <div className="orb orb-primary w-96 h-96 -top-48 -right-48 animate-pulse-slow" />
      <div className="orb orb-accent w-72 h-72 top-1/3 -left-36 animate-pulse-slow" style={{ animationDelay: '2s' }} />
      <div className="orb orb-primary w-64 h-64 bottom-0 right-1/4 animate-pulse-slow" style={{ animationDelay: '1s' }} />

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary-900/50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-3xl">
          {/* Social proof badge with pulse */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8 animate-fadeInUp backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-white/90">Trusted by enterprise security teams</span>
          </div>

          {/* Headline - Large, left-aligned, serif */}
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl tracking-tight mb-6 animate-fadeInUp delay-100">
            <span className="text-white">Multi-Framework</span>
            <br />
            <span className="gradient-text">Compliance Assessment</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-on-dark-secondary mb-8 leading-relaxed animate-fadeInUp delay-200 max-w-2xl">
            Transform your compliance program with AI-powered automation.
            NIST CSF, ISO 27001, and SOC 2 assessments with explainable scoring
            and comprehensive audit documentation.
          </p>

          {/* Feature bullets */}
          <div className="flex flex-wrap gap-4 mb-10 animate-fadeInUp delay-300">
            <div className="flex items-center gap-2 text-on-dark-secondary">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-sm">65% interview reduction</span>
            </div>
            <div className="flex items-center gap-2 text-on-dark-secondary">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-sm">Explainable AI scoring</span>
            </div>
            <div className="flex items-center gap-2 text-on-dark-secondary">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-sm">Audit-ready reports</span>
            </div>
          </div>

          {/* CTAs - Primary white + Ghost */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fadeInUp delay-400">
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
              View Frameworks
            </Link>
          </div>

          {/* Micro-copy */}
          <p className="text-on-dark-tertiary text-sm mt-6 animate-fadeInUp delay-500">
            No credit card required. Start your assessment in minutes.
          </p>
        </div>
      </div>

      {/* Bottom fade to page background */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
