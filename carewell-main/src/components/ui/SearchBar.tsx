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
      <Search size={18} className="absolute left-4 text-neutral-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch?.()}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full rounded-2xl border border-neutral-200/90 bg-neutral-50/60 py-3 pl-11 pr-10 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 shadow-2xs transition-all focus:bg-white focus:border-primary-600/50 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
      />
      {value && (
        <button
          onClick={() => onChange?.('')}
          className="absolute right-3.5 p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
