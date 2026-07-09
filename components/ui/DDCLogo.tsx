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
      className={cn("block aspect-square h-auto w-auto shrink-0 bg-current", className)}
      style={{
        WebkitMask: "url('/images/logo/ddc-logo-light-theme.svg') center / contain no-repeat",
        mask: "url('/images/logo/ddc-logo-light-theme.svg') center / contain no-repeat",
      }}
    />
  );
}
