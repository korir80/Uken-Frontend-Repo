/**
 * Lightweight client-side role gate.
 *
 * The real gate will be a TanStack Router `beforeLoad` redirect once the
 * Spring Boot session can be verified server-side. For now, we just bounce
 * to /signin in `useEffect` if the role doesn't match.
 */
import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import type { UserRole } from "@/services";

interface RoleGuardProps {
  role: UserRole;
  children: ReactNode;
}

export function RoleGuard({ role, children }: RoleGuardProps) {
  const { isLoading, isAuthenticated, role: current } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate({ to: "/signin" });
      return;
    }
    if (current !== role) {
      // Wrong dashboard for this role — send home.
      navigate({ to: "/" });
    }
  }, [isLoading, isAuthenticated, current, role, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-warm-white">
        <div className="font-display text-lg text-charcoal/60">One moment…</div>
      </div>
    );
  }
  if (!isAuthenticated || current !== role) return null;
  return <>{children}</>;
}
