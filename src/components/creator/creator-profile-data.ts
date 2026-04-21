/**
 * Mock creator profile dataset.
 *
 * This shape mirrors the future API contract — Phase 6 will replace this
 * module with a typed fetch from /api/creators/:id. Keep the field names
 * and nesting stable; UI components depend on this exact structure.
 */

import workshopWanjiru from "@/assets/creator-workshop-wanjiru.jpg";
import portraitWanjiru from "@/assets/portrait-wanjiru.jpg";
import processFibre from "@/assets/process-fibre.jpg";
import processDye from "@/assets/process-dye.jpg";
import processWeave from "@/assets/process-weave.jpg";
import processFinish from "@/assets/process-finish.jpg";
import productMara from "@/assets/product-basket-mara.jpg";
import productHighland from "@/assets/product-vessel-highland.jpg";
import productMat from "@/assets/product-mat-spiral.jpg";
import productTall from "@/assets/product-basket-tall.jpg";

import naserian from "@/assets/creator-naserian.jpg";
import saitoti from "@/assets/creator-saitoti.jpg";
import otieno from "@/assets/creator-otieno.jpg";
import akinyi from "@/assets/creator-akinyi.jpg";

export interface ProcessStep {
  image: string;
  caption: string;
}

export interface CreatorProduct {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
}

export interface RelatedCreator {
  id: string;
  firstName: string;
  craft: string;
  region: string;
  hook: string;
  image: string;
}

export interface CreatorProfile {
  id: string;
  firstName: string;
  fullName: string;
  region: string;
  craft: string;
  /** Wide environmental/workshop image used for the immersive header */
  headerImage: string;
  /** Tall portrait used in the human-story section */
  portraitImage: string;
  storyParagraphs: string[];
  pullQuote: string;
  processSteps: ProcessStep[];
  culturalMeaning: string[];
  /** Two-letter country code + region label for the small map */
  mapPin?: { lat: number; lng: number; label: string };
  products: CreatorProduct[];
  relatedCreators: RelatedCreator[];
}

