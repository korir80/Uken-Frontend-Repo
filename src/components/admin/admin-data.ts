/**
 * Mock data for the admin moderation suite.
 *
 * Lives entirely in the frontend until the Spring Boot admin endpoints
 * are wired (`/api/admin/*`). All status mutations happen in-memory and
 * reset on page reload — that is intentional for a demo dataset.
 */

export type ApplicationStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "CHANGES_REQUESTED";

export interface ArtisanApplication {
  id: string;
  fullName: string;
  email: string;
  region: string;
  craft: string;
  yearsOfPractice: number;
  story: string;
  submittedAt: string;
  status: ApplicationStatus;
  portrait: string;
  workSample: string;
}

import wanjiru from "@/assets/creator-wanjiru.jpg";
import naserian from "@/assets/creator-naserian.jpg";
import mumo from "@/assets/creator-mumo.jpg";
import otieno from "@/assets/creator-otieno.jpg";
import workshop from "@/assets/creator-workshop-wanjiru.jpg";
import sample1 from "@/assets/product-basket-mara.jpg";
import sample2 from "@/assets/product-vessel.jpg";
import sample3 from "@/assets/product-mat-spiral.jpg";
import sample4 from "@/assets/product-vessel-highland.jpg";

export const applications: ArtisanApplication[] = [
  {
    id: "APP-204",
    fullName: "Wairimu Njoroge",
    email: "wairimu@gmail.com",
    region: "Limuru, Kiambu",
    craft: "Weaving",
    yearsOfPractice: 9,
    story:
      "I weave market totes from sisal grown on my father's plot. My mother taught me the diamond pattern, and I am now teaching it to four young women in our co-op.",
    submittedAt: daysAgo(1),
    status: "PENDING",
    portrait: wanjiru,
    workSample: sample1,
  },
  {
    id: "APP-203",
    fullName: "Achieng Odhiambo",
    email: "achieng@yahoo.com",
    region: "Bondo, Siaya",
    craft: "Pottery",
    yearsOfPractice: 12,
    story:
      "Coil-built vessels in lake-edge clay, fired in a wood kiln behind my home. I work alone — slow output but every piece is mine from start to finish.",
    submittedAt: daysAgo(2),
    status: "UNDER_REVIEW",
    portrait: naserian,
    workSample: sample2,
  },
  {
    id: "APP-202",
    fullName: "Karanja wa Mbugua",
    email: "karanja@hotmail.com",
    region: "Nyeri",
    craft: "Woodcarving",
    yearsOfPractice: 22,
    story:
      "Olive wood, mostly. Spoons, boards, the occasional reading stand. I source fallen branches only — no live tree has ever come down for my work.",
    submittedAt: daysAgo(3),
    status: "CHANGES_REQUESTED",
    portrait: otieno,
    workSample: sample3,
  },
  {
    id: "APP-201",
    fullName: "Faith Kerubo",
    email: "faith.k@gmail.com",
    region: "Kisii",
    craft: "Beadwork",
    yearsOfPractice: 6,
    story:
      "Glass seed beadwork on leather backings — collars, cuffs, sandal straps. I love colour and refuse muted palettes.",
    submittedAt: daysAgo(5),
    status: "APPROVED",
    portrait: mumo,
    workSample: sample4,
  },
  {
    id: "APP-200",
    fullName: "Joseph Mwita",
    email: "joseph.mwita@gmail.com",
    region: "Migori",
    craft: "Leatherwork",
    yearsOfPractice: 4,
    story:
      "Hand-stitched satchels and small leather goods. I am newer to the trade than most — please consider me on the strength of the work itself.",
    submittedAt: daysAgo(8),
    status: "REJECTED",
    portrait: workshop,
    workSample: sample1,
  },
];

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

/* -------- Payouts -------- */
export interface CreatorPayout {
  creatorId: string;
  fullName: string;
  region: string;
  craft: string;
  pendingPence: number;
  paidThisMonthPence: number;
  lastPaidAt: string;
  totalLifetimePence: number;
}

