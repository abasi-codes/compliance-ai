'use client';

import { Upload, GitMerge, MessageCircle, FileText, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    number: '01',
    title: 'Upload',
    description: 'Import your controls (CSV/XLSX) and policies (PDF, DOCX, TXT, MD)',
  },
  {
    icon: GitMerge,
    number: '02',
    title: 'Map',
    description: 'AI suggests control-to-framework mappings with confidence scores',
  },
  {
    icon: MessageCircle,
    number: '03',
    title: 'Interview',
    description: 'Complete guided assessment questionnaires with smart sequencing',
  },
  {
    icon: FileText,
    number: '04',
    title: 'Report',
    description: 'Generate comprehensive compliance reports with full audit trails',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#46403a] dark:text-[#f3f1ed] mb-4">
            How It Works
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Four simple steps to comprehensive NIST CSF 2.0 compliance assessment
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;

            return (
              <div key={step.title} className="relative">
                <div className="text-center scroll-reveal" style={{ transitionDelay: `${index * 100}ms` }}>
                  {/* Step number */}
                  <div className="inline-block mb-4">
                    <span className="text-6xl font-bold text-neutral-200">{step.number}</span>
                  </div>

                  {/* Icon */}
                  <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-[#46403a] dark:text-[#f3f1ed] mb-2">{step.title}</h3>
                  <p className="text-neutral-600 text-sm">{step.description}</p>
                </div>

                {/* Connector arrow (not on last item) */}
                {!isLast && (
                  <div className="hidden lg:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-6 w-6 text-primary-300" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
