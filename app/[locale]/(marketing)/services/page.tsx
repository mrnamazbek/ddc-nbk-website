"use client";

import dynamic from "next/dynamic";
import ThreeModelLoadingOverlay from "@/components/ui/ThreeModelLoadingOverlay";

const Services3D = dynamic(() => import("@/components/sections/Services3D"), {
  ssr: false,
  loading: () => <ServicesLoadingFallback />,
});

function ServicesLoadingFallback() {
  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center">
      <ThreeModelLoadingOverlay label="Loading 3D services" />
    </div>
  );
}

export default function ServicesPage() {
  return <Services3D />;
}
