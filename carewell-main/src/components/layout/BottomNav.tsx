import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Heart, Package, User } from 'lucide-react';

const navItems = [
  { label: 'Home', icon: Home, path: '/home' },
  { label: 'Explore', icon: Compass, path: '/explore' },
  { label: 'Care Plan', icon: Heart, path: '/care' },
  { label: 'Orders', icon: Package, path: '/orders' },
  { label: 'Profile', icon: User, path: '/profile' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-neutral-200/70 bg-white/90 backdrop-blur-xl lg:hidden shadow-[0_-8px_30px_rgba(15,23,42,0.06)]">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path === '/care' && location.pathname.startsWith('/care'));
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center gap-1 rounded-2xl px-3 py-1.5 transition-all duration-200 ${
                isActive ? 'text-emerald-950 scale-105' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-sm shadow-emerald-700/30' 
                  : 'bg-transparent text-neutral-600'
              }`}>
                <Icon size={19} strokeWidth={isActive ? 2.4 : 1.9} />
              </div>
              <span className={`text-[10px] tracking-tight ${isActive ? 'font-bold text-emerald-950' : 'font-medium'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-1 h-1 w-4 rounded-full bg-emerald-600" />
              )}
            </Link>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}

