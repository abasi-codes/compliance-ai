'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AssessmentTabsProps {
  assessmentId: string;
}

const tabs = [
  { name: 'Overview', path: '' },
  { name: 'Controls', path: '/controls' },
  { name: 'Policies', path: '/policies' },
  { name: 'Mappings', path: '/mappings' },
  { name: 'Interviews', path: '/interviews' },
  { name: 'Scores', path: '/scores' },
  { name: 'Deviations', path: '/deviations' },
  { name: 'Reports', path: '/reports' },
];

export function AssessmentTabs({ assessmentId }: AssessmentTabsProps) {
  const pathname = usePathname();
  const basePath = `/assessments/${assessmentId}`;

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
        {tabs.map((tab) => {
          const href = `${basePath}${tab.path}`;
          const isActive = tab.path === ''
            ? pathname === basePath
            : pathname.startsWith(href);

          return (
            <Link
              key={tab.name}
              href={href}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
