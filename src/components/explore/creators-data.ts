import wanjiru from "@/assets/creator-wanjiru.jpg";
import mumo from "@/assets/creator-mumo.jpg";
import naserian from "@/assets/creator-naserian.jpg";
import otieno from "@/assets/creator-otieno.jpg";
import aluoch from "@/assets/creator-aluoch.jpg";
import akinyi from "@/assets/creator-akinyi.jpg";
import saitoti from "@/assets/creator-saitoti.jpg";

/**
 * Mock creator dataset.
 *
 * Shape mirrors the future API contract — Phase 6 will replace this
 * module with a typed fetch from /api/creators.
 */
export type Craft =
  | "Weaving"
  | "Beadwork"
  | "Pottery"
  | "Leatherwork"
  | "Woodcarving";

export interface Creator {
  id: string;
  firstName: string;
  fullName: string;
  craft: Craft;
  region: string;
  hook: string;
  image: string;
  /** layout hint for masonry — tall cards break the grid rhythm */
  emphasis?: "tall" | "standard";
}

export const CRAFTS: readonly Craft[] = [
  "Weaving",
  "Beadwork",
  "Pottery",
  "Leatherwork",
  "Woodcarving",
] as const;

export const creators: Creator[] = [
  {
    id: "wanjiru",
    firstName: "Wanjiru",
    fullName: "Wanjiru Kamau",
    craft: "Weaving",
    region: "Maragua, Murang'a",
    hook: "Wanjiru learned the patterns from her grandmother — knots that once carried grain across the highlands.",
    image: wanjiru,
    emphasis: "tall",
  },
  {
    id: "naserian",
    firstName: "Naserian",
    fullName: "Naserian Lekishon",
    craft: "Beadwork",
    region: "Kajiado County",
    hook: "Each colour means something. Naserian beads the conversations her elders never had time to write down.",
    image: naserian,
  },
  {
    id: "mumo",
    firstName: "Mumo",
    fullName: "Mumo Mwangi",
    craft: "Pottery",
    region: "Kiambu Highlands",
    hook: "Trained as an architect, Mumo came home to clay after his father's last vessels went unsold.",
    image: mumo,
  },
  {
    id: "akinyi",
    firstName: "Akinyi",
    fullName: "Akinyi Otieno",
    craft: "Pottery",
    region: "Kisumu",
    hook: "Akinyi shapes red earth from the lake's edge, the same clay her great-grandmother coiled by hand.",
    image: akinyi,
    emphasis: "tall",
  },
  {
    id: "aluoch",
    firstName: "Aluoch",
    fullName: "Aluoch Ondieki",
    craft: "Leatherwork",
    region: "Nairobi",
    hook: "Aluoch stitches by hand in the workshop her late husband built — every satchel a kind of conversation with him.",
    image: aluoch,
  },
  {
    id: "otieno",
    firstName: "Otieno",
    fullName: "Otieno Ouma",
    craft: "Woodcarving",
    region: "Lamu Old Town",
    hook: "Otieno carves olive wood the way his father taught him — slowly, against the grain, until the figure breathes.",
    image: otieno,
  },
  {
    id: "saitoti",
    firstName: "Saitoti",
    fullName: "Saitoti Ole Kipuri",
    craft: "Weaving",
    region: "Narok, Maasai Mara",
    hook: "Saitoti weaves under the same acacia his grandfather once sat beneath, turning sisal into vessels that hold a season's grain.",
    image: saitoti,
    emphasis: "tall",
  },
];
