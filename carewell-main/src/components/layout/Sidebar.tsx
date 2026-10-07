import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Heart, Package, User, Bell, Search } from 'lucide-react';
import { dataService } from '@/services/dataService';

const navItems = [
  { label: 'Home', icon: Home, path: '/home' },
  { label: 'Explore', icon: Compass, path: '/explore' },
  { label: 'My Care', icon: Heart, path: '/care' },
  { label: 'Orders', icon: Package, path: '/orders' },
  { label: 'Profile', icon: User, path: '/profile' },
];

export function Sidebar() {
  const location = useLocation();
  const unreadCount = dataService.notifications.getUnreadCount();

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 z-30 h-screen w-64 flex-col border-r border-neutral-100 bg-white">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white font-bold text-lg">
          C
        </div>
        <div>
          <h1 className="text-lg font-bold text-neutral-800">CareWell</h1>
          <p className="text-[10px] text-neutral-400">Your care ecosystem</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path === '/care' && location.pathname.startsWith('/care'));
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`mb-1 flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all ${isActive ? 'bg-primary-50 text-primary-700' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'}`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4">
        <Link
          to="/search"
          className="mb-1 flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-neutral-500 transition-all hover:bg-neutral-50 hover:text-neutral-700"
        >
          <Search size={20} />
          Search
        </Link>
        <Link
          to="/notifications"
          className="flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium text-neutral-500 transition-all hover:bg-neutral-50 hover:text-neutral-700"
        >
          <div className="flex items-center gap-3">
            <Bell size={20} />
            Notifications
          </div>
          {unreadCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-error-500 px-1 text-xs font-semibold text-white">
              {unreadCount}
            </span>
          )}
        </Link>
      </div>

      <div className="border-t border-neutral-50 px-4 py-4">
        <p className="text-[10px] text-neutral-300">HLT Pvt Ltd</p>
        <p className="text-[10px] text-neutral-300">v0.1.0 — Skeleton</p>
      </div>
    </aside>
  );
}