export const creatorProfiles: Record<string, CreatorProfile> = {
  wanjiru: {
    id: "wanjiru",
    firstName: "Wanjiru",
    fullName: "Wanjiru Kamau",
    region: "Maragua, Murang'a",
    craft: "Weaving",
    headerImage: workshopWanjiru,
    portraitImage: portraitWanjiru,
    storyParagraphs: [
      "Wanjiru was born in Maragua at the foot of the Aberdare range, the youngest of seven in a family that measured wealth in goats and stories. Her grandmother, Nyokabi, kept the household together with two things — a sharp tongue and a pair of hands that never stopped moving. Wherever Nyokabi sat, a half-finished basket sat with her.",
      "She was six the first time her grandmother put a length of sisal into her hands and showed her the coil. The knot was wrong, then wrong again, then suddenly right. \"Now you know one thing your great-grandmother knew,\" Nyokabi told her. Wanjiru remembers it as the first sentence she ever felt the weight of.",
      "For years she wove only in the evenings — school, then a job in Nairobi at a clothing factory that paid her by the seam. The work was steady. The work was nothing. When her mother fell ill in 2014 she came home to nurse her, and the baskets came back too, almost without her deciding. By the time her mother passed, Wanjiru had filled a room with them.",
      "Today she works from a small mud-walled studio behind her family's compound, with three young women she is teaching the patterns to. She still uses Nyokabi's wooden coil-tool, polished smooth by four generations of palms. \"A basket holds grain,\" she says, \"but it also holds time. Mine carry both.\"",
    ],
    pullQuote:
      "A basket holds grain. But it also holds time. Mine carry both.",
    processSteps: [
      {
        image: processFibre,
        caption:
          "Sisal is harvested from the family's own plot and stripped by hand. Wanjiru sorts each fibre by length and strength before anything else begins.",
      },
      {
        image: processDye,
        caption:
          "Colour comes from the land — bark, root and crushed berry, simmered for hours over a low fire. No two batches are ever the same shade of red.",
      },
      {
        image: processWeave,
        caption:
          "The coil begins at the centre and spirals outward. A single mid-sized basket takes between four and six full days, never rushed, never shortcut.",
      },
      {
        image: processFinish,
        caption:
          "Each finished piece sits on the workshop bench for a week before it leaves — Wanjiru's way of checking the tension has settled and the colour has held.",
      },
    ],
    culturalMeaning: [
      "Coil-weaving in the Kenyan highlands is one of the oldest continuous craft traditions on the continent, taught woman-to-girl across generations. The patterns are not decorative — they are records. Diamond rows traditionally marked harvest, zig-zags marked rivers, and the central spiral marked the home you wove the basket inside.",
      "When a girl was given her own coil-tool, it meant she was ready to be trusted with something that would outlast her. To buy a Maragua basket today is to take a small piece of that lineage into your house — and to make it possible for women like Wanjiru to keep teaching the next set of hands.",
    ],
    mapPin: { lat: -0.78, lng: 37.15, label: "Maragua, Murang'a County" },
    products: [
      {
        id: "p-mara-01",
        name: "Mara Storage Basket",
        price: "£128",
        image: productMara,
        description: "Mid-sized coil basket with traditional diamond-row band.",
      },
      {
        id: "p-mara-02",
        name: "Highland Lidded Vessel",
        price: "£86",
        image: productHighland,
        description:
          "Small lidded vessel in alternating ochre and natural fibre.",
      },
      {
        id: "p-mara-03",
        name: "Spiral Table Mat",
        price: "£42",
        image: productMat,
        description:
          "Hand-coiled flat mat — the simplest form, hardest to do well.",
      },
      {
        id: "p-mara-04",
        name: "Tall Floor Basket",
        price: "£164",
        image: productTall,
        description:
          "Generous floor basket with twin handles and dyed band detail.",
      },
    ],
    relatedCreators: [
      {
        id: "saitoti",
        firstName: "Saitoti",
        craft: "Weaving",
        region: "Narok, Maasai Mara",
        hook: "Saitoti weaves under the same acacia his grandfather once sat beneath, turning sisal into vessels that hold a season's grain.",
        image: saitoti,
      },
      {
        id: "naserian",
        firstName: "Naserian",
        craft: "Beadwork",
        region: "Kajiado County",
        hook: "Each colour means something. Naserian beads the conversations her elders never had time to write down.",
        image: naserian,
      },
    ],
  },
};

/**
 * Lightweight fallback used for any creator id that doesn't yet have a full
 * profile written. Reuses Wanjiru's narrative shape but swaps name/region —
 * sufficient for the explore → profile flow until Phase 6 wires real data.
 */
export function getCreatorProfile(id: string): CreatorProfile {
  if (creatorProfiles[id]) return creatorProfiles[id];
  
  const base = creatorProfiles.wanjiru;
  const fallbackNames: Record<
    string,
    { firstName: string; fullName: string; region: string; craft: string; portrait: string }
  > = {
    saitoti: {
      firstName: "Saitoti",
      fullName: "Saitoti Ole Kipuri",
      region: "Narok, Maasai Mara",
      craft: "Weaving",
      portrait: saitoti,
    },
    naserian: {
      firstName: "Naserian",
      fullName: "Naserian Lekishon",
      region: "Kajiado County",
      craft: "Beadwork",
      portrait: naserian,
    },
    otieno: {
      firstName: "Otieno",
      fullName: "Otieno Ouma",
      region: "Lamu Old Town",
      craft: "Woodcarving",
      portrait: otieno,
    },
    akinyi: {
      firstName: "Akinyi",
      fullName: "Akinyi Otieno",
      region: "Kisumu",
      craft: "Pottery",
      portrait: akinyi,
    },
  };
  
  const meta = fallbackNames[id];
  if (!meta) return base;
  
  return {
    ...base,
    id,
    firstName: meta.firstName,
    fullName: meta.fullName,
    region: meta.region,
    craft: meta.craft,
    portraitImage: meta.portrait,
  };
}
