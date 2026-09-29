import { useState, useEffect } from 'react';
import { WeddingProvider, useWedding } from './context/WeddingContext';
import { Navbar } from './components/public/Navbar';
import { Hero } from './components/public/Hero';
import { Couple } from './components/public/Couple';
import { FamilyBlessings } from './components/public/FamilyBlessings';
import { Events } from './components/public/Events';
import { Gallery } from './components/public/Gallery';
import { Countdown } from './components/public/Countdown';
import { WeddingCalendar } from './components/public/WeddingCalendar';
import { InvitationMessage } from './components/public/InvitationMessage';
import { Footer } from './components/public/Footer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ToastContainer } from './components/common/ToastContainer';

export function AppContent() {
  const { isInvitationOpened } = useWedding();
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAdminRoute = currentPath === '/admin' || currentPath.startsWith('/admin/');

  // Ensure page always starts at the top and does not auto-scroll on page load
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  // Dedicated /admin SPA Route
  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-[#2A080D] flex flex-col text-stone-800">
        <AdminDashboard isRoute={true} onNavigateHome={() => navigateTo('/')} />
        <ToastContainer />
      </div>
    );
  }

  // Public Wedding Invitation (Zero admin buttons, purely elegant)
  return (
    <div className="min-h-screen flex flex-col bg-[var(--wedding-bg)] text-stone-800 relative selection:bg-[var(--primary-red)] selection:text-white">
      {/* Decorative ambient top border */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[var(--primary-red)] via-[var(--primary-gold)] to-[var(--primary-red)]" />

      {/* Navigation Header */}
      <Navbar />

      {/* Main Public Invitation Flow - Hero is fully scrollable to reveal Open Invitation button */}
      <main className="flex-1">
        <Hero />
        {/* Sections revealed only after the user opens the invitation */}
        <div style={{ display: isInvitationOpened ? 'block' : 'none' }}>
          <Couple />
          <FamilyBlessings />
          <Events />
          <Gallery />
          <Countdown />
          <WeddingCalendar />
          <InvitationMessage />
          <Footer />
        </div>
      </main>

      {/* Toast System */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <WeddingProvider>
      <AppContent />
    </WeddingProvider>
  );
}

