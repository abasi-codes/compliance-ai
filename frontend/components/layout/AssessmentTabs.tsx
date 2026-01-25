'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Settings,
  FileText,
  Link2,
  MessageSquare,
  BarChart3,
  AlertTriangle,
  FileDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssessmentTabsProps {
  assessmentId: string;
}

const tabs = [
  { name: 'Overview', path: '', icon: Home },
  { name: 'Controls', path: '/controls', icon: Settings },
  { name: 'Policies', path: '/policies', icon: FileText },
  { name: 'Mappings', path: '/mappings', icon: Link2 },
  { name: 'Interviews', path: '/interviews', icon: MessageSquare },
  { name: 'Scores', path: '/scores', icon: BarChart3 },
  { name: 'Deviations', path: '/deviations', icon: AlertTriangle },
  { name: 'Reports', path: '/reports', icon: FileDown },
];

export function AssessmentTabs({ assessmentId }: AssessmentTabsProps) {
  const pathname = usePathname();
  const basePath = `/assessments/${assessmentId}`;

  return (
    <div className="border-b border-slate-200 bg-white">
      <nav className="-mb-px flex space-x-1 overflow-x-auto px-1 py-2" aria-label="Tabs">
        {tabs.map((tab) => {
          const href = `${basePath}${tab.path}`;
          const isActive = tab.path === ''
            ? pathname === basePath
            : pathname.startsWith(href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.name}
              href={href}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium',
                'transition-all duration-200 whitespace-nowrap',
                isActive
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
