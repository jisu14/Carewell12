import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  to: string;
  accent?: 'primary' | 'secondary' | 'accent';
}

export function ServiceCard({ icon, title, subtitle, to, accent = 'primary' }: ServiceCardProps) {
  const colors = {
    primary: 'bg-primary-50 text-primary-600',
    secondary: 'bg-secondary-50 text-secondary-600',
    accent: 'bg-accent-50 text-accent-600',
  };

  return (
    <Link
      to={to}
      className="group flex flex-col items-center gap-2 rounded-2xl border border-neutral-100 bg-white p-3 shadow-card transition-all hover:border-primary-200 hover:shadow-card-hover"
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${colors[accent]}`}>
        {icon}
      </div>
      <span className="text-center text-xs font-semibold text-neutral-700 leading-tight">{title}</span>
      {subtitle && <span className="text-center text-[10px] text-neutral-400 leading-tight">{subtitle}</span>}
    </Link>
  );
}
