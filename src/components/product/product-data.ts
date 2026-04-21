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
import productBeads from "@/assets/product-beads.jpg";
import productVessel from "@/assets/product-vessel.jpg";

import workshop from "@/assets/creator-workshop-wanjiru.jpg";
import processFibre from "@/assets/process-fibre.jpg";
import processDye from "@/assets/process-dye.jpg";
import processWeave from "@/assets/process-weave.jpg";
import processFinish from "@/assets/process-finish.jpg";

// Authentic on-the-ground photography
import authKiondo from "@/assets/authentic-kiondo.jpg";
import authBasketsPile from "@/assets/authentic-baskets-pile.jpg";
import authBeadSorter from "@/assets/authentic-bead-sorter.jpg";
import authBeadMarket from "@/assets/authentic-bead-market.jpg";
import authSandals from "@/assets/authentic-sandals.jpg";
import authLeatherMarket from "@/assets/authentic-leather-market.jpg";
import authCraftMarket from "@/assets/authentic-craft-market.jpg";
import authBeekeeper from "@/assets/authentic-beekeeper.jpg";

import portraitWanjiru from "@/assets/portrait-wanjiru.jpg";
import naserianImg from "@/assets/creator-naserian.jpg";
import mumoImg from "@/assets/creator-mumo.jpg";
import akinyiImg from "@/assets/creator-akinyi.jpg";
import aluochImg from "@/assets/creator-aluoch.jpg";
import otienoImg from "@/assets/creator-otieno.jpg";
import saitotiImg from "@/assets/creator-saitoti.jpg";

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

const naserian: ProductCreatorRef = {
  id: "naserian",
  firstName: "Naserian",
  fullName: "Naserian Lekishon",
  region: "Kajiado County",
  craft: "Beadwork",
  portrait: naserianImg,
};

const mumo: ProductCreatorRef = {
  id: "mumo",
  firstName: "Mumo",
  fullName: "Mumo Mwangi",
  region: "Kiambu Highlands",
  craft: "Pottery",
  portrait: mumoImg,
};

const akinyi: ProductCreatorRef = {
  id: "akinyi",
  firstName: "Akinyi",
  fullName: "Akinyi Otieno",
  region: "Kisumu",
  craft: "Pottery",
  portrait: akinyiImg,
};

const aluoch: ProductCreatorRef = {
  id: "aluoch",
  firstName: "Aluoch",
  fullName: "Aluoch Ondieki",
  region: "Nairobi",
  craft: "Leatherwork",
  portrait: aluochImg,
};

const otieno: ProductCreatorRef = {
  id: "otieno",
  firstName: "Otieno",
  fullName: "Otieno Ouma",
  region: "Lamu Old Town",
  craft: "Woodcarving",
  portrait: otienoImg,
};

const saitoti: ProductCreatorRef = {
  id: "saitoti",
  firstName: "Saitoti",
  fullName: "Saitoti Ole Kipuri",
  region: "Narok, Maasai Mara",
  craft: "Weaving",
  portrait: saitotiImg,
};

// NEW MAKER — beekeeper. Portrait reused from beekeeper field shot for now.
const kibet: ProductCreatorRef = {
  id: "kibet",
  firstName: "Kibet",
  fullName: "Kibet Cheruiyot",
  region: "Mwingi, Kitui",
  craft: "Beekeeping",
  portrait: authBeekeeper,
};

