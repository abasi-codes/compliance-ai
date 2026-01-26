'use client';

const stats = [
  { value: '3', label: 'Frameworks', description: 'NIST CSF, ISO 27001, SOC 2' },
  { value: '65%', label: 'Interview Reduction', description: 'Through requirement clustering' },
  { value: '0-4', label: 'Scoring Scale', description: 'Explainable maturity ratings' },
];

export function StatsSection() {
  return (
    <section className="py-20 bg-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="font-display text-3xl sm:text-4xl text-primary-900 mb-4">
            Built for Enterprise Compliance
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl">
            Comprehensive assessment coverage with AI-powered efficiency
          </p>
          <div className="mt-4 w-20 h-0.5 bg-accent-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="bg-background rounded-lg p-8 border border-neutral-200 scroll-reveal"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="stat-number mb-3">{stat.value}</div>
              <div className="text-lg font-semibold text-primary-900 mb-1">{stat.label}</div>
              <div className="text-sm text-neutral-500">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
