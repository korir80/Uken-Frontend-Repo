import logoDark from "@/assets/uken-logo.png";
import logoLight from "@/assets/uken-logo-light.png";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "dark" | "light";
  className?: string;
  alt?: string;
}

/**
 * UKEN brand logo. Use `dark` (default) on light surfaces, `light` on dark surfaces.
 * Size with Tailwind height utilities (h-8, h-10, h-12, etc.) — width is auto.
 */
export function Logo({ variant = "dark", className, alt = "UKEN — From Heart to Hands" }: LogoProps) {
  return (
    <img
      src={variant === "light" ? logoLight : logoDark}
      alt={alt}
      className={cn("h-10 w-auto select-none object-contain", className)}
      draggable={false}
    />
  );
}
