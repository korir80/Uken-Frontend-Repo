import type { ReactNode } from "react";
import { ExploreNav } from "@/components/explore/ExploreNav";
import { Footer } from "@/components/home/Footer";

export function JoinShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-warm-white text-charcoal">
      <ExploreNav />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
