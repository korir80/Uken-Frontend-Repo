/**
 * Mock product catalogue.
 *
 * The shape mirrors the future Spring Boot /api/products contract.
 * Every product carries inline creator attribution so any surface that
 * renders a product can also render "by [name]" without a join lookup.
 */

import productMara from "@/assets/product-basket-mara.jpg";
import productHighland from "@/assets/product-vessel-highland.jpg";
import productMat from "@/assets/product-mat-spiral.jpg";
import productTall from "@/assets/product-basket-tall.jpg";

import workshop from "@/assets/creator-workshop-wanjiru.jpg";
import processFibre from "@/assets/process-fibre.jpg";
import processDye from "@/assets/process-dye.jpg";
import processWeave from "@/assets/process-weave.jpg";

import portraitWanjiru from "@/assets/portrait-wanjiru.jpg";

export interface ProductCreatorRef {
  id: string;
  firstName: string;
  fullName: string;
  region: string;
  craft: string;
  portrait: string;
}

export interface Product {
  id: string;
  name: string;
  /** Price in pennies, GBP */
  pricePence: number;
  /** Primary product image */
  heroImage: string;
  /** Additional images — process and detail shots, not just the finished piece */
  gallery: { src: string; alt: string; kind: "product" | "process" }[];
  /** Specific to THIS piece — never a generic catalogue blurb */
  pieceStory: string;
  materials: string[];
  /** Free-form dimensions, kept short */
  dimensions: string;
  /** Single-line care */
  care: string;
  /** Stated lead time band, surfaced near the buy button */
  leadTimeDays: { min: number; max: number };
  creator: ProductCreatorRef;
}

const wanjiru: ProductCreatorRef = {
  id: "wanjiru",
  firstName: "Wanjiru",
  fullName: "Wanjiru Kamau",
  region: "Maragua, Murang'a",
  craft: "Weaving",
  portrait: portraitWanjiru,
};

export const products: Record<string, Product> = {
  "p-mara-01": {
    id: "p-mara-01",
    name: "Mara Storage Basket",
    pricePence: 12800,
    heroImage: productMara,
    gallery: [
      { src: productMara, alt: "Mara Storage Basket — full view", kind: "product" },
      { src: processFibre, alt: "Sisal fibres being prepared by hand", kind: "process" },
      { src: processDye, alt: "Natural dye bath simmering in clay pots", kind: "process" },
      { src: workshop, alt: "Wanjiru's workshop in Maragua", kind: "process" },
    ],
    pieceStory:
      "This basket took Wanjiru just over five days to coil. The sisal was harvested from her own family plot in Maragua and dyed with crushed bark from the muthithi tree — the same plant her grandmother used for the diamond-row band you can see across the body.",
    materials: ["Hand-stripped sisal", "Plant-dyed band (muthithi bark)"],
    dimensions: "H 28cm · Ø 26cm",
    care: "Dust with a soft brush. Keep out of direct rain.",
    leadTimeDays: { min: 5, max: 7 },
    creator: wanjiru,
  },
  "p-mara-02": {
    id: "p-mara-02",
    name: "Highland Lidded Vessel",
    pricePence: 8600,
    heroImage: productHighland,
    gallery: [
      { src: productHighland, alt: "Highland Lidded Vessel", kind: "product" },
      { src: processWeave, alt: "Hands coiling the spiral base", kind: "process" },
      { src: processFibre, alt: "Sisal preparation", kind: "process" },
      { src: workshop, alt: "Wanjiru's workshop", kind: "process" },
    ],
    pieceStory:
      "Three days of coiling, finished with a small olive-wood lid turned by Wanjiru's neighbour Joseph. The alternating ochre and cream bands are her own pattern — she calls it 'evening light on the maize'.",
    materials: ["Hand-stripped sisal", "Olive-wood lid", "Plant dyes"],
    dimensions: "H 14cm · Ø 12cm",
    care: "Lift the lid by the knob. Wipe clean only.",
    leadTimeDays: { min: 5, max: 7 },
    creator: wanjiru,
  },
  "p-mara-03": {
    id: "p-mara-03",
    name: "Spiral Table Mat",
    pricePence: 4200,
    heroImage: productMat,
    gallery: [
      { src: productMat, alt: "Spiral Table Mat", kind: "product" },
      { src: processWeave, alt: "Coiling the spiral", kind: "process" },
      { src: processFibre, alt: "Sisal preparation", kind: "process" },
    ],
    pieceStory:
      "The flat coil is the simplest form Wanjiru weaves and the hardest to do well — every stitch must hold the same tension or the spiral warps. This mat was finished in two long afternoons.",
    materials: ["Undyed natural sisal"],
    dimensions: "Ø 32cm",
    care: "Dust with a soft brush.",
    leadTimeDays: { min: 5, max: 7 },
    creator: wanjiru,
  },
  "p-mara-04": {
    id: "p-mara-04",
    name: "Tall Floor Basket",
    pricePence: 16400,
    heroImage: productTall,
    gallery: [
      { src: productTall, alt: "Tall Floor Basket", kind: "product" },
      { src: processWeave, alt: "Coiling in progress", kind: "process" },
      { src: processDye, alt: "Dye bath", kind: "process" },
      { src: workshop, alt: "Wanjiru's workshop", kind: "process" },
    ],
    pieceStory:
      "Wanjiru's largest regular form — eight days of work and two natural dye baths to land the deep red band. The twin handles are reinforced with an inner sisal cord so the basket can carry weight without losing its shape.",
    materials: ["Hand-stripped sisal", "Plant dye (muthithi bark)"],
    dimensions: "H 56cm · Ø 30cm",
    care: "Indoor use. Reshape gently if pressed.",
    leadTimeDays: { min: 7, max: 10 },
    creator: wanjiru,
  },
};

export function getProduct(id: string): Product | null {
  return products[id] ?? null;
}

export function getAllProducts(): Product[] {
  return Object.values(products);
}
