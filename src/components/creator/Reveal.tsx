import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { useReducedMotionOrMobile } from "@/hooks/use-prefers-reduced-motion";

interface RevealProps {
  children: ReactNode;
  /** Delay in seconds before the element animates in */
  delay?: number;
  /** How far up to translate from (px) */
  y?: number;
  className?: string;
  /** When true, animation plays only once when entering the viewport */
  once?: boolean;
}

const variants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

/**
 * Tiny scroll-reveal wrapper. Wraps children in a Framer Motion div that
 * fades + slides upward when 20% of it enters the viewport.
 *
 * Disabled on mobile (<768px) and for users who prefer reduced motion —
 * scroll-driven JS reveals cause jank on mid-range Android devices, so
 * mobile gets the rendered content immediately with no animation.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  once = true,
}: RevealProps) {
  const skip = useReducedMotionOrMobile();

  if (skip) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
      variants={{
        hidden: { opacity: 0, y },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{
        duration: 0.9,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// Re-export base variants for cases where another motion component wants
// to share the same hidden/visible vocabulary.
export const revealVariants = variants;
