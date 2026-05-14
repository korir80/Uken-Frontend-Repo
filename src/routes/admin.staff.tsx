import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader, StatusPill } from "@/components/dashboard/DashboardShell";
import {
  staffService,
  type StaffMember,
  type StaffCreatePayload,
} from "@/services/staffService";

export const Route = createFileRoute("/admin/staff")({
  component: AdminStaff,
});

const KEY = ["admin", "staff"] as const;

function AdminStaff() {
  const qc = useQueryClient();
  const { data, isLoading, isError, refetch } = useQuery<StaffMember[]>({
    queryKey: KEY,
    queryFn: () => staffService.list(),
  });
  const staff = Array.isArray(data) ? data : [];

  const create = useMutation({
    mutationFn: (p: StaffCreatePayload) => staffService.create(p),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Staff member added.");
      setOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<StaffCreatePayload>({
    fullName: "",
    email: "",
    password: "",
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    create.mutate(form);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Staff"
        title="Admin & support team."
        action={
          <button
            onClick={() => {
              setForm({ fullName: "", email: "", password: "" });
              setOpen(true);
            }}
            className="rounded-full bg-clay px-5 py-2 font-sans text-[13px] font-medium text-warm-white hover:bg-clay-deep"
          >
            + Add staff
          </button>
        }
      />

      {isLoading ? (
        <Skeleton />
      ) : isError ? (
        <p className="rounded-2xl border border-destructive/30 bg-destructive/5 px-5 py-6 text-center font-sans text-[13px] text-destructive">
          Couldn't load staff.{" "}
          <button onClick={() => refetch()} className="underline">
            Retry
          </button>
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border/60">
          <table className="min-w-[600px] divide-y divide-border/60 sm:min-w-full">
            <thead className="bg-cream/60 text-left">
              <tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Role</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 bg-warm-white">
              {staff.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-3 font-display text-base text-charcoal">{s.fullName}</td>
                  <td className="px-4 py-3 font-sans text-[13px] text-charcoal/70">{s.email}</td>
                  <td className="px-4 py-3">
                    <StatusPill
                      label={s.role === "ROLE_ADMIN" ? "admin" : "support"}
                      tone={s.role === "ROLE_ADMIN" ? "good" : "neutral"}
                    />
                  </td>
                </tr>
              ))}
              {staff.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center font-sans text-[13px] text-charcoal/60">
                    No staff yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 p-4" onClick={() => !create.isPending && setOpen(false)}>
          <form
            onSubmit={submit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md space-y-3 rounded-2xl bg-warm-white p-6 shadow-2xl"
          >
            <h3 className="font-display text-xl text-charcoal">Add staff</h3>

            <Field label="Full name">
              <input
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                required
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-[13px] focus:border-clay focus:outline-none"
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-[13px] focus:border-clay focus:outline-none"
              />
            </Field>
            <Field label="Password (min 8 chars)">
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={8}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-[13px] focus:border-clay focus:outline-none"
              />
            </Field>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={create.isPending}
                className="rounded-full border border-border px-4 py-2 text-[13px] text-charcoal/70 hover:bg-cream/60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={create.isPending}
                className="rounded-full bg-clay px-5 py-2 text-[13px] font-medium text-warm-white hover:bg-clay-deep disabled:opacity-60"
              >
                {create.isPending ? "Saving…" : "Add staff"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block font-sans text-[12px] font-medium text-charcoal">{label}</span>
      {children}
    </label>
  );
}

function Skeleton() {
  return (
    <div className="space-y-2 rounded-2xl border border-border/60 p-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-10 animate-pulse rounded bg-charcoal/[0.06]" />
      ))}
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-4 py-3 font-sans text-[11px] uppercase tracking-[0.18em] text-charcoal/60 ${className}`}>
      {children}
    </th>
  );
}
