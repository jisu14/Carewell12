import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Heart, Package, User, Bell, Search, ShieldCheck, HeartPulse, Sparkles, PhoneCall, MapPin, ChevronRight } from 'lucide-react';
import { dataService } from '@/services/dataService';
import { locationService, type UserLocation } from '@/services/locationService';
import { LocationModal } from '@/components/ui/LocationModal';

const navItems = [
  { label: 'Home Dashboard', icon: Home, path: '/home' },
  { label: 'Explore Directory', icon: Compass, path: '/explore' },
  { label: 'My Care Plan', icon: Heart, path: '/care' },
  { label: 'Orders & Refills', icon: Package, path: '/orders' },
  { label: 'Health & Records', icon: User, path: '/profile' },
];

export function Sidebar() {
  const location = useLocation();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [activeLocation, setActiveLocation] = useState<UserLocation>(locationService.getLocation());

  useEffect(() => {
    const unsub = locationService.subscribe((loc) => {
      setActiveLocation(loc);
    });
    return unsub;
  }, []);

  const unreadCount = dataService.notifications.getUnreadCount();
  const activeOrdersCount = dataService.orders.getAll().filter(o => o.status === 'upcoming' || o.status === 'in-progress').length;

  return (
    <>
      <aside className="hidden lg:flex fixed left-0 top-0 z-30 h-screen w-64 flex-col border-r border-neutral-200/70 bg-white/90 backdrop-blur-xl shadow-[4px_0_24px_-4px_rgba(15,23,42,0.03)]">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100/80">
          <Link to="/home" className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-800 via-emerald-700 to-teal-600 text-white shadow-md shadow-emerald-900/15 ring-1 ring-white/40 group-hover:scale-105 transition-transform duration-300">
              <HeartPulse size={20} className="text-emerald-100 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-neutral-950 font-display">CareWell</span>
                <span className="rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200/60 shadow-2xs">
                  PRO
                </span>
              </div>
              <p className="text-[11px] font-medium text-neutral-600">Premier Health Network</p>
            </div>
          </Link>
        </div>

        {/* Location Selector Pill */}
        <div className="px-4 pt-3 pb-1">
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="group flex w-full items-center justify-between gap-2 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-teal-50/40 hover:from-emerald-100/70 hover:to-teal-100/50 p-2.5 text-left border border-emerald-200/70 shadow-2xs transition-all active:scale-98"
            title="Click to detect GPS or switch city"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-2xs">
                <MapPin size={12} />
              </div>
              <div className="min-w-0">
                <span className="block text-[9px] font-bold uppercase tracking-wider text-emerald-800 leading-none">
                  Location Zone
                </span>
                <span className="block text-xs font-extrabold text-neutral-900 truncate leading-tight mt-0.5">
                  {activeLocation.displayName}
                </span>
              </div>
            </div>
            <ChevronRight size={13} className="text-emerald-700 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </button>
        </div>

        {/* Main Navigation */}
        <div className="px-4 pt-3 pb-2">
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-600">
            Main Navigation
          </span>
        </div>
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path === '/care' && location.pathname.startsWith('/care'));
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group relative flex items-center gap-3 rounded-2xl px-3.5 py-3 text-xs sm:text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-50 to-teal-50/40 text-emerald-900 shadow-xs border border-emerald-200/60'
                  : 'text-neutral-600 hover:bg-neutral-50/80 hover:text-neutral-900'
              }`}
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-700/20' 
                  : 'bg-neutral-100/70 text-neutral-500 group-hover:bg-neutral-200/60 group-hover:text-neutral-900'
              }`}>
                <Icon size={17} strokeWidth={isActive ? 2.3 : 1.8} />
              </div>
              <span className="flex-1 tracking-tight">{item.label}</span>
              {item.path === '/orders' && activeOrdersCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 px-1.5 text-[10px] font-bold">
                  {activeOrdersCount}
                </span>
              )}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-emerald-600" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Quick Search & Alerts */}
      <div className="px-3 py-3 border-t border-neutral-100 space-y-1">
        <Link
          to="/search"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-neutral-600 transition-all hover:bg-neutral-50 hover:text-neutral-900"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100/80 text-neutral-500">
            <Search size={15} />
          </div>
          <span className="flex-1">Clinical Search</span>
          <span className="text-[10px] font-mono text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200/50">⌘K</span>
        </Link>
        <Link
          to="/notifications"
          className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold text-neutral-600 transition-all hover:bg-neutral-50 hover:text-neutral-900"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100/80 text-neutral-500">
              <Bell size={15} />
            </div>
            <span>Alerts & Reminders</span>
          </div>
          {unreadCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1.5 text-[10px] font-bold text-white shadow-xs">
              {unreadCount}
            </span>
          )}
        </Link>
      </div>

      {/* 24/7 Concierge & SOS Card */}
      <div className="p-3 border-t border-neutral-100">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 p-3.5 text-white shadow-md">
          <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-emerald-500/15 blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-300 border border-emerald-400/30">
              <Sparkles size={10} /> 24/7 Helpline
            </span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <p className="text-xs font-bold tracking-tight text-white">Emergency Response</p>
          <p className="text-[10px] text-neutral-400 mt-0.5">Priority ambulance & nurse dispatch</p>
          <a
            href="tel:+919847012345"
            className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 py-1.5 px-3 text-[11px] font-bold text-white transition-colors shadow-xs"
          >
            <PhoneCall size={12} />
            <span>Call Concierge</span>
          </a>
        </div>
      </div>

      {/* Trust & Security Footer */}
      <div className="px-4 py-3 border-t border-neutral-100 bg-neutral-50/60">
        <div className="flex items-center gap-2.5 text-neutral-500">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/50">
            <ShieldCheck size={14} />
          </div>
          <div className="text-[10px] leading-tight">
            <p className="font-bold text-neutral-800">NABH & HIPAA Compliant</p>
            <p className="text-neutral-500">256-bit Encrypted Health Vault</p>
          </div>
        </div>
      </div>
    </aside>

    <LocationModal
      isOpen={isLocationModalOpen}
      onClose={() => setIsLocationModalOpen(false)}
    />
  </>
  );
}


