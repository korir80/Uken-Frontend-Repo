import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Eye, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import {
  useMyCreatorProfile,
  useUpdateCreatorProfile,
  useAllProducts,
  useCreators,
} from "@/lib/queries";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { LazyImage } from "@/components/ui/lazy-image";
import { CloudinaryImagePicker } from "@/components/uploads/CloudinaryImagePicker";
import { ConsentCheckbox } from "@/components/ukena";
import { cloudinaryService, validateUploadFile } from "@/services/cloudinaryService";
import { CreatorSocialFeed } from "@/components/creator/CreatorSocialFeed";
import type { CreatorProfile as CreatorProfileShape } from "@/components/creator/creator-profile-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/creator/profile")({
  component: CreatorProfile,
});

// Keeps image URL and caption together so captions survive every re-render,
// re-order, and save without ever being dropped.
interface ProcessStepDraft {
  image: string;
  caption: string;
}

function CreatorProfile() {
  const { user } = useAuth();
  const creatorId = user?.creatorId ?? "wanjiru";

  // useMyCreatorProfile key = queryKeys.myProfile() = ["profile", "me"]
  // useUpdateCreatorProfile.onSuccess calls qc.setQueryData(queryKeys.myProfile(), data)
  // so after every successful save, this query is updated with the backend
  // response — which now includes the saved processSteps — and useEffect
  // re-hydrates the form with the correct captions.
  const { data: profile } = useMyCreatorProfile(creatorId);
  const update = useUpdateCreatorProfile(creatorId);

  const [firstName, setFirstName] = useState("");
  const [fullName, setFullName] = useState("");
  const [region, setRegion] = useState("");
  const [craft, setCraft] = useState("");
  const [pullQuote, setPullQuote] = useState("");
  const [storyText, setStoryText] = useState("");
  const [saved, setSaved] = useState(false);

  // Single source of truth for workshop gallery — both URL and caption live
  // here so captions are never dropped when images are added or removed.
  const [processSteps, setProcessSteps] = useState<ProcessStepDraft[]>([]);
  // DPA 2019: explicit consent per save so the maker actively re-affirms
  // their rights to publish photos & text on every change.
  const [consent, setConsent] = useState(false);

  const portraitInputRef = useRef<HTMLInputElement>(null);
  const headerInputRef = useRef<HTMLInputElement>(null);
  const [uploadingKind, setUploadingKind] = useState<"portrait" | "header" | null>(null);
  // Staged file + preview blob so the maker confirms before the upload runs.
  const [staged, setStaged] = useState<
    | { kind: "portrait" | "header"; file: File; preview: string }
    | null
  >(null);

  // Hydrate all fields whenever profile data arrives or is updated by a save.
  // Because useUpdateCreatorProfile does qc.setQueryData(queryKeys.myProfile(), data)
  // on success, this fires after every save with the fresh backend response.
  useEffect(() => {
    if (!profile) return;
    setFirstName(profile.firstName ?? "");
    setFullName(profile.fullName ?? "");
    setRegion(profile.region ?? "");
    setCraft(profile.craft ?? "");
    setPullQuote(profile.pullQuote ?? "");
    setStoryText((profile.storyParagraphs ?? []).join("\n\n"));
    setProcessSteps(
      (profile.processSteps ?? []).map((s) => ({
        image: s.image ?? "",
        caption: s.caption ?? "",
      })),
    );
  }, [profile]);

  // When the image picker changes the URL list (add / remove / reorder),
  // merge with existing captions so captions typed before are not wiped.
  function handleWorkshopImagesChange(urls: string[]) {
    setProcessSteps((prev) =>
      urls.map((url, i) => ({
        image: url,
        // Prefer the caption already attached to this exact URL (stable on
        // reorder), then fall back to same-position caption, then empty.
        caption: prev.find((s) => s.image === url)?.caption ?? prev[i]?.caption ?? "",
      })),
    );
  }

  // Portrait and header are replaced via direct file-input clicks.
  // Each saves immediately and independently via PUT /creators/me so the
  // public page updates without waiting for the main form save.
  function stageImage(kind: "portrait" | "header", file: File | undefined) {
    if (!file) return;
    try {
      validateUploadFile(file);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid image.");
      return;
    }
    if (staged) URL.revokeObjectURL(staged.preview);
    setStaged({ kind, file, preview: URL.createObjectURL(file) });
    if (portraitInputRef.current) portraitInputRef.current.value = "";
    if (headerInputRef.current) headerInputRef.current.value = "";
  }

  function cancelStaged() {
    if (!staged) return;
    URL.revokeObjectURL(staged.preview);
    setStaged(null);
  }

  async function confirmStaged() {
    if (!staged) return;
    if (!consent) {
      toast.error("Please tick the consent box before uploading a new image.");
      return;
    }
    const { kind, file, preview } = staged;
    setUploadingKind(kind);
    try {
      const url = await cloudinaryService.upload(file, "ukena/creators");
      await update.mutateAsync(kind === "portrait" ? { portraitImage: url } : { headerImage: url });
      toast.success(kind === "portrait" ? "Avatar updated." : "Cover banner updated.");
      URL.revokeObjectURL(preview);
      setStaged(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploadingKind(null);
    }
  }


  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      toast.error("Please tick the consent box before saving your changes.");
      return;
    }
    update.mutate(
      {
        firstName,
        fullName,
        region,
        craft,
        pullQuote,
        storyParagraphs: storyText
          .split(/\n{2,}/)
          .map((p) => p.trim())
          .filter(Boolean),
        // Send full processSteps (image + caption). The backend persists these
        // to the process_steps TEXT column and returns them in every
        // GET /creators/me response, making them visible in CreatorGallery
        // and CreatorProcess on the public profile page.
        processSteps: processSteps.filter((s) => !!s.image),
      },
      {
        onSuccess: () => {
          setSaved(true);
          setConsent(false);
          setTimeout(() => setSaved(false), 1800);
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : "Save failed.");
        },
      },
    );
  };

  if (!profile) {
    return <div className="font-sans text-sm text-charcoal/60">Loading your story…</div>;
  }

  const workshopImageUrls = processSteps.map((s) => s.image).filter(Boolean);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Your story"
        title="The page buyers meet you on."
        description="Edit how your work is introduced. Every change appears immediately on your public profile."
        refreshKeys={[]}
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* ── Main form ── */}
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
            <span className="block font-sans text-[12px] font-medium text-charcoal">Your story</span>
            <span className="block font-sans text-[11px] text-charcoal/55">Separate paragraphs with a blank line.</span>
            <textarea
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
              rows={12}
              className="mt-2 w-full rounded-lg border border-border bg-warm-white px-4 py-3 font-sans text-[14px] leading-relaxed text-charcoal outline-none focus:border-clay focus:ring-2 focus:ring-clay/15"
            />
          </label>

          {/* ── Workshop gallery ──
              CloudinaryImagePicker uploads each file to Cloudinary and calls
              handleWorkshopImagesChange with the new URL list. We merge those
              URLs with the caption state. On save, processSteps goes to the
              backend as [{image, caption}] and is now persisted (once the
              backend fix is applied). The public CreatorGallery and
              CreatorProcess components both read processSteps and will show
              all uploaded images. */}
          <div className="rounded-2xl border border-border bg-warm-white p-4 md:p-5 space-y-5">
            <CloudinaryImagePicker
              label="Workshop gallery"
              helper="Up to 12 photographs of your space, tools, hands and process. These appear in the gallery and process walkthrough on your public profile."
              value={workshopImageUrls}
              onChange={handleWorkshopImagesChange}
              max={12}
              folder="ukena/creators/workshop"
              aspect="square"
            />

            {workshopImageUrls.length > 0 && (
              <div className="space-y-3 border-t border-border/40 pt-4">
                <p className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-charcoal/55">
                  Captions (optional — shown in the process walkthrough)
                </p>
                {processSteps
                  .filter((s) => !!s.image)
                  .map((step, i) => (
                    <div key={`${step.image}-${i}`} className="flex items-center gap-3">
                      <span className="w-6 shrink-0 font-display text-[13px] leading-none text-terracotta/60">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <input
                        type="text"
                        value={step.caption}
                        placeholder={`Caption for photo ${i + 1}`}
                        onChange={(e) => {
                          const val = e.target.value;
                          setProcessSteps((prev) => {
                            const next = [...prev];
                            const idx = prev.findIndex((s) => s.image === step.image);
                            if (idx !== -1) {
                              next[idx] = { ...next[idx], caption: val };
                            }
                            return next;
                          });
                        }}
                        className="flex-1 rounded-lg border border-border bg-warm-white px-3 py-1.5 font-sans text-[13px] text-charcoal outline-none focus:border-clay focus:ring-2 focus:ring-clay/15"
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>

          <ConsentCheckbox
            id="profile-consent"
            checked={consent}
            onChange={setConsent}
            label={
              <>
                I confirm I own (or have permission to share) the photos and
                words above, and I'm happy for UKEN to publish them on my
                public maker page. Handled under our Privacy Notice and the
                Kenya Data Protection Act (2019).
              </>
            }
          />

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={update.isPending || !consent}
              className="rounded-full bg-clay px-6 py-2.5 font-sans text-[13px] font-medium text-warm-white hover:bg-clay-deep disabled:opacity-60"
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

        {/* ── Aside: avatar + cover (save immediately on upload) ── */}
        <aside className="space-y-4">
          {/* Avatar — round profile photo */}
          <p className="font-sans text-[12px] font-medium uppercase tracking-[0.22em] text-charcoal/55">
            Profile photo (avatar)
          </p>
          <p className="font-sans text-[11px] text-charcoal/50 -mt-2">
            Square crop, your face or hands. Shown as a round avatar on your
            public profile and next to every post.
          </p>
          <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-full border border-border bg-cream">
            <LazyImage
              src={staged?.kind === "portrait" ? staged.preview : profile.portraitImage}
              alt={profile.fullName}
              className="h-full w-full object-cover"
            />
            {uploadingKind === "portrait" && (
              <div className="absolute inset-0 grid place-items-center bg-charcoal/40 text-warm-white">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
          </div>
          {staged?.kind === "portrait" && (
            <p className="text-center font-sans text-[11px] uppercase tracking-[0.18em] text-clay">
              Preview · not uploaded yet
            </p>
          )}
          <input
            ref={portraitInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(e) => stageImage("portrait", e.target.files?.[0])}
          />
          {staged?.kind === "portrait" ? (
            <div className="flex gap-2">
              <button
                type="button"
                disabled={uploadingKind !== null || !consent}
                onClick={confirmStaged}
                className="flex-1 rounded-full bg-clay px-4 py-2 font-sans text-[12px] text-warm-white hover:bg-clay-deep disabled:opacity-60"
              >
                {uploadingKind === "portrait" ? "Uploading…" : "Confirm upload"}
              </button>
              <button
                type="button"
                disabled={uploadingKind !== null}
                onClick={cancelStaged}
                className="rounded-full border border-border bg-warm-white px-4 py-2 font-sans text-[12px] text-charcoal hover:bg-cream disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={uploadingKind !== null}
              onClick={() => portraitInputRef.current?.click()}
              className="w-full rounded-full border border-border bg-warm-white px-4 py-2 font-sans text-[12px] text-charcoal hover:bg-cream disabled:opacity-60"
            >
              Choose new avatar
            </button>
          )}

          {/* Cover banner — wide */}
          <p className="font-sans text-[12px] font-medium uppercase tracking-[0.22em] text-charcoal/55 mt-6">
            Cover banner
          </p>
          <p className="font-sans text-[11px] text-charcoal/50 -mt-2">
            Wide image (3:1) — your workshop, hands at work, or finished
            pieces. Shown as the banner at the top of your profile.
          </p>
          <div className="relative aspect-[3/1] w-full overflow-hidden rounded-xl bg-cream">
            <LazyImage
              src={staged?.kind === "header" ? staged.preview : profile.headerImage}
              alt="Cover"
              className="h-full w-full object-cover"
            />
            {uploadingKind === "header" && (
              <div className="absolute inset-0 grid place-items-center bg-charcoal/40 text-warm-white">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
          </div>
          {staged?.kind === "header" && (
            <p className="text-center font-sans text-[11px] uppercase tracking-[0.18em] text-clay">
              Preview · not uploaded yet
            </p>
          )}
          <input
            ref={headerInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(e) => stageImage("header", e.target.files?.[0])}
          />
          {staged?.kind === "header" ? (
            <div className="flex gap-2">
              <button
                type="button"
                disabled={uploadingKind !== null || !consent}
                onClick={confirmStaged}
                className="flex-1 rounded-full bg-clay px-4 py-2 font-sans text-[12px] text-warm-white hover:bg-clay-deep disabled:opacity-60"
              >
                {uploadingKind === "header" ? "Uploading…" : "Confirm upload"}
              </button>
              <button
                type="button"
                disabled={uploadingKind !== null}
                onClick={cancelStaged}
                className="rounded-full border border-border bg-warm-white px-4 py-2 font-sans text-[12px] text-charcoal hover:bg-cream disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={uploadingKind !== null}
              onClick={() => headerInputRef.current?.click()}
              className="w-full rounded-full border border-border bg-warm-white px-4 py-2 font-sans text-[12px] text-charcoal hover:bg-cream disabled:opacity-60"
            >
              Choose new cover banner
            </button>
          )}


          {/* Guide so the maker knows exactly where each image appears */}
          <div className="rounded-xl border border-border/60 bg-cream/60 p-4 space-y-2 mt-2">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-charcoal/55">
              Where each image appears
            </p>
            <ul className="space-y-2 font-sans text-[12px] text-charcoal/70 leading-relaxed">
              <li>
                <span className="text-terracotta font-medium">Avatar</span> — round photo of you. Top of profile + every post.
              </li>
              <li>
                <span className="text-terracotta font-medium">Cover</span> — wide banner image at the very top.
              </li>
              <li>
                <span className="text-terracotta font-medium">Gallery</span> — up to 12 process photos shown in the "In the workshop" post.
              </li>
            </ul>
          </div>
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
