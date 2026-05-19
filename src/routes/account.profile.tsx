import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/account/profile")({
  component: BuyerProfile,
});

interface ProfileDraft {
  fullName: string;
  email: string;
  phone: string;
  prefMarketing: boolean;
  prefStories: boolean;
  prefDrops: boolean;
}

const STORAGE_KEY = "ukena.buyer.profile";

function load(fallback: ProfileDraft): ProfileDraft {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) };
  } catch {
    return fallback;
  }
}

function BuyerProfile() {
  const { user } = useAuth();
  const [draft, setDraft] = useState<ProfileDraft>({
    fullName: "",
    email: "",
    phone: "",
    prefMarketing: false,
    prefStories: true,
    prefDrops: true,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(
      load({
        fullName: user?.fullName ?? "",
        email: user?.email ?? "",
        phone: "",
        prefMarketing: false,
        prefStories: true,
        prefDrops: true,
      }),
    );
  }, [user]);

  function set<K extends keyof ProfileDraft>(key: K, v: ProfileDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: v }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    }
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Profile"
        title="Your details."
        description="Keep your name, email and preferences up to date so we can reach you."
      />

      <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5 rounded-2xl border border-border/60 bg-warm-white p-6">
          <h2 className="font-display text-lg text-charcoal">Contact</h2>
          <Field label="Full name" value={draft.fullName} onChange={(v) => set("fullName", v)} />
          <Field label="Email" type="email" value={draft.email} onChange={(v) => set("email", v)} />
          <Field label="Phone" type="tel" value={draft.phone} onChange={(v) => set("phone", v)} placeholder="+44…" />

          <div className="border-t border-border/60 pt-5">
            <h2 className="font-display text-lg text-charcoal">Communications</h2>
            <p className="mt-1 font-sans text-[12px] text-charcoal/55">
              Choose what you'd like to hear about.
            </p>
            <div className="mt-4 space-y-3">
              <Toggle
                label="Maker stories"
                hint="Studio visits, the journey behind a piece."
                checked={draft.prefStories}
                onChange={(v) => set("prefStories", v)}
              />
              <Toggle
                label="New drops"
                hint="Fresh pieces from your saved makers."
                checked={draft.prefDrops}
                onChange={(v) => set("prefDrops", v)}
              />
              <Toggle
                label="Marketing & offers"
                hint="Occasional curated edits & seasonal previews."
                checked={draft.prefMarketing}
                onChange={(v) => set("prefMarketing", v)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="rounded-full bg-clay px-6 py-2.5 font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-warm-white hover:bg-clay-deep"
            >
              Save changes
            </button>
            {saved && (
              <span className="font-sans text-[12px] text-clay-deep">Saved.</span>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border/60 bg-cream/40 p-5">
            <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-charcoal/55">
              Account
            </p>
            <p className="mt-2 font-display text-lg text-charcoal">{draft.fullName || "—"}</p>
            <p className="font-sans text-[12px] text-charcoal/60">{draft.email}</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-warm-white p-5">
            <p className="font-display text-base text-charcoal">Need to delete your account?</p>
            <p className="mt-1 font-sans text-[12px] text-charcoal/60">
              Call Andrew Soi on +44 7425 241649 (UK) or Edwin Agasa on +254 720 848 695 (Kenya) and we'll help you remove your data.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="font-sans text-[11px] uppercase tracking-[0.22em] text-charcoal/55">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-border/70 bg-warm-white px-3 py-2.5 font-sans text-[14px] text-charcoal focus:border-clay focus:outline-none"
      />
    </label>
  );
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border/60 px-4 py-3 transition-colors hover:border-clay/40">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 accent-clay"
      />
      <span className="flex-1">
        <span className="block font-sans text-[13px] font-medium text-charcoal">{label}</span>
        {hint && <span className="mt-0.5 block font-sans text-[12px] text-charcoal/55">{hint}</span>}
      </span>
    </label>
  );
}
