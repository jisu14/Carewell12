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
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-neutral-100 bg-white/95 backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-1.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 transition-colors ${isActive ? 'text-primary-600' : 'text-neutral-400'}`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
