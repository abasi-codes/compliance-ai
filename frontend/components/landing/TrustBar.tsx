'use client';

import { Shield, Lock, FileCheck2, Scale } from 'lucide-react';

const frameworks = [
  {
    icon: Shield,
    name: 'NIST CSF 2.0',
    description: 'Cybersecurity Framework'
  },
  {
    icon: Lock,
    name: 'ISO 27001:2022',
    description: 'Information Security'
  },
  {
    icon: FileCheck2,
    name: 'SOC 2',
    description: 'Trust Services Criteria'
  },
  {
    icon: Scale,
    name: 'Custom Frameworks',
    description: 'Build Your Own'
  },
];

export function TrustBar() {
  return (
    <section className="py-12 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Label */}
        <p className="text-center text-sm font-medium text-neutral-500 uppercase tracking-wider mb-8">
          Supported Compliance Frameworks
        </p>

        {/* Framework showcase */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {frameworks.map((framework) => {
            const Icon = framework.icon;
            return (
              <div
                key={framework.name}
                className="group relative bg-white rounded-xl p-6 border border-neutral-200 hover:border-primary-300 hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                {/* Icon container */}
                <div className="h-12 w-12 rounded-lg bg-primary-50 group-hover:bg-primary-100 flex items-center justify-center mb-4 transition-colors">
                  <Icon className="h-6 w-6 text-primary-600" />
                </div>

                {/* Framework name */}
                <h3 className="font-semibold text-neutral-900 mb-1 group-hover:text-primary-700 transition-colors">
                  {framework.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-neutral-500">
                  {framework.description}
                </p>

                {/* Hover indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-500 rounded-b-xl transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
