'use client';

import {
  FileCheck,
  MessageSquareText,
  BarChart3,
  Target,
  AlertTriangle,
  FileOutput
} from 'lucide-react';
import { FeatureCard } from './FeatureCard';

const features = [
  {
    icon: FileCheck,
    title: 'Policy Mapping',
    description: 'AI-powered mapping of your policies to framework controls with confidence scores and human approval workflow.',
  },
  {
    icon: MessageSquareText,
    title: 'Intelligent Interviews',
    description: 'Guided questionnaires with deterministic sequencing, save/resume capability, and context-aware follow-ups.',
  },
  {
    icon: BarChart3,
    title: 'Explainable Scoring',
    description: 'Transparent 0-4 maturity scoring with detailed explanations. Every score includes justification payloads.',
  },
  {
    icon: Target,
    title: 'Gap Analysis',
    description: 'Identify compliance deviations and unmapped controls. Prioritize remediation efforts effectively.',
  },
  {
    icon: AlertTriangle,
    title: 'Risk Prioritization',
    description: 'Rank identified issues by severity. Focus on high-impact areas first with data-driven risk rankings.',
  },
  {
    icon: FileOutput,
    title: 'Report Generation',
    description: 'Generate comprehensive compliance reports in JSON format. Audit-ready documentation with full traceability.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="font-display text-3xl sm:text-4xl text-primary-900 mb-4">
            Complete Compliance Toolkit
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl">
            Everything you need to assess, document, and improve your compliance posture across multiple frameworks.
          </p>
          <div className="mt-4 w-20 h-0.5 bg-accent-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
