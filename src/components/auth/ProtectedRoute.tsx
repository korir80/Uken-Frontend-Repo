/**
 * ProtectedRoute — wrap any route component to gate it behind auth
 * (and optionally a role). Used by /account, /dashboard, etc.
 *
 * Usage in a route file:
 *
 *   export const Route = createFileRoute("/dashboard")({
 *     component: () => (
 *       <ProtectedRoute requireRole="ROLE_CREATOR">
 *         <DashboardPage />
 *       </ProtectedRoute>
 *     ),
 *   });
 */
import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";

import { defaultPathForRole, useAuth } from "@/lib/auth";
import type { UserRole } from "@/services";

interface ProtectedRouteProps {
  children: ReactNode;
  /** Restrict to a single role. Omit for "any authenticated user". */
  requireRole?: UserRole;
  /** Where to send unauthenticated users. Defaults to /signin. */
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requireRole,
  redirectTo = "/signin",
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      navigate({ to: redirectTo });
      return;
    }

    if (requireRole && role !== requireRole) {
      // Authenticated but wrong role — send them to their own home
      navigate({ to: defaultPathForRole(role) });
    }
  }, [isAuthenticated, isLoading, role, requireRole, redirectTo, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-warm-white">
        <div className="font-display text-lg text-charcoal/60">One moment…</div>
      </div>
    );
  }

  if (!isAuthenticated) return null;
  if (requireRole && role !== requireRole) return null;

  return <>{children}</>;
}
