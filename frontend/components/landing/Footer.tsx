'use client';

import Link from 'next/link';
import { Shield } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#23282d] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-accent-500 flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-white">Compliance AI</span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-8">
            <Link
              href="/assessments"
              className="text-sm text-neutral-300 hover:text-white transition-colors underline-expand"
            >
              Assessments
            </Link>
            <Link
              href="/frameworks"
              className="text-sm text-neutral-300 hover:text-white transition-colors underline-expand"
            >
              Frameworks
            </Link>
          </nav>

          {/* Copyright */}
          <div className="text-sm text-neutral-400">
            &copy; {currentYear} Compliance AI
          </div>
        </div>
      </div>
    </footer>
  );
}
