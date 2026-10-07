interface PriceDisplayProps {
  price: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  period?: string;
}

export function PriceDisplay({ price, label, size = 'md', period }: PriceDisplayProps) {
  const sizes = {
    sm: { main: 'text-sm', symbol: 'text-xs' },
    md: { main: 'text-base', symbol: 'text-sm' },
    lg: { main: 'text-2xl', symbol: 'text-lg' },
  };
  const s = sizes[size];

  return (
    <div className="flex flex-col">
      <div className="flex items-baseline gap-0.5">
        <span className={`font-semibold text-neutral-900 ${s.symbol}`}>₹</span>
        <span className={`font-bold text-neutral-900 ${s.main}`}>{price.toLocaleString('en-IN')}</span>
        {period && <span className={`text-neutral-400 ${s.symbol}`}>/{period}</span>}
      </div>
      {label && <span className="text-xs text-neutral-400">{label}</span>}
    </div>
  );
}
