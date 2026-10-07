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
  const classes = `inline-flex items-center justify-center rounded-xl bg-primary-600 font-semibold text-white transition-all hover:bg-primary-700 active:scale-[0.98] ${size === 'lg' ? 'px-6 py-3.5 text-base' : 'px-5 py-2.5 text-sm'} ${fullWidth ? 'w-full' : ''}`;

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
