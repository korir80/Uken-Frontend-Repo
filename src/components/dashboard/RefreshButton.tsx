import { useState } from "react";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RefreshButtonProps {
  /** Query keys to invalidate + refetch. If omitted, refetches all active queries. */
  queryKeys?: QueryKey[];
  /** Dark sidebar context (admin) — uses gold accent. */
  dark?: boolean;
  className?: string;
  label?: string;
}

/**
 * Force-reloads dashboard data from the backend, bypassing cache.
 * Invalidates the supplied query keys (or all active queries) and awaits a fresh fetch.
 */
export function RefreshButton({
  queryKeys,
  dark = false,
  className,
  label = "Refresh",
}: RefreshButtonProps) {
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    if (busy) return;
    setBusy(true);
    try {
      if (queryKeys && queryKeys.length > 0) {
        await Promise.all(
          queryKeys.map((key) =>
            qc.invalidateQueries({ queryKey: key, refetchType: "all" }),
          ),
        );
      } else {
        // Refetch every active query — no cached value is trusted.
        await qc.invalidateQueries({ refetchType: "all" });
      }
      toast.success("Refreshed from server.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't refresh.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      aria-label="Reload data from server"
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 font-sans text-[12px] font-medium transition-colors disabled:opacity-60",
        dark
          ? "border border-[#D4A96A]/50 text-[#D4A96A] hover:bg-[#D4A96A] hover:text-[#1a0f07]"
          : "border border-clay/40 text-clay hover:bg-clay hover:text-warm-white",
        className,
      )}
    >
      <RefreshIcon spinning={busy} />
      {busy ? "Refreshing…" : label}
    </button>
  );
}

function RefreshIcon({ spinning }: { spinning: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={spinning ? "animate-spin" : undefined}
    >
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <path d="M21 4v5h-5" />
    </svg>
  );
}
