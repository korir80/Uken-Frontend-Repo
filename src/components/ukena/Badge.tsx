import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium tracking-wide",
  {
    variants: {
      variant: {
        clay: "bg-clay/10 text-clay-deep",
        terracotta: "bg-terracotta/12 text-terracotta",
        gold: "bg-gold-soft/60 text-[oklch(0.42_0.09_75)]",
        sand: "bg-sand-soft text-charcoal",
        outline: "border border-charcoal/20 text-charcoal bg-transparent",
        cream: "bg-cream text-charcoal border border-border",
      },
    },
    defaultVariants: {
      variant: "clay",
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
