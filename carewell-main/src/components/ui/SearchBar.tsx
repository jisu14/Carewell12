import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  value = '',
  onChange,
  onSearch,
  placeholder = 'Search doctors, home care, labs, medicines, equipment...',
  autoFocus = false,
}: SearchBarProps) {
  return (
    <div className="relative flex items-center">
      <Search size={20} className="absolute left-4 text-neutral-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch?.()}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full rounded-2xl border border-neutral-200 bg-white py-3.5 pl-12 pr-10 text-sm text-neutral-800 placeholder:text-neutral-400 shadow-card transition-all focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
      />
      {value && (
        <button
          onClick={() => onChange?.('')}
          className="absolute right-3.5 text-neutral-400 hover:text-neutral-600"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
