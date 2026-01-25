'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';

export function HeaderWrapper() {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  return <Header variant={isLandingPage ? 'transparent' : 'default'} />;
}
