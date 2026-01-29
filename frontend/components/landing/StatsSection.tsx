'use client';

const stats = [
  { value: '3', label: 'Frameworks', description: 'NIST CSF, ISO 27001, SOC 2' },
  { value: '65%', label: 'Interview Reduction', description: 'Through requirement clustering' },
  { value: '0-4', label: 'Scoring Scale', description: 'Explainable maturity ratings' },
];

export function StatsSection() {
  return (
    <section className="py-24 bg-surface-dark relative overflow-hidden">
      {/* Decorative orbs */}
      <div className="orb orb-primary w-72 h-72 -top-36 -left-36 animate-pulse-slow" />
      <div className="orb orb-accent w-64 h-64 -bottom-32 -right-32 animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="section-pill bg-white/10 text-white/90 mb-6 inline-block">By the Numbers</span>
          <h2 className="font-display text-3xl sm:text-4xl text-white mb-4">
            Built for Enterprise Compliance
          </h2>
          <p className="text-lg text-on-dark-secondary max-w-2xl mx-auto">
            Comprehensive assessment coverage with AI-powered efficiency
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center scroll-reveal"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Large gradient number */}
              <div className="stat-number mb-4">{stat.value}</div>

              {/* Label */}
              <div className="text-xl font-semibold text-white mb-2">{stat.label}</div>

              {/* Description */}
              <div className="text-sm text-on-dark-tertiary">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
