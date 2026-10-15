import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, HeartPulse, Search } from 'lucide-react';
import { dataService } from '@/services/dataService';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  showLogo?: boolean;
  showSearch?: boolean;
  rightAction?: React.ReactNode;
  onBack?: () => void;
}

export function AppHeader({ title, subtitle, showBack, showLogo, showSearch = false, rightAction, onBack }: AppHeaderProps) {
  const navigate = useNavigate();
  const unreadCount = dataService.notifications.getUnreadCount();

  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200/70 bg-white/85 backdrop-blur-xl shadow-xs transition-all">
      <div className="flex items-center justify-between px-4 py-3.5 lg:px-8">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => onBack ? onBack() : navigate(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200/60 bg-white/80 text-neutral-600 transition-all hover:bg-neutral-100 hover:text-neutral-900 shadow-2xs active:scale-95"
              aria-label="Go back"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          {showLogo && (
            <Link to="/home" className="flex items-center gap-2.5 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-800 to-teal-600 text-white shadow-xs group-hover:scale-105 transition-transform">
                <HeartPulse size={16} className="text-emerald-100 animate-pulse" />
              </div>
              <div className="flex items-center gap-1.5 lg:hidden">
                <span className="font-extrabold text-neutral-900 tracking-tight font-display text-sm">CareWell</span>
                <span className="rounded-full bg-emerald-50 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800 border border-emerald-200/50">
                  PRO
                </span>
              </div>
            </Link>
          )}
          {title && (
            <div>
              <h1 className="text-sm sm:text-base font-extrabold text-neutral-900 tracking-tight font-display">{title}</h1>
              {subtitle && <p className="text-[11px] text-neutral-500 font-medium">{subtitle}</p>}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {showSearch && (
            <Link
              to="/search"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200/60 bg-white/80 text-neutral-600 transition-all hover:bg-neutral-100 hover:text-neutral-900 shadow-2xs"
              aria-label="Search"
            >
              <Search size={17} />
            </Link>
          )}

          {rightAction}

          {!rightAction && (
            <Link
              to="/notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200/60 bg-white/80 text-neutral-600 transition-all hover:bg-neutral-100 hover:text-neutral-900 shadow-2xs"
              aria-label="Notifications"
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-600 px-1 text-[9px] font-bold text-white ring-2 ring-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

