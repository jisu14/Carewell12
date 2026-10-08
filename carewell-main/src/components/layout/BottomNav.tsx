import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Heart, Package, User } from 'lucide-react';

const navItems = [
  { label: 'Home', icon: Home, path: '/home' },
  { label: 'Explore', icon: Compass, path: '/explore' },
  { label: 'Care', icon: Heart, path: '/care' },
  { label: 'Orders', icon: Package, path: '/orders' },
  { label: 'Profile', icon: User, path: '/profile' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-neutral-200/60 bg-white/95 backdrop-blur-md lg:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-1.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path === '/care' && location.pathname.startsWith('/care'));
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 transition-all duration-200 ${
                isActive ? 'text-primary-800' : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${isActive ? 'bg-primary-50 text-primary-700' : ''}`}>
                <Icon size={20} strokeWidth={isActive ? 2.4 : 1.9} />
              </div>
              <span className={`text-[10px] tracking-tight ${isActive ? 'font-bold text-primary-800' : 'font-medium'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
