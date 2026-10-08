import { Link } from 'react-router-dom';

interface BookingButtonProps {
  label?: string;
  to?: string;
  onClick?: () => void;
  fullWidth?: boolean;
  size?: 'md' | 'lg';
}

export function BookingButton({
  label = 'Book Service',
  to,
  onClick,
  fullWidth = false,
  size = 'md',
}: BookingButtonProps) {
  const classes = `inline-flex items-center justify-center rounded-xl bg-neutral-900 hover:bg-neutral-800 font-semibold text-white shadow-xs transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 border border-neutral-800 ${size === 'lg' ? 'px-6 py-3 text-sm sm:text-base' : 'px-4 py-2.5 text-xs sm:text-sm'} ${fullWidth ? 'w-full' : ''}`;

  if (to) {
    return (
      <Link to={to} className={classes}>
        {label}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className={classes}>
      {label}
    </button>
  );
}