export const products: Record<string, Product> = {
  "p-mara-01": {
    id: "p-mara-01",
    name: "Mara Storage Basket",
    pricePence: 12800,
    heroImage: productMara,
    gallery: [
      { src: productMara, alt: "Mara Storage Basket — full view", kind: "product" },
      { src: authKiondo, alt: "Wanjiru's baskets hanging at the Maragua co-op", kind: "process" },
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

  // NEW — Wanjiru market tote, photographed at the co-op
  "p-mara-05": {
    id: "p-mara-05",
    name: "Striped Market Tote",
    pricePence: 6800,
    heroImage: authBasketsPile,
    gallery: [
      { src: authBasketsPile, alt: "Striped market totes ready for collection", kind: "product" },
      { src: authKiondo, alt: "Wanjiru's stall at the weekly Maragua market", kind: "process" },
      { src: processWeave, alt: "Coiling in progress", kind: "process" },
    ],
    pieceStory:
      "Wanjiru's everyday carry — wide enough for a market run, soft enough to fold into your bag. The leather handles are stitched on by her brother Mwangi, who runs a small saddlery two doors down.",
    materials: ["Hand-stripped sisal", "Vegetable-tanned leather handles"],
    dimensions: "H 32cm · W 38cm · D 14cm",
    care: "Wipe with a damp cloth. Air dry.",
    leadTimeDays: { min: 4, max: 6 },
    creator: wanjiru,
  },

  // ── Naserian — Beadwork ─────────────────────────────────────────────
  "p-kaj-01": {
    id: "p-kaj-01",
    name: "Enkipaata Beaded Collar",
    pricePence: 14800,
    heroImage: productBeads,
    gallery: [
      { src: productBeads, alt: "Enkipaata beaded collar", kind: "product" },
      { src: authBeadSorter, alt: "Naserian sorting beads at her workbench", kind: "process" },
      { src: authBeadMarket, alt: "The Kajiado bead market where she sources her glass", kind: "process" },
    ],
    pieceStory:
      "Naserian threaded this collar over four evenings under lamplight. The red speaks of bravery, the white of peace — the colour order is the one her mother taught her for a young woman's first ceremony.",
    materials: ["Czech glass seed beads", "Hand-cut leather backing"],
    dimensions: "Inner Ø 14cm · Drop 6cm",
    care: "Lay flat. Avoid water and perfume.",
    leadTimeDays: { min: 6, max: 9 },
    creator: naserian,
  },
  "p-kaj-02": {
    id: "p-kaj-02",
    name: "Kajiado Cuff — Pair",
    pricePence: 6400,
    heroImage: productBeads,
    gallery: [
      { src: productBeads, alt: "Kajiado beaded cuff pair", kind: "product" },
      { src: authBeadSorter, alt: "Hand-sorting beads by colour", kind: "process" },
      { src: processFinish, alt: "Bead work in progress", kind: "process" },
    ],
    pieceStory:
      "A matched pair of cuffs in Naserian's everyday palette — ochre, indigo, white. She beads these between larger commissions, calling them 'the work that keeps my fingers honest'.",
    materials: ["Glass seed beads", "Soft leather cuff"],
    dimensions: "Adjustable · Width 3cm",
    care: "Wipe with a dry cloth.",
    leadTimeDays: { min: 4, max: 6 },
    creator: naserian,
  },

  // NEW — beaded sandals, Naserian
  "p-kaj-03": {
    id: "p-kaj-03",
    name: "Beaded Leather Sandals",
    pricePence: 9200,
    heroImage: authSandals,
    gallery: [
      { src: authSandals, alt: "Beaded leather sandals at the Maasai market", kind: "product" },
      { src: authBeadSorter, alt: "Beading the strap by hand", kind: "process" },
    ],
    pieceStory:
      "Naserian beads the toe strap; her cousin Sironka cuts and stitches the leather. Each pair carries a different geometric motif — she never repeats a pattern within a season.",
    materials: ["Hand-cut cowhide", "Glass seed beads", "Stitched suede footbed"],
    dimensions: "UK 4–8 · Made to size",
    care: "Keep dry. Treat leather with mink oil twice a year.",
    leadTimeDays: { min: 7, max: 10 },
    creator: naserian,
  },

  // ── Mumo — Pottery ──────────────────────────────────────────────────
  "p-kia-01": {
    id: "p-kia-01",
    name: "Highland Carafe",
    pricePence: 9800,
    heroImage: productVessel,
    gallery: [
      { src: productVessel, alt: "Highland clay carafe", kind: "product" },
      { src: processFinish, alt: "Burnishing the surface", kind: "process" },
    ],
    pieceStory:
      "Mumo throws each carafe in a single sitting, then burnishes the surface with a river stone his father gave him. The matte band at the neck is unglazed clay, left to breathe.",
    materials: ["Kiambu red clay", "Lead-free glaze"],
    dimensions: "H 24cm · Ø 11cm",
    care: "Hand wash. Not for direct heat.",
    leadTimeDays: { min: 7, max: 10 },
    creator: mumo,
  },

  // ── Akinyi — Pottery ────────────────────────────────────────────────
  "p-kis-01": {
    id: "p-kis-01",
    name: "Lake-Edge Serving Bowl",
    pricePence: 7200,
    heroImage: productVessel,
    gallery: [
      { src: productVessel, alt: "Lake-edge serving bowl", kind: "product" },
      { src: processFinish, alt: "Coil-built in progress", kind: "process" },
    ],
    pieceStory:
      "Coil-built rather than thrown — Akinyi works the way her great-grandmother did, layering ropes of red Kisumu clay until the form rises. Fired in a wood kiln behind her studio.",
    materials: ["Kisumu lake-edge clay", "Wood-fired finish"],
    dimensions: "H 9cm · Ø 26cm",
    care: "Hand wash. Avoid sudden temperature change.",
    leadTimeDays: { min: 6, max: 9 },
    creator: akinyi,
  },

  // ── Aluoch — Leatherwork ────────────────────────────────────────────
  "p-nrb-01": {
    id: "p-nrb-01",
    name: "Hand-Stitched Day Satchel",
    pricePence: 24800,
    heroImage: productVessel,
    gallery: [
      { src: productVessel, alt: "Day satchel — front", kind: "product" },
      { src: authLeatherMarket, alt: "Aluoch outside her Nairobi workshop", kind: "process" },
      { src: processFinish, alt: "Saddle stitching by hand", kind: "process" },
    ],
    pieceStory:
      "Every stitch on this satchel is set by hand with a saddler's needle — Aluoch refuses the machine. The leather softens with use; she says a good bag should remember the shape of its owner.",
    materials: ["Vegetable-tanned hide", "Brass hardware"],
    dimensions: "H 28cm · W 34cm · D 10cm",
    care: "Condition twice a year. Keep dry.",
    leadTimeDays: { min: 10, max: 14 },
    creator: aluoch,
  },

  // NEW — Aluoch, crossbody
  "p-nrb-02": {
    id: "p-nrb-02",
    name: "Saddle-Stitched Crossbody",
    pricePence: 14600,
    heroImage: authLeatherMarket,
    gallery: [
      { src: authLeatherMarket, alt: "Aluoch's leather workshop, Nairobi", kind: "product" },
      { src: processFinish, alt: "Hand-stitching the gusset", kind: "process" },
    ],
    pieceStory:
      "A daily companion — small enough to forget you're wearing it, structured enough to hold a passport, a notebook, a phone. Aluoch's signature edge-paint in oxblood runs all the way around.",
    materials: ["Full-grain leather", "Solid brass clasp", "Oxblood edge paint"],
    dimensions: "H 18cm · W 22cm · D 6cm",
    care: "Wipe with a soft cloth. Avoid prolonged sun.",
    leadTimeDays: { min: 8, max: 12 },
    creator: aluoch,
  },

  // ── Otieno — Woodcarving ────────────────────────────────────────────
  "p-lam-01": {
    id: "p-lam-01",
    name: "Olive-Wood Reading Stand",
    pricePence: 11600,
    heroImage: productVessel,
    gallery: [
      { src: productVessel, alt: "Olive-wood reading stand", kind: "product" },
      { src: authCraftMarket, alt: "Otieno's stall at the Lamu craft market", kind: "process" },
      { src: processFinish, alt: "Carving the curve against the grain", kind: "process" },
    ],
    pieceStory:
      "Otieno carves the curve against the grain so the wood opens in long, slow shavings. This stand is a single piece of olive — no joinery, no glue, finished only with beeswax.",
    materials: ["Single-piece olive wood", "Beeswax finish"],
    dimensions: "H 18cm · W 28cm",
    care: "Re-wax once a year with beeswax.",
    leadTimeDays: { min: 8, max: 12 },
    creator: otieno,
  },

  // NEW — Otieno, carved spoon set
  "p-lam-02": {
    id: "p-lam-02",
    name: "Olive Spoon — Set of Three",
    pricePence: 5400,
    heroImage: productVessel,
    gallery: [
      { src: productVessel, alt: "Three olive-wood serving spoons", kind: "product" },
      { src: authCraftMarket, alt: "Otieno's bench, Lamu Old Town", kind: "process" },
    ],
    pieceStory:
      "Three spoons, one tree. Otieno cuts the blanks from a single fallen olive branch so the grain runs continuously across the set. He finishes each handle to fit comfortably in a closed hand.",
    materials: ["Olive wood", "Beeswax + linseed finish"],
    dimensions: "L 24, 28, 32cm",
    care: "Hand wash. Re-oil monthly.",
    leadTimeDays: { min: 5, max: 8 },
    creator: otieno,
  },

  // ── Saitoti — Weaving ───────────────────────────────────────────────
  "p-mar-01": {
    id: "p-mar-01",
    name: "Acacia Grain Vessel",
    pricePence: 13400,
    heroImage: productTall,
    gallery: [
      { src: productTall, alt: "Acacia grain vessel", kind: "product" },
      { src: processWeave, alt: "Weaving under the acacia", kind: "process" },
    ],
    pieceStory:
      "Saitoti weaves under the same acacia his grandfather sat beneath. This vessel is sized to hold a season's grain — broad at the shoulder, drawn in at the neck so the contents stay dry through the rains.",
    materials: ["Hand-stripped sisal", "Goat-leather rim binding"],
    dimensions: "H 42cm · Ø 28cm",
    care: "Indoor use. Brush gently to clean.",
    leadTimeDays: { min: 7, max: 10 },
    creator: saitoti,
  },

  // ── Kibet — Beekeeping (NEW MAKER) ──────────────────────────────────
  "p-mwi-01": {
    id: "p-mwi-01",
    name: "Wildflower Honey — 340g Jar",
    pricePence: 1800,
    heroImage: authBeekeeper,
    gallery: [
      { src: authBeekeeper, alt: "Kibet at his apiary in Mwingi", kind: "process" },
      { src: authBeekeeper, alt: "Top-bar hives under the acacia", kind: "process" },
    ],
    pieceStory:
      "Kibet keeps fourteen top-bar hives in the acacia scrub outside Mwingi. This jar is from the long rains — pale, floral, with a faint sweetness from the desert dates that bloom in March.",
    materials: ["Raw unfiltered honey", "Reusable glass jar"],
    dimensions: "340g net · H 9cm",
    care: "Store at room temperature. Crystallisation is natural.",
    leadTimeDays: { min: 3, max: 5 },
    creator: kibet,
  },
  "p-mwi-02": {
    id: "p-mwi-02",
    name: "Pure Beeswax Pillar Candle",
    pricePence: 2400,
    heroImage: authBeekeeper,
    gallery: [
      { src: authBeekeeper, alt: "Wax cappings rendered down by Kibet", kind: "process" },
    ],
    pieceStory:
      "Hand-poured from the wax cappings of Kibet's harvest. Pure beeswax burns slow, drip-free, and carries the faintest honey note as it warms. Twelve hours of light per pillar.",
    materials: ["100% Mwingi beeswax", "Cotton wick"],
    dimensions: "H 12cm · Ø 6cm",
    care: "Trim wick to 5mm. Burn on a heat-safe surface.",
    leadTimeDays: { min: 4, max: 7 },
    creator: kibet,
  },
};

export function getProduct(id: string): Product | null {
  return products[id] ?? null;
}

export function getAllProducts(): Product[] {
  return Object.values(products);
}
