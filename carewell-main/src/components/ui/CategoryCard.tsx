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
      className="group flex items-center gap-3 rounded-2xl border border-neutral-100 bg-white p-3.5 shadow-card transition-all hover:border-primary-200 hover:shadow-card-hover"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-100">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-neutral-800">{name}</p>
        {description && <p className="truncate text-xs text-neutral-400">{description}</p>}
      </div>
      <ChevronRight size={18} className="text-neutral-300 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
