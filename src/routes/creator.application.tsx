import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatusPill } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/creator/application")({
  component: CreatorApplication,
});

function CreatorApplication() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Application"
        title="Your story to Ukena."
        description="The application you sent us, and where it sits with the curation team."
      />

      <div className="rounded-2xl border border-border/60 bg-cream/40 p-6">
        <div className="flex items-center justify-between">
          <p className="font-display text-2xl text-charcoal">Application accepted</p>
          <StatusPill label="Approved" tone="good" />
        </div>
        <p className="mt-2 font-sans text-[13px] text-charcoal/65">
          You've been a creator on Ukena since March. Your profile is live and
          your pieces are appearing in the shop.
        </p>
      </div>

      <Timeline
        items={[
          { date: "12 Mar", label: "Application submitted", body: "You sent us your portfolio and story." },
          { date: "14 Mar", label: "Under review", body: "Aluoch and Kamau on the curation team reviewed your work." },
          { date: "18 Mar", label: "Interview call", body: "A 30-minute video call to talk through your studio and pricing." },
          { date: "21 Mar", label: "Approved", body: "Welcome. Your first piece went live the same day." },
        ]}
      />
    </div>
  );
}

function Timeline({
  items,
}: {
  items: { date: string; label: string; body: string }[];
}) {
  return (
    <ol className="relative space-y-6 border-l border-border/60 pl-6">
      {items.map((item, i) => (
        <li key={i} className="relative">
          <span className="absolute -left-[31px] top-1.5 block h-2.5 w-2.5 rounded-full bg-clay" />
          <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-clay">
            {item.date}
          </p>
          <p className="mt-1 font-display text-lg text-charcoal">{item.label}</p>
          <p className="mt-1 font-sans text-[13px] text-charcoal/65">{item.body}</p>
        </li>
      ))}
    </ol>
  );
}
