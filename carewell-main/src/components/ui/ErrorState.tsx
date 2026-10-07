import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ title = 'Something went wrong', message = 'Please try again later.', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-error-50 text-error-500">
        <AlertCircle size={28} />
      </div>
      <h3 className="text-base font-semibold text-neutral-700">{title}</h3>
      <p className="mt-1.5 max-w-xs text-sm text-neutral-400">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 inline-flex items-center justify-center rounded-xl bg-neutral-100 px-5 py-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-200"
        >
          Try again
        </button>
      )}
    </div>
  );
}
