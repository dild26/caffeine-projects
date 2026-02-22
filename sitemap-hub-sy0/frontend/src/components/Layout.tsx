import { Outlet } from '@tanstack/react-router';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { useState } from 'react';
import ProfileSetupModal from './ProfileSetupModal';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 pt-16 pb-20">
        <Outlet />
      </main>
      <Footer />
      <ProfileSetupModal />
    </div>
  );
}
