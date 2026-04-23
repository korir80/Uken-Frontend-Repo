import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Spec mentions /account/saved — we route everything through the canonical
 * /saved page so the bottom-nav, FAB and personalised home all share state.
 */
export const Route = createFileRoute("/account/saved")({
  beforeLoad: () => {
    throw redirect({ to: "/saved" });
  },
});
