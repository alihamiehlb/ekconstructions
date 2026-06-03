"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
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
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="text-xs font-semibold tracking-[0.3em] text-ek-teal uppercase">Error</p>
      <h1 className="mt-3 text-2xl font-black text-ek-navy uppercase">Something went wrong</h1>
      <p className="mt-3 max-w-md text-sm text-ek-muted">
        The page hit an unexpected problem. You can try again or return to the homepage.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="btn-primary">
          Try again
        </button>
        <Link href="/" className="btn-play border border-ek-navy/15 px-6 py-3">
          Go home
        </Link>
      </div>
    </div>
  );
}
