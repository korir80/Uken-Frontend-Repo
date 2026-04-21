import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { forwardRef, type ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans font-medium",
    "transition-all duration-300 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "bg-clay text-warm-white rounded-md",
          "hover:bg-clay-deep hover:shadow-[0_8px_20px_-6px_oklch(0.36_0.09_45/0.45)]",
          "active:translate-y-px",
        ].join(" "),
        secondary: [
          "bg-transparent text-charcoal border border-charcoal/25 rounded-md",
          "hover:bg-charcoal hover:text-warm-white hover:border-charcoal",
        ].join(" "),
        ghost: [
          "bg-transparent text-charcoal rounded-md",
          "hover:bg-sand-soft/60",
        ].join(" "),
        link: [
          "bg-transparent text-clay px-0 rounded-none",
          "underline-offset-[6px] decoration-clay/40 hover:decoration-clay hover:underline",
        ].join(" "),
      },
      size: {
        sm: "h-9 px-4 text-[13px]",
        md: "h-11 px-6 text-sm tracking-wide",
        lg: "h-13 px-8 text-[15px] tracking-wide",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
