'use client';

import { Upload, GitMerge, MessageCircle, FileText } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    number: 1,
    title: 'Upload',
    description: 'Import your controls (CSV/XLSX) and policies (PDF, DOCX, TXT, MD)',
  },
  {
    icon: GitMerge,
    number: 2,
    title: 'Map',
    description: 'AI suggests control-to-framework mappings with confidence scores',
  },
  {
    icon: MessageCircle,
    number: 3,
    title: 'Interview',
    description: 'Complete guided assessment questionnaires with smart sequencing',
  },
  {
    icon: FileText,
    number: 4,
    title: 'Report',
    description: 'Generate comprehensive compliance reports with full audit trails',
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="section-pill mb-6 inline-block">How It Works</span>
          <h2 className="font-display text-3xl sm:text-4xl text-neutral-900 mb-4">
            Four Simple Steps
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            From document upload to comprehensive compliance report
          </p>
        </div>

        {/* Horizontal stepper */}
        <div className="relative">
          {/* Connecting line - hidden on mobile */}
          <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-neutral-200" />
          <div className="hidden lg:block absolute top-12 left-[12%] w-0 h-0.5 bg-primary-500 transition-all duration-1000" style={{ width: '76%' }} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div key={step.title} className="relative scroll-reveal" style={{ transitionDelay: `${index * 100}ms` }}>
                  <div className="flex flex-col items-center text-center">
                    {/* Number circle */}
                    <div className="relative z-10 mb-6">
                      <div className="h-24 w-24 rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-neutral-100">
                        <div className="h-16 w-16 rounded-full bg-primary-50 flex items-center justify-center">
                          <Icon className="h-8 w-8 text-primary-600" />
                        </div>
                      </div>
                      {/* Step number badge */}
                      <div className="absolute -top-1 -right-1 h-8 w-8 rounded-full bg-primary-500 text-white text-sm font-bold flex items-center justify-center shadow-md">
                        {step.number}
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">{step.title}</h3>
                    <p className="text-neutral-600 text-sm max-w-xs">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
