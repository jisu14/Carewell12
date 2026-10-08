import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Heart, Package, User, Bell, Search, ShieldCheck, HeartPulse } from 'lucide-react';
import { dataService } from '@/services/dataService';

const navItems = [
  { label: 'Home', icon: Home, path: '/home' },
  { label: 'Explore Care', icon: Compass, path: '/explore' },
  { label: 'My Care Plan', icon: Heart, path: '/care' },
  { label: 'Orders & Refills', icon: Package, path: '/orders' },
  { label: 'Profile & Family', icon: User, path: '/profile' },
];

export function Sidebar() {
  const location = useLocation();
  const unreadCount = dataService.notifications.getUnreadCount();

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 z-30 h-screen w-64 flex-col border-r border-neutral-200/70 bg-white">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-neutral-100">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-sm ring-1 ring-primary-700/20">
          <HeartPulse size={22} className="text-primary-100" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-base font-bold tracking-tight text-neutral-900">CareWell</span>
            <span className="rounded-full bg-primary-50 px-1.5 py-0.5 text-[10px] font-semibold text-primary-700 border border-primary-200/50">
              Plus
            </span>
          </div>
          <p className="text-[11px] font-medium text-neutral-400">Family Health Network</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path === '/care' && location.pathname.startsWith('/care'));
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary-50 text-primary-800 font-semibold shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
              }`}
            >
              <Icon
                size={19}
                className={`transition-colors ${
                  isActive ? 'text-primary-700' : 'text-neutral-400 group-hover:text-neutral-600'
                }`}
              />
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <div className="h-1.5 w-1.5 rounded-full bg-primary-600 animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Utility Actions */}
      <div className="px-3 py-3 border-t border-neutral-100 space-y-1">
        <Link
          to="/search"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-neutral-600 transition-all hover:bg-neutral-50 hover:text-neutral-900"
        >
          <Search size={19} className="text-neutral-400" />
          <span>Quick Search</span>
        </Link>
        <Link
          to="/notifications"
          className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-neutral-600 transition-all hover:bg-neutral-50 hover:text-neutral-900"
        >
          <div className="flex items-center gap-3">
            <Bell size={19} className="text-neutral-400" />
            <span>Alerts & Reminders</span>
          </div>
          {unreadCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-700 px-1.5 text-[11px] font-bold text-white shadow-xs">
              {unreadCount}
            </span>
          )}
        </Link>
      </div>

      {/* Trust & Security Footer */}
      <div className="p-4 border-t border-neutral-100 bg-neutral-50/60">
        <div className="flex items-center gap-2 text-neutral-500">
          <ShieldCheck size={16} className="text-primary-700 shrink-0" />
          <div className="text-[11px] leading-tight">
            <p className="font-semibold text-neutral-700">Encrypted Health Record</p>
            <p className="text-neutral-400">HIPAA & NABH Verified</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
