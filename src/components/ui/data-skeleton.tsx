/**
 * Reusable loading skeleton used by data-fetched sections (creator grid,
 * product gallery, order history, etc.). Visually quiet — matches the
 * editorial palette so it never feels like a generic SaaS shimmer.
 */
import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-charcoal/[0.06]",
        className,
      )}
      {...props}
    />
  );
}

export function CreatorCardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="h-3 w-full" />
    </div>
  );
}
