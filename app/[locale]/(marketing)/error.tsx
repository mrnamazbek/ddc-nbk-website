"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";

export default function MarketingError({
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
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center text-white">
      <h1 className="font-display text-3xl font-normal tracking-tight sm:text-4xl">
        Something went wrong
      </h1>
      <p className="max-w-md text-sm leading-relaxed text-white/64">
        This section failed to load. You can try again, or head back to the homepage.
      </p>
      <div className="flex gap-3">
        <Button variant="gold" onClick={() => reset()}>
          Try again
        </Button>
        <Button variant="ghost" onClick={() => (window.location.href = "/")}>
          Go home
        </Button>
      </div>
    </div>
  );
}
