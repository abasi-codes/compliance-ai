'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Shield, LayoutDashboard, BookOpen, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Assessments', href: '/assessments', icon: LayoutDashboard },
  { name: 'Framework', href: '/framework', icon: BookOpen },
];

interface HeaderProps {
  variant?: 'default' | 'transparent';
}

export function Header({ variant = 'default' }: HeaderProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isTransparent = variant === 'transparent';
  const showSolidBg = !isTransparent || isScrolled;

  useEffect(() => {
    if (!isTransparent) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isTransparent]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        showSolidBg
          ? 'glass border-b border-slate-200/80 shadow-sm'
          : 'bg-transparent border-b border-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span
                  className={cn(
                    'text-xl font-bold transition-colors',
                    showSolidBg ? 'text-slate-900' : 'text-white'
                  )}
                >
                  Compliance AI
                </span>
              </Link>
            </div>
            <nav className="hidden sm:ml-10 sm:flex sm:space-x-2">
              {navigation.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'relative inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg',
                      'transition-all duration-200',
                      isActive
                        ? showSolidBg
                          ? 'text-primary-700 bg-primary-50'
                          : 'text-white bg-white/20'
                        : showSolidBg
                          ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                    {isActive && showSolidBg && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full gradient-primary" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span
              className={cn(
                'hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-colors',
                showSolidBg
                  ? 'bg-accent-50 text-accent-700 border-accent-200'
                  : 'bg-white/10 text-white border-white/20'
              )}
            >
              NIST CSF 2.0
            </span>

            {/* Mobile menu button */}
            <button
              className={cn(
                'sm:hidden p-2 rounded-lg transition-colors',
                showSolidBg
                  ? 'text-slate-600 hover:bg-slate-100'
                  : 'text-white hover:bg-white/10'
              )}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden py-4 border-t border-slate-200/50">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                      isActive
                        ? 'text-primary-700 bg-primary-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
