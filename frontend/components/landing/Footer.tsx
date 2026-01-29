'use client';

import Link from 'next/link';
import { Shield } from 'lucide-react';

const productLinks = [
  { label: 'Assessments', href: '/assessments' },
  { label: 'Policy Mapping', href: '/assessments/new' },
  { label: 'Reports', href: '/assessments' },
  { label: 'Gap Analysis', href: '/assessments' },
];

const frameworkLinks = [
  { label: 'NIST CSF 2.0', href: '/frameworks' },
  { label: 'ISO 27001:2022', href: '/frameworks' },
  { label: 'SOC 2', href: '/frameworks' },
  { label: 'Custom Frameworks', href: '/frameworks' },
];

const resourceLinks = [
  { label: 'Documentation', href: '#' },
  { label: 'API Reference', href: '#' },
  { label: 'Help Center', href: '#' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 4-column grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-primary-500 flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-white">Compliance AI</span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              AI-powered multi-framework compliance assessment with explainable scoring.
            </p>
          </div>

          {/* Product column */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Frameworks column */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Frameworks
            </h3>
            <ul className="space-y-3">
              {frameworkLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources column */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-neutral-800 mb-8" />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-neutral-500">
            &copy; {currentYear} Compliance AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