export const payouts: CreatorPayout[] = [
  {
    creatorId: "wanjiru",
    fullName: "Wanjiru Kamau",
    region: "Maragua",
    craft: "Weaving",
    pendingPence: 38400,
    paidThisMonthPence: 96000,
    lastPaidAt: daysAgo(6),
    totalLifetimePence: 1248000,
  },
  {
    creatorId: "naserian",
    fullName: "Naserian Lekishon",
    region: "Kajiado",
    craft: "Beadwork",
    pendingPence: 14800,
    paidThisMonthPence: 42000,
    lastPaidAt: daysAgo(6),
    totalLifetimePence: 588000,
  },
  {
    creatorId: "aluoch",
    fullName: "Aluoch Ondieki",
    region: "Nairobi",
    craft: "Leatherwork",
    pendingPence: 24800,
    paidThisMonthPence: 73200,
    lastPaidAt: daysAgo(6),
    totalLifetimePence: 942000,
  },
  {
    creatorId: "mumo",
    fullName: "Mumo Mwangi",
    region: "Kiambu",
    craft: "Pottery",
    pendingPence: 9800,
    paidThisMonthPence: 28400,
    lastPaidAt: daysAgo(6),
    totalLifetimePence: 412000,
  },
  {
    creatorId: "otieno",
    fullName: "Otieno Ouma",
    region: "Lamu",
    craft: "Woodcarving",
    pendingPence: 17000,
    paidThisMonthPence: 51200,
    lastPaidAt: daysAgo(6),
    totalLifetimePence: 728000,
  },
  {
    creatorId: "kibet",
    fullName: "Kibet Cheruiyot",
    region: "Mwingi",
    craft: "Beekeeping",
    pendingPence: 4200,
    paidThisMonthPence: 12800,
    lastPaidAt: daysAgo(6),
    totalLifetimePence: 184000,
  },
];

/* -------- Reviews / content -------- */
export interface ProductReview {
  id: string;
  productId: string;
  productName: string;
  buyerName: string;
  rating: number;
  body: string;
  submittedAt: string;
  status: "PUBLISHED" | "PENDING" | "FLAGGED" | "REMOVED";
}

export const reviews: ProductReview[] = [
  {
    id: "REV-512",
    productId: "p-mara-01",
    productName: "Mara Storage Basket",
    buyerName: "Eleanor R.",
    rating: 5,
    body: "Worth every penny. The dye work is unbelievable in person.",
    submittedAt: daysAgo(2),
    status: "PUBLISHED",
  },
  {
    id: "REV-511",
    productId: "p-nrb-01",
    productName: "Hand-Stitched Day Satchel",
    buyerName: "Marcus H.",
    rating: 5,
    body: "Aluoch even tucked a hand-written note inside. The leather smells like a saddler's shop.",
    submittedAt: daysAgo(3),
    status: "PUBLISHED",
  },
  {
    id: "REV-510",
    productId: "p-kaj-01",
    productName: "Enkipaata Beaded Collar",
    buyerName: "Anonymous",
    rating: 1,
    body: "this is overpriced junk lol go to ebay",
    submittedAt: daysAgo(1),
    status: "FLAGGED",
  },
  {
    id: "REV-509",
    productId: "p-mwi-01",
    productName: "Wildflower Honey",
    buyerName: "Hannah B.",
    rating: 4,
    body: "Lovely floral honey. Jar arrived a touch crystallised — easy fix in warm water.",
    submittedAt: daysAgo(5),
    status: "PENDING",
  },
];

/* -------- Featured curation -------- */
export interface FeaturedSlot {
  position: number;
  creatorId: string | null;
  productId: string | null;
}

export const featuredSlots: FeaturedSlot[] = [
  { position: 1, creatorId: "wanjiru", productId: "p-mara-01" },
  { position: 2, creatorId: "naserian", productId: "p-kaj-01" },
  { position: 3, creatorId: "aluoch", productId: "p-nrb-01" },
  { position: 4, creatorId: "kibet", productId: "p-mwi-01" },
];
