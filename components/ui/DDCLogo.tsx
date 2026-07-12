import { cn } from "@/lib/utils";

interface DDCLogoProps {
  className?: string;
  title?: string;
}

export default function DDCLogo({ className, title }: DDCLogoProps) {
  return (
    <span
      data-ddc-logo
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={cn("block aspect-square h-auto w-auto shrink-0", className)}
    >
      {/* Preserve the established white emblem in dark mode. */}
      <span
        aria-hidden="true"
        className="ddc-logo__dark block h-full w-full bg-current"
        style={{
          WebkitMask: "url('/images/logo/ddc-emblem.svg') center / contain no-repeat",
          mask: "url('/images/logo/ddc-emblem.svg') center / contain no-repeat",
        }}
      />
      {/* The supplied SVG is deliberately exclusive to the light theme. */}
      <span
        aria-hidden="true"
        className="ddc-logo__light hidden h-full w-full bg-forest"
        style={{
          WebkitMask: "url('/images/logo/ddc-logo-light-theme.svg') center / contain no-repeat",
          mask: "url('/images/logo/ddc-logo-light-theme.svg') center / contain no-repeat",
        }}
      />
    </span>
  );
}
