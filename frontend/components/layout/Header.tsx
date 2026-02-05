'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Shield, LayoutDashboard, Layers, Menu, X, User, LogOut, Settings, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Assessments', href: '/assessments', icon: LayoutDashboard },
  { name: 'Frameworks', href: '/frameworks', icon: Layers },
];

interface HeaderProps {
  variant?: 'default' | 'transparent';
}

export function Header({ variant = 'default' }: HeaderProps) {
  const pathname = usePathname();
  const { user, isAuthenticated, isGuest, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

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

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await logout();
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        showSolidBg
          ? 'glass border-b border-neutral-200/80 shadow-sm'
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
                    showSolidBg ? 'text-neutral-900' : 'text-white'
                  )}
                >
                  Compliance AI
                </span>
              </Link>
            </div>
            {isAuthenticated && (
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
                            ? 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
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
            )}
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span
                  className={cn(
                    'hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-colors',
                    showSolidBg
                      ? 'bg-accent-50 text-accent-700 border-accent-200'
                      : 'bg-white/10 text-white border-white/20'
                  )}
                >
                  Multi-Framework
                </span>

                {/* User menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
                      showSolidBg
                        ? 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    )}
                  >
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-700" />
                    </div>
                    {isGuest ? (
                      <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-neutral-100 text-neutral-600">
                        Guest
                      </span>
                    ) : (
                      <span className="hidden sm:block text-sm font-medium">
                        {user?.name?.split(' ')[0] || 'User'}
                      </span>
                    )}
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-neutral-100">
                        <p className="text-sm font-medium text-neutral-900">{user?.name}</p>
                        {!isGuest && (
                          <p className="text-xs text-neutral-500">{user?.email}</p>
                        )}
                      </div>
                      {!isGuest && (
                        <Link
                          href="/settings"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                        >
                          <Settings className="h-4 w-4" />
                          Settings
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-danger-600 hover:bg-danger-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile menu button */}
                <button
                  className={cn(
                    'sm:hidden p-2 rounded-lg transition-colors',
                    showSolidBg
                      ? 'text-neutral-600 hover:bg-neutral-100'
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
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                    showSolidBg
                      ? 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  )}
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium rounded-lg gradient-primary text-white hover:opacity-90 transition-opacity"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && isAuthenticated && (
          <div className="sm:hidden py-4 border-t border-neutral-200/50">
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
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
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
