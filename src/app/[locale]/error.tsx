'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-amber-900">
          Something went wrong
        </h1>
        <p className="mb-8 text-lg text-amber-700/70">
          We apologize for the inconvenience. Please try again.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={() => reset()}
            className="rounded-lg bg-amber-900 px-6 py-3 text-white transition-colors hover:bg-amber-800"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-lg border-2 border-amber-900 px-6 py-3 text-amber-900 transition-colors hover:bg-amber-900 hover:text-white"
          >
            Go to Homepage
          </Link>
        </div>
        {error.digest && (
          <p className="mt-8 text-sm text-amber-600/50">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
