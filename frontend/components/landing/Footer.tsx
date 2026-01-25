'use client';

import Link from 'next/link';
import { Shield } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">Compliance AI</span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-8">
            <Link
              href="/assessments"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Assessments
            </Link>
            <Link
              href="/framework"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Framework
            </Link>
          </nav>

          {/* Copyright */}
          <div className="text-sm text-slate-500">
            &copy; {currentYear} Compliance AI. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
