import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import {
  useMyCreatorProfile,
  useUpdateCreatorProfile,
} from "@/lib/queries";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { LazyImage } from "@/components/ui/lazy-image";
import {
  cloudinaryService,
  validateUploadFile,
} from "@/services/cloudinaryService";

export const Route = createFileRoute("/creator/profile")({
  component: CreatorProfile,
});

function CreatorProfile() {
  const { user } = useAuth();
  const creatorId = user?.creatorId ?? "wanjiru";
  const { data: profile } = useMyCreatorProfile(creatorId);
  const update = useUpdateCreatorProfile(creatorId);

  const [firstName, setFirstName] = useState("");
  const [fullName, setFullName] = useState("");
  const [region, setRegion] = useState("");
  const [craft, setCraft] = useState("");
  const [pullQuote, setPullQuote] = useState("");
  const [storyText, setStoryText] = useState("");
  const [saved, setSaved] = useState(false);

  const portraitInputRef = useRef<HTMLInputElement>(null);
  const headerInputRef = useRef<HTMLInputElement>(null);
  const [uploadingKind, setUploadingKind] = useState<
    "portrait" | "header" | null
  >(null);

  async function handleImageReplace(
    kind: "portrait" | "header",
    file: File | undefined,
  ) {
    if (!file) return;
    try {
      validateUploadFile(file);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid image.");
      return;
    }
    setUploadingKind(kind);
    try {
      const url = await cloudinaryService.upload(file, "ukena/creators");
      await update.mutateAsync(
        kind === "portrait" ? { portraitImage: url } : { headerImage: url },
      );
      toast.success(
        kind === "portrait" ? "Portrait updated." : "Workshop image updated.",
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploadingKind(null);
      if (portraitInputRef.current) portraitInputRef.current.value = "";
      if (headerInputRef.current) headerInputRef.current.value = "";
    }
  }

  useEffect(() => {
    if (!profile) return;
    setFirstName(profile.firstName);
    setFullName(profile.fullName);
    setRegion(profile.region);
    setCraft(profile.craft);
    setPullQuote(profile.pullQuote);
    setStoryText((profile.storyParagraphs ?? []).join("\n\n"));
  }, [profile]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    update.mutate(
      {
        firstName,
        fullName,
        region,
        craft,
        pullQuote,
        storyParagraphs: storyText.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean),
      },
      {
        onSuccess: () => {
          setSaved(true);
          setTimeout(() => setSaved(false), 1800);
        },
      },
    );
  };

  if (!profile) {
    return <div className="font-sans text-sm text-charcoal/60">Loading your story…</div>;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Your story"
        title="The page buyers meet you on."
        description="Edit how your work is introduced. Every change appears immediately on your public profile."
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="First name" value={firstName} onChange={setFirstName} />
            <Field label="Full name" value={fullName} onChange={setFullName} />
            <Field label="Region" value={region} onChange={setRegion} />
            <Field label="Craft" value={craft} onChange={setCraft} />
          </div>

          <Field
            label="Pull quote"
            value={pullQuote}
            onChange={setPullQuote}
            helper="A single sentence — what you'd want a stranger to remember."
          />

          <label className="block">
            <span className="block font-sans text-[12px] font-medium text-charcoal">
              Your story
            </span>
            <span className="block font-sans text-[11px] text-charcoal/55">
              Separate paragraphs with a blank line.
            </span>
            <textarea
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
              rows={12}
              className="mt-2 w-full rounded-lg border border-border bg-warm-white px-4 py-3 font-sans text-[14px] leading-relaxed text-charcoal outline-none focus:border-clay focus:ring-2 focus:ring-clay/15"
            />
          </label>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="rounded-full bg-clay px-6 py-2.5 font-sans text-[13px] font-medium text-warm-white hover:bg-clay-deep"
            >
              {saved ? "Saved ✓" : update.isPending ? "Saving…" : "Save changes"}
            </button>
            <a
              href={`/creators/${profile.id}`}
              target="_blank"
              rel="noreferrer"
              className="font-sans text-[13px] text-clay hover:underline"
            >
              Preview public page →
            </a>
          </div>
        </form>

        <aside className="space-y-4">
          <p className="section-label">Your portrait</p>
          <div className="relative overflow-hidden rounded-2xl">
            <LazyImage
              src={profile.portraitImage}
              alt={profile.fullName}
              className="h-72 w-full object-cover"
            />
            {uploadingKind === "portrait" && (
              <div className="absolute inset-0 grid place-items-center bg-charcoal/40 text-warm-white">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
          </div>
          <input
            ref={portraitInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="sr-only"
            onChange={(e) => handleImageReplace("portrait", e.target.files?.[0])}
          />
          <button
            type="button"
            disabled={uploadingKind !== null}
            onClick={() => portraitInputRef.current?.click()}
            className="w-full rounded-full border border-border bg-warm-white px-4 py-2 font-sans text-[12px] text-charcoal hover:bg-cream disabled:opacity-60"
          >
            {uploadingKind === "portrait" ? "Uploading…" : "Replace portrait"}
          </button>

          <p className="section-label mt-6">Workshop image</p>
          <div className="relative overflow-hidden rounded-2xl">
            <LazyImage
              src={profile.headerImage}
              alt="Workshop"
              className="h-40 w-full object-cover"
            />
            {uploadingKind === "header" && (
              <div className="absolute inset-0 grid place-items-center bg-charcoal/40 text-warm-white">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
          </div>
          <input
            ref={headerInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="sr-only"
            onChange={(e) => handleImageReplace("header", e.target.files?.[0])}
          />
          <button
            type="button"
            disabled={uploadingKind !== null}
            onClick={() => headerInputRef.current?.click()}
            className="w-full rounded-full border border-border bg-warm-white px-4 py-2 font-sans text-[12px] text-charcoal hover:bg-cream disabled:opacity-60"
          >
            {uploadingKind === "header"
              ? "Uploading…"
              : "Replace workshop image"}
          </button>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  helper,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  helper?: string;
}) {
  return (
    <label className="block">
      <span className="block font-sans text-[12px] font-medium text-charcoal">{label}</span>
      {helper && <span className="block font-sans text-[11px] text-charcoal/55">{helper}</span>}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-border bg-warm-white px-3 py-2 font-sans text-[13px] text-charcoal outline-none focus:border-clay focus:ring-2 focus:ring-clay/15"
      />
    </label>
  );
}
