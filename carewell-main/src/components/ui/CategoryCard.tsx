import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface CategoryCardProps {
  name: string;
  icon: React.ReactNode;
  path: string;
  description?: string;
  badge?: string;
}

export function CategoryCard({ name, icon, path, description, badge }: CategoryCardProps) {
  return (
    <Link
      to={path}
      className="group relative flex items-center gap-4 rounded-3xl border border-neutral-200/80 bg-white p-4 sm:p-5 shadow-subtle transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-950/5 active:scale-99"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-50 to-teal-50/80 text-emerald-800 border border-emerald-200/60 shadow-2xs transition-all duration-300 group-hover:from-emerald-700 group-hover:to-teal-600 group-hover:text-white group-hover:scale-105 group-hover:shadow-md group-hover:shadow-emerald-800/20">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-xs sm:text-sm font-extrabold text-neutral-950 group-hover:text-emerald-900 transition-colors">
            {name}
          </p>
          {badge && (
            <span className="rounded-full bg-emerald-50 px-2 py-0.2 text-[9px] font-extrabold text-emerald-800 border border-emerald-200/60 shadow-2xs">
              {badge}
            </span>
          )}
        </div>
        <p className="truncate text-[11px] text-neutral-500 font-medium mt-0.5">
          {description || 'Accredited care specialist & services'}
        </p>
      </div>
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100/80 text-neutral-400 group-hover:bg-emerald-100 group-hover:text-emerald-800 transition-all shrink-0">
        <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

