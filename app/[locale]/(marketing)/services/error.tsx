'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('WebGL/Services Page Error caught by boundary:', error);
    
    // Auto-recovery: Set flag to disable 3D and reload the page
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('ddc_services_disable_3d', 'true');
      window.location.reload();
    }
  }, [error]);

  return (
    <div className="relative min-h-screen bg-[#040c08] flex flex-col items-center justify-center text-center px-6">
      <div className="max-w-md rounded-[28px] border border-gold/20 bg-[#071b13]/80 p-8 shadow-[0_28px_90px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <h2 className="text-2xl font-semibold text-white tracking-tight">Loading issue resolved</h2>
        <p className="mt-4 text-sm text-white/70 leading-relaxed">
          We detected an issue loading the 3D assets on your device. We are automatically switching to the high-performance static version.
        </p>
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.sessionStorage.removeItem('ddc_services_disable_3d');
              window.location.reload();
            }
          }}
          className="mt-6 px-5 py-2.5 rounded-full border border-gold/20 bg-gold/10 hover:bg-gold/20 text-gold-light font-mono text-xs uppercase tracking-wider transition-all"
        >
          Try 3D version again
        </button>
      </div>
    </div>
  );
}
