'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Settings, User, Bell, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

const settingsNav = [
  { name: 'Profile', href: '/settings/profile', icon: User },
  { name: 'Preferences', href: '/settings/preferences', icon: Bell },
  { name: 'Security', href: '/settings/security', icon: Lock },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-lg bg-neutral-100 flex items-center justify-center">
          <Settings className="h-5 w-5 text-neutral-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
          <p className="text-sm text-neutral-500">Manage your account and preferences</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-8">
        {/* Sidebar navigation */}
        <nav className="sm:w-48 flex-shrink-0">
          <ul className="space-y-1">
            {settingsNav.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Content area */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
