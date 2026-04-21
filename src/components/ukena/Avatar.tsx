import { cn } from "@/lib/utils";
import { useState, type HTMLAttributes } from "react";

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  ring?: boolean;
}

const sizeMap = {
  sm: "h-8 w-8 text-[11px]",
  md: "h-11 w-11 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-xl",
} as const;

function initials(name?: string) {
  if (!name) return "";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function Avatar({
  src,
  alt,
  name,
  size = "md",
  ring = false,
  className,
  ...props
}: AvatarProps) {
  const [errored, setErrored] = useState(false);
  const showImage = src && !errored;

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-full bg-sand-soft font-display font-medium text-clay-deep shrink-0",
        ring && "ring-1 ring-border ring-offset-2 ring-offset-background",
        sizeMap[size],
        className,
      )}
      {...props}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt ?? name ?? "avatar"}
          onError={() => setErrored(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="leading-none">{initials(name) || "•"}</span>
      )}
    </div>
  );
}
