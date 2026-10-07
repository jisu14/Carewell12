import { X } from 'lucide-react';
import { useEffect } from 'react';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
      <div className="absolute inset-0 bg-neutral-900/40 animate-fade-in" onClick={onClose} />
      <div className="relative z-10 w-full rounded-t-3xl bg-white shadow-float animate-slide-up sm:max-w-lg sm:rounded-3xl sm:mb-4">
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-neutral-200" />
        </div>
        {title && (
          <div className="flex items-center justify-between px-5 py-4">
            <h3 className="text-base font-semibold text-neutral-800">{title}</h3>
            <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
              <X size={20} />
            </button>
          </div>
        )}
        <div className="px-5 pb-5">{children}</div>
      </div>
    </div>
  );
}
