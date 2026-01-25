'use client';

const stats = [
  { value: '6', label: 'CSF Functions', description: 'Core security functions' },
  { value: '23', label: 'Categories', description: 'Detailed classifications' },
  { value: '108', label: 'Subcategories', description: 'Specific controls' },
];

export function StatsSection() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Complete Framework Coverage
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Comprehensive assessment across the entire NIST Cybersecurity Framework 2.0
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center p-8 bg-white rounded-2xl shadow-sm scroll-reveal"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="stat-number mb-2">{stat.value}</div>
              <div className="text-xl font-semibold text-slate-900 mb-1">{stat.label}</div>
              <div className="text-sm text-slate-500">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
