'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-6">
          <h2 className="text-xl font-semibold text-slate-900">Something went wrong</h2>
          <p className="text-sm text-slate-500">
            {error.digest ? `Error ID: ${error.digest}` : 'An unexpected error occurred.'}
          </p>
          <button
            onClick={reset}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
