'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Pages that should NOT show the navbar (they have their own navigation)
  const noNavbarPages = ['/login', '/register'];

  const showNavbar = !noNavbarPages.includes(pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
}
