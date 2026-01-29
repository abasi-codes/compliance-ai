'use client';

import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
  highlighted?: boolean;
}

export function FeatureCard({ icon: Icon, title, description, delay = 0, highlighted = false }: FeatureCardProps) {
  return (
    <div
      className={`rounded-xl p-6 scroll-reveal hover-lift ${
        highlighted
          ? 'card-highlighted border border-primary-200'
          : 'card border border-neutral-200'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Icon in rounded container */}
      <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-5 ${
        highlighted
          ? 'bg-primary-500 text-white'
          : 'bg-primary-50 text-primary-600'
      }`}>
        <Icon className="h-6 w-6" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-neutral-900 mb-2">{title}</h3>

      {/* Description */}
      <p className="text-neutral-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
