import { Link } from "@tanstack/react-router";
import { ImageOff } from "lucide-react";
import type { ProductSummaryDto } from "@/services/productService";

interface Props {
  /** Creator profile portrait/cover image (any falsy → missing). */
  profileImage?: string | null;
  products: ProductSummaryDto[];
}

/**
 * Nudges the creator to add photos to their profile and any pieces that
 * are still missing a hero image. Missing photos are the single biggest
 * blocker to a sale — keep this prominent until everything has an image.
 */
export function MissingImagesBanner({ profileImage, products }: Props) {
  const missingProducts = products.filter((p) => !p.heroImage || p.heroImage.trim() === "");
  const profileMissing = !profileImage || profileImage.trim() === "";

  if (!profileMissing && missingProducts.length === 0) return null;

  return (
    <div className="rounded-2xl border border-clay/30 bg-clay/[0.06] p-5">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-clay/15 text-clay">
          <ImageOff className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-lg text-charcoal">Photos sell the work.</h3>
          <ul className="mt-2 space-y-1.5 font-sans text-[13px] text-charcoal/75">
            {profileMissing && (
              <li>
                · Your profile is missing a portrait.{" "}
                <Link to="/creator/profile" className="font-medium text-clay underline-offset-4 hover:underline">
                  Add one →
                </Link>
              </li>
            )}
            {missingProducts.length > 0 && (
              <li>
                · {missingProducts.length} {missingProducts.length === 1 ? "piece is" : "pieces are"}{" "}
                missing photos.{" "}
                <Link to="/creator/products" className="font-medium text-clay underline-offset-4 hover:underline">
                  Add them →
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
