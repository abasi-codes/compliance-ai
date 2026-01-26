'use client';

import { ShieldCheck, Lock, FileCheck2, Award } from 'lucide-react';

const trustItems = [
  { icon: ShieldCheck, label: 'NIST CSF 2.0 Aligned' },
  { icon: Lock, label: 'Secure Assessment' },
  { icon: FileCheck2, label: 'Audit-Ready Reports' },
  { icon: Award, label: 'Enterprise Grade' },
];

export function TrustBar() {
  return (
    <section className="py-8 bg-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Gradient divider */}
        <div className="trust-divider mb-8" />

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 text-neutral-600"
              >
                <div className="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary-600" />
                </div>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
