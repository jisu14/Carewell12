import { Star } from 'lucide-react';

interface RatingProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export function Rating({ rating, reviewCount, size = 'sm', showCount = true }: RatingProps) {
  const sizes = {
    sm: { star: 14, text: 'text-xs' },
    md: { star: 16, text: 'text-sm' },
    lg: { star: 20, text: 'text-base' },
  };
  const s = sizes[size];

  return (
    <div className="flex items-center gap-1">
      <Star className={`fill-warning-400 text-warning-400`} size={s.star} />
      <span className={`font-semibold ${s.text} text-neutral-800`}>{rating.toFixed(1)}</span>
      {showCount && reviewCount !== undefined && (
        <span className={`${s.text} text-neutral-400`}>({reviewCount})</span>
      )}
    </div>
  );
}
