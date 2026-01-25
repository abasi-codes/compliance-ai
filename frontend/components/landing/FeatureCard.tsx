'use client';

import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export function FeatureCard({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <div
      className="feature-card p-6 shadow-sm scroll-reveal"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-primary-600" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
