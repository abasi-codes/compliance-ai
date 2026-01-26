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
      className="ledger-card rounded-lg p-6 scroll-reveal"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="h-10 w-10 rounded-md bg-accent-50 border border-accent-200 flex items-center justify-center mb-4">
        <Icon className="h-5 w-5 text-accent-600" />
      </div>
      <h3 className="text-lg font-semibold text-primary-900 mb-2">{title}</h3>
      <p className="text-neutral-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
