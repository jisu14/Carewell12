import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface CategoryCardProps {
  name: string;
  icon: React.ReactNode;
  path: string;
  description?: string;
}

export function CategoryCard({ name, icon, path, description }: CategoryCardProps) {
  return (
    <Link
      to={path}
      className="group flex items-center gap-3.5 rounded-2xl border border-neutral-200/80 bg-white p-3.5 sm:p-4 shadow-subtle transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-600/40 hover:shadow-card-hover"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700 border border-primary-200/50 transition-colors group-hover:bg-primary-600 group-hover:text-white">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-primary-800 transition-colors">{name}</p>
        {description && <p className="truncate text-[11px] text-neutral-400 mt-0.5">{description}</p>}
      </div>
      <ChevronRight size={17} className="text-neutral-300 transition-transform group-hover:translate-x-0.5 group-hover:text-neutral-500" />
    </Link>
  );
}
