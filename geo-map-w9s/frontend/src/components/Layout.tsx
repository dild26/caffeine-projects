import { Outlet } from '@tanstack/react-router';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
