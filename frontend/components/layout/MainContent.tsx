'use client';

import { usePathname } from 'next/navigation';

interface MainContentProps {
  children: React.ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  return (
    <main className={isLandingPage ? '' : 'pt-16'}>
      {children}
    </main>
  );
}
