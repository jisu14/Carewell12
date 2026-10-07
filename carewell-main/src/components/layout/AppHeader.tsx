import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell } from 'lucide-react';
import { dataService } from '@/services/dataService';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  showLogo?: boolean;
  rightAction?: React.ReactNode;
  onBack?: () => void;
}

export function AppHeader({ title, showBack, showLogo, rightAction, onBack }: AppHeaderProps) {
  const navigate = useNavigate();
  const unreadCount = dataService.notifications.getUnreadCount();

  return (
    <header className="sticky top-0 z-20 border-b border-neutral-100 bg-white/95 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-3.5 lg:px-6">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => onBack ? onBack() : navigate(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-neutral-600 transition-colors hover:bg-neutral-100"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          {showLogo && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-sm font-bold text-white">
                C
              </div>
              <span className="font-bold text-neutral-800 lg:hidden">CareWell</span>
            </div>
          )}
          {title && <h1 className="text-lg font-semibold text-neutral-800">{title}</h1>}
        </div>
        <div className="flex items-center gap-2">
          {rightAction}
          {!rightAction && (
            <Link
              to="/notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl text-neutral-600 transition-colors hover:bg-neutral-100"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-error-500 ring-2 ring-white" />
              )}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
