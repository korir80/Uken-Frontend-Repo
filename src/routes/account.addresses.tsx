import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  PageHeader,
  EmptyState,
} from "@/components/dashboard/DashboardShell";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
  useBuyerAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from "@/lib/queries";
import type { BuyerAddress, BuyerAddressInput } from "@/services";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/account/addresses")({
  component: BuyerAddresses,
});

interface DraftAddress extends BuyerAddressInput {
  id?: string;
}

function BuyerAddresses() {
  const { user } = useAuth();
  const { data: items = [], isLoading } = useBuyerAddresses();
  const create = useCreateAddress();
  const update = useUpdateAddress();
  const remove = useDeleteAddress();
  const setDefault = useSetDefaultAddress();

  const [editing, setEditing] = useState<DraftAddress | null>(null);

  function startNew() {
    setEditing({
      label: "",
      fullName: user?.fullName ?? "",
      line1: "",
      city: "",
      postcode: "",
      country: "United Kingdom",
      isDefault: items.length === 0,
    });
  }

  async function commit(addr: DraftAddress) {
    try {
      if (addr.id) {
        const { id, ...payload } = addr;
        await update.mutateAsync({ id, payload });
        toast.success("Address updated.");
      } else {
        await create.mutateAsync(addr);
        toast.success("Address saved.");
      }
      setEditing(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Couldn't save that address.",
      );
    }
  }

  async function handleDelete(id: string) {
    try {
      await remove.mutateAsync(id);
      toast.success("Address removed.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Couldn't remove that address.",
      );
    }
  }

  async function handleSetDefault(id: string) {
    try {
      await setDefault.mutateAsync(id);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Couldn't update default.",
      );
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Addresses"
        title="Where pieces find a home."
        description="Save delivery addresses so checkout is one tap. We'll always ask before sending."
        action={
          <button
            type="button"
            onClick={startNew}
            className="rounded-full bg-clay px-5 py-2.5 font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-warm-white hover:bg-clay-deep"
          >
            Add address
          </button>
        }
      />

      {isLoading ? (
        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <li
              key={i}
              className="rounded-2xl border border-border/60 bg-warm-white p-5"
            >
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="mt-3 h-3 w-3/4" />
              <Skeleton className="mt-2 h-3 w-2/3" />
              <Skeleton className="mt-2 h-3 w-1/2" />
            </li>
          ))}
        </ul>
      ) : items.length === 0 ? (
        <EmptyState
          title="No addresses yet."
          body="Add an address so checkout is faster next time."
          action={
            <button
              type="button"
              onClick={startNew}
              className="rounded-full bg-clay px-5 py-2.5 font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-warm-white hover:bg-clay-deep"
            >
              Add address
            </button>
          }
        />
      ) : (
        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {items.map((a: BuyerAddress) => (
            <li
              key={a.id}
              className={cn(
                "rounded-2xl border bg-warm-white p-5 transition-colors",
                a.isDefault
                  ? "border-clay/60 ring-1 ring-clay/20"
                  : "border-border/60",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg text-charcoal">
                    {a.label || "Address"}
                  </p>
                  {a.isDefault && (
                    <span className="mt-1 inline-flex rounded-full bg-clay/15 px-2 py-0.5 font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-clay-deep">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1 text-right">
                  <button
                    type="button"
                    onClick={() => setEditing({ ...a })}
                    className="font-sans text-[12px] text-charcoal/70 hover:text-clay"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(a.id)}
                    disabled={remove.isPending}
                    className="font-sans text-[12px] text-destructive hover:underline disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="mt-3 font-sans text-[13px] leading-relaxed text-charcoal/80">
                <p>{a.fullName}</p>
                <p>{a.line1}</p>
                {a.line2 && <p>{a.line2}</p>}
                <p>
                  {a.city}, {a.postcode}
                </p>
                <p>{a.country}</p>
              </div>
              {!a.isDefault && (
                <button
                  type="button"
                  onClick={() => handleSetDefault(a.id)}
                  disabled={setDefault.isPending}
                  className="mt-4 font-sans text-[11px] uppercase tracking-[0.22em] text-clay hover:underline disabled:opacity-50"
                >
                  Set as default
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <AddressEditor
          value={editing}
          saving={create.isPending || update.isPending}
          onCancel={() => setEditing(null)}
          onSave={commit}
        />
      )}
    </div>
  );
}

function AddressEditor({
  value,
  saving,
  onCancel,
  onSave,
}: {
  value: DraftAddress;
  saving: boolean;
  onCancel: () => void;
  onSave: (a: DraftAddress) => void;
}) {
  const [draft, setDraft] = useState(value);
  function set<K extends keyof DraftAddress>(key: K, v: DraftAddress[K]) {
    setDraft((prev) => ({ ...prev, [key]: v }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal/40 p-3 backdrop-blur-sm sm:items-center sm:p-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(draft);
        }}
        className="flex max-h-[calc(100vh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-warm-white shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          <h2 className="font-display text-xl text-charcoal">
            {value.id ? "Edit address" : "New address"}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="font-sans text-[13px] text-charcoal/60 hover:text-charcoal"
          >
            Cancel
          </button>
        </header>
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          <Field
            label="Label"
            value={draft.label}
            onChange={(v) => set("label", v)}
            placeholder="Home, Studio…"
          />
          <Field
            label="Full name"
            value={draft.fullName}
            onChange={(v) => set("fullName", v)}
            required
          />
          <Field
            label="Address line 1"
            value={draft.line1}
            onChange={(v) => set("line1", v)}
            required
          />
          <Field
            label="Address line 2"
            value={draft.line2 ?? ""}
            onChange={(v) => set("line2", v)}
          />
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="City"
              value={draft.city}
              onChange={(v) => set("city", v)}
              required
            />
            <Field
              label="Postcode"
              value={draft.postcode}
              onChange={(v) => set("postcode", v)}
              required
            />
          </div>
          <Field
            label="Country"
            value={draft.country}
            onChange={(v) => set("country", v)}
            required
          />
          <label className="flex items-center gap-2 font-sans text-[13px] text-charcoal/80">
            <input
              type="checkbox"
              checked={draft.isDefault}
              onChange={(e) => set("isDefault", e.target.checked)}
              className="h-4 w-4 accent-clay"
            />
            Make this my default
          </label>
        </div>
        <footer className="flex items-center justify-end gap-3 border-t border-border/60 px-5 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-border/60 px-4 py-2 font-sans text-[12px] text-charcoal/70 hover:text-charcoal"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-clay px-5 py-2 font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-warm-white hover:bg-clay-deep disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save address"}
          </button>
        </footer>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="font-sans text-[11px] uppercase tracking-[0.22em] text-charcoal/55">
        {label}
      </span>
      <input
        type="text"
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-border/70 bg-warm-white px-3 py-2.5 font-sans text-[14px] text-charcoal focus:border-clay focus:outline-none"
      />
    </label>
  );
}
