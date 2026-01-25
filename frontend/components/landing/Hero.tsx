'use client';

import Link from 'next/link';
import { Shield, ArrowRight, Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] gradient-hero overflow-hidden flex items-center">
      {/* Animated grid pattern */}
      <div className="absolute inset-0 pattern-grid" />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/50" />

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-float delay-300" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 animate-fadeInUp">
            <Sparkles className="h-4 w-4 text-accent-400" />
            <span className="text-sm font-medium text-white/90">Enterprise Compliance Automation</span>
          </div>

          {/* Shield icon with glow */}
          <div className="flex justify-center mb-8 animate-fadeInUp delay-100">
            <div className="relative">
              <div className="absolute inset-0 bg-accent-500/30 rounded-2xl blur-xl animate-pulse-soft" />
              <div className="relative h-20 w-20 rounded-2xl gradient-primary flex items-center justify-center shadow-2xl">
                <Shield className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 animate-fadeInUp delay-200">
            <span className="text-white">AI-Powered </span>
            <span className="gradient-text-light">NIST CSF 2.0</span>
            <br />
            <span className="text-white">Compliance Assessment</span>
          </h1>

          {/* Subheadline */}
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-300 mb-10 animate-fadeInUp delay-300">
            Transform your compliance journey with intelligent automation.
            Map policies, conduct interviews, and generate comprehensive reports
            with explainable AI-powered scoring.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp delay-400">
            <Link
              href="/assessments/new"
              className="btn-accent-gradient inline-flex items-center justify-center gap-2 text-lg px-8 py-4"
            >
              Start Assessment
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/framework"
              className="btn-ghost inline-flex items-center justify-center gap-2 text-lg px-8 py-4"
            >
              View Framework
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent" />
    </section>
  );
}
