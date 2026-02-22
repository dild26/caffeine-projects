import { ReactNode } from 'react';
import PublicHeader from './PublicHeader';
import BottomNavbar from './BottomNavbar';

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col pb-20">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <BottomNavbar />
    </div>
  );
}
