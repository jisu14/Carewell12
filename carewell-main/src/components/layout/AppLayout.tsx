import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';
import { HeeraChat, SosEmergencyModal } from '@/components/ui';

export function AppLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/home';
  const [isSosOpen, setIsSosOpen] = useState(false);

  useEffect(() => {
    const handleOpenSos = () => setIsSosOpen(true);
    window.addEventListener('carewell:open_sos', handleOpenSos);
    return () => window.removeEventListener('carewell:open_sos', handleOpenSos);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Sidebar />
      <div className="lg:pl-64">
        <main className={`pb-20 lg:pb-8 ${isHome ? '' : 'pt-0'}`}>
          <Outlet />
        </main>
      </div>
      <BottomNav />
      <HeeraChat />
      <SosEmergencyModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />
    </div>
  );
}

