import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader, StatusPill } from "@/components/dashboard/DashboardShell";
import {
  deliveryZoneService,
  type DeliveryZoneDto,
  type DeliveryZoneInput,
} from "@/services/deliveryZoneService";
import { formatGBP } from "@/lib/cart";

export const Route = createFileRoute("/admin/delivery-zones")({
  component: AdminDeliveryZones,
});

const KEY = ["admin", "delivery-zones"] as const;

function emptyInput(): DeliveryZoneInput {
  return { name: "", country: "", shippingPence: 0, active: true, sortOrder: 0 };
}

function AdminDeliveryZones() {
  const qc = useQueryClient();
  const { data, isLoading, isError, refetch } = useQuery<DeliveryZoneDto[]>({
    queryKey: KEY,
    queryFn: () => deliveryZoneService.listAdmin(),
  });
  const zones = Array.isArray(data) ? data : [];

  const create = useMutation({
    mutationFn: (p: DeliveryZoneInput) => deliveryZoneService.create(p),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Zone added.");
      setOpen(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: DeliveryZoneInput }) =>
      deliveryZoneService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Zone updated.");
      setOpen(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: (id: string) => deliveryZoneService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Zone removed.");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const [open, setOpen] = useState<
    null | { mode: "create" } | { mode: "edit"; zone: DeliveryZoneDto }
  >(null);

  function handleSubmit(input: DeliveryZoneInput) {
    if (open?.mode === "edit") {
      update.mutate({ id: open.zone.id, payload: input });
    } else {
      create.mutate(input);
    }
  }

  function toggleActive(z: DeliveryZoneDto) {
    update.mutate({
      id: z.id,
      payload: {
        name: z.name,
        country: z.country,
        shippingPence: z.shippingPence,
        active: !z.active,
        sortOrder: z.sortOrder ?? 0,
      },
    });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Delivery"
        title="Delivery zones."
        description="Configure shipping fees per region. Zones are shown to buyers at checkout."
        action={
          <button
            onClick={() => setOpen({ mode: "create" })}
            className="rounded-full bg-clay px-5 py-2 font-sans text-[13px] font-medium text-warm-white hover:bg-clay-deep"
          >
            + Add zone
          </button>
        }
      />

      {isLoading ? (
        <Skeleton />
      ) : isError ? (
        <p className="rounded-2xl border border-destructive/30 bg-destructive/5 px-5 py-6 text-center font-sans text-[13px] text-destructive">
          Couldn't load zones.{" "}
          <button onClick={() => refetch()} className="underline">
            Retry
          </button>
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border/60">
          <table className="min-w-[720px] divide-y divide-border/60 sm:min-w-full">
            <thead className="bg-cream/60 text-left">
              <tr>
                <Th>Name</Th>
                <Th>Country</Th>
                <Th className="text-right">Shipping fee</Th>
                <Th>Status</Th>
                <Th className="text-right">Sort order</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 bg-warm-white">
              {zones.map((z) => (
                <tr key={z.id}>
                  <td className="px-4 py-3 font-display text-base text-charcoal">{z.name}</td>
                  <td className="px-4 py-3 font-sans text-[13px] text-charcoal/70">{z.country}</td>
                  <td className="px-4 py-3 text-right font-sans text-[13px] text-charcoal">
                    {formatGBP(z.shippingPence)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill
                      label={z.active ? "active" : "inactive"}
                      tone={z.active ? "good" : "neutral"}
                    />
                  </td>
                  <td className="px-4 py-3 text-right font-sans text-[13px] text-charcoal/70">
                    {z.sortOrder ?? 0}
                  </td>
                  <td className="px-4 py-3 text-right font-sans text-[12px]">
                    <div className="inline-flex items-center gap-3">
                      <button
                        onClick={() => setOpen({ mode: "edit", zone: z })}
                        className="text-clay hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleActive(z)}
                        className="text-charcoal/70 hover:underline"
                      >
                        {z.active ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete zone "${z.name}"?`)) {
                            remove.mutate(z.id);
                          }
                        }}
                        className="text-destructive hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {zones.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center font-sans text-[13px] text-charcoal/60">
                    No delivery zones yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <ZoneModal
          initial={open.mode === "edit" ? open.zone : undefined}
          onClose={() => setOpen(null)}
          onSubmit={handleSubmit}
          pending={create.isPending || update.isPending}
        />
      )}
    </div>
  );
}

function ZoneModal({
  initial,
  onClose,
  onSubmit,
  pending,
}: {
  initial?: DeliveryZoneDto;
  onClose: () => void;
  onSubmit: (i: DeliveryZoneInput) => void;
  pending: boolean;
}) {
  const [form, setForm] = useState<DeliveryZoneInput>(
    initial
      ? {
          name: initial.name,
          country: initial.country,
          shippingPence: initial.shippingPence,
          active: initial.active ?? true,
          sortOrder: initial.sortOrder ?? 0,
        }
      : emptyInput(),
  );
  const [feePounds, setFeePounds] = useState(
    (form.shippingPence / 100).toFixed(2),
  );

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.country.trim()) {
      toast.error("Name and country are required.");
      return;
    }
    const pence = Math.round(parseFloat(feePounds || "0") * 100);
    if (Number.isNaN(pence) || pence < 0) {
      toast.error("Shipping fee must be a positive number.");
      return;
    }
    onSubmit({ ...form, shippingPence: pence });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 p-4" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md space-y-3 rounded-2xl bg-warm-white p-6 shadow-2xl"
      >
        <h3 className="font-display text-xl text-charcoal">
          {initial ? "Edit zone" : "Add delivery zone"}
        </h3>

        <Field label="Zone name">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-[13px] focus:border-clay focus:outline-none"
          />
        </Field>
        <Field label="Country">
          <input
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-[13px] focus:border-clay focus:outline-none"
          />
        </Field>
        <Field label="Shipping fee (£)">
          <input
            type="number"
            step="0.01"
            min="0"
            value={feePounds}
            onChange={(e) => setFeePounds(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-[13px] focus:border-clay focus:outline-none"
          />
        </Field>
        <Field label="Sort order">
          <input
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value || "0", 10) })}
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-[13px] focus:border-clay focus:outline-none"
          />
        </Field>
        <label className="flex items-center gap-2 font-sans text-[13px] text-charcoal">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          Active
        </label>

        <div className="flex justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="rounded-full border border-border px-4 py-2 text-[13px] text-charcoal/70 hover:bg-cream/60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-clay px-5 py-2 text-[13px] font-medium text-warm-white hover:bg-clay-deep disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
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
