const motifs = [
  { kind: "coffee", className: "left-[3%] top-[7%] h-16 w-16 rotate-[-14deg] md:h-24 md:w-24" },
  { kind: "weave", className: "left-[23%] top-[9%] h-14 w-14 rotate-[9deg] md:h-20 md:w-20" },
  { kind: "basket", className: "right-[5%] top-[11%] h-20 w-20 rotate-[12deg] md:h-28 md:w-28" },
  { kind: "woodwork", className: "left-[9%] top-[22%] h-20 w-20 rotate-[7deg] md:h-28 md:w-28" },
  { kind: "beads", className: "right-[21%] top-[25%] h-16 w-16 rotate-[-11deg] md:h-24 md:w-24" },
  { kind: "pottery", className: "right-[4%] top-[33%] h-20 w-20 rotate-[-7deg] md:h-32 md:w-32" },
  { kind: "tea", className: "left-[18%] top-[38%] h-14 w-14 rotate-[13deg] md:h-20 md:w-20" },
  { kind: "leather", className: "right-[32%] top-[42%] h-14 w-14 rotate-[8deg] md:h-20 md:w-20" },
  { kind: "basket", className: "left-[2%] top-[49%] h-16 w-16 rotate-[-10deg] md:h-24 md:w-24" },
  { kind: "honey", className: "right-[9%] top-[52%] h-18 w-18 rotate-[14deg] md:h-24 md:w-24" },
  { kind: "textile", className: "left-[31%] top-[58%] h-14 w-14 rotate-[-6deg] md:h-20 md:w-20" },
  { kind: "carving", className: "left-[7%] top-[66%] h-20 w-20 rotate-[12deg] md:h-32 md:w-32" },
  { kind: "spice", className: "right-[27%] top-[69%] h-14 w-14 rotate-[-15deg] md:h-20 md:w-20" },
  { kind: "weave", className: "right-[3%] top-[73%] h-20 w-20 rotate-[-9deg] md:h-32 md:w-32" },
  { kind: "pottery", className: "left-[20%] top-[82%] h-16 w-16 rotate-[8deg] md:h-24 md:w-24" },
  { kind: "coffee", className: "right-[17%] top-[86%] h-16 w-16 rotate-[-8deg] md:h-24 md:w-24" },
  { kind: "beads", className: "left-[47%] top-[15%] hidden h-14 w-14 rotate-[18deg] lg:block" },
  { kind: "honey", className: "left-[42%] top-[78%] hidden h-16 w-16 rotate-[-12deg] lg:block" },
] as const;

type MotifKind = (typeof motifs)[number]["kind"];

function Motif({ kind }: { kind: MotifKind }) {
  switch (kind) {
    case "coffee":
      return (
        <>
          <path d="M25 58c4 9 13 14 24 14s20-5 24-14" />
          <path d="M27 37h43c3 0 5 2 5 5 0 18-10 29-27 29S21 60 21 42c0-3 3-5 6-5Z" />
          <path d="M73 43h5c7 0 7 13-1 15l-6 1" />
          <path d="M34 24c-3-5 4-8 1-13M48 25c-3-5 5-8 2-14M62 24c-3-5 4-8 1-13" />
          <path d="M33 49c9 3 22 3 31 0" />
        </>
      );
    case "basket":
      return (
        <>
          <path d="M18 35c4 25 11 35 30 35s26-10 30-35H18Z" />
          <path d="M28 35c1-15 8-24 20-24s19 9 20 24" />
          <path d="M24 45h48M27 55h42M33 65h30" />
          <path d="M33 36c0 13 2 23 7 34M48 35v35M63 36c0 13-2 23-7 34" />
          <path d="M23 41c8 5 42 5 50 0" />
        </>
      );
    case "pottery":
      return (
        <>
          <path d="M37 12h22M40 12v11c-9 4-14 12-14 24 0 19 10 31 22 31s22-12 22-31c0-12-5-20-14-24V12" />
          <path d="M31 43c10 5 24 5 34 0M33 58c9 4 21 4 30 0" />
          <path d="M39 27c6 3 12 3 18 0" />
        </>
      );
    case "beads":
      return (
        <>
          <path d="M17 22c5 30 17 46 31 46s26-16 31-46" />
          <circle cx="21" cy="28" r="4" />
          <circle cx="27" cy="43" r="4" />
          <circle cx="38" cy="56" r="4" />
          <circle cx="48" cy="62" r="4" />
          <circle cx="58" cy="56" r="4" />
          <circle cx="69" cy="43" r="4" />
          <circle cx="75" cy="28" r="4" />
          <path d="M35 34c8 5 18 5 26 0" />
        </>
      );
    case "woodwork":
      return (
        <>
          <path d="M22 24h48v43H22Z" />
          <path d="M22 38h48M37 24v43M54 24v43" />
          <path d="M28 31c9 6 22 6 36 0M29 52c10-7 22-7 35 0" />
          <path d="M17 73h60M29 67l-6 6M63 67l6 6" />
        </>
      );
    case "weave":
      return (
        <>
          <path d="M15 24c8 6 16 6 24 0s16-6 24 0 16 6 24 0" />
          <path d="M15 39c8 6 16 6 24 0s16-6 24 0 16 6 24 0" />
          <path d="M15 54c8 6 16 6 24 0s16-6 24 0 16 6 24 0" />
          <path d="M24 18v45M42 18v45M60 18v45M78 18v45" />
        </>
      );
    case "tea":
      return (
        <>
          <path d="M21 39c12-20 34-26 51-15-12 21-34 27-51 15Z" />
          <path d="M25 37c13-1 25-6 40-15" />
          <path d="M31 58c8-7 22-9 34-4" />
          <path d="M47 43c1 8-2 16-9 23" />
        </>
      );
    case "leather":
      return (
        <>
          <path d="M25 25c5-10 17-13 25-5 5-5 14-4 18 2 5 8 0 19-10 27L42 70 27 48c-8-9-8-17-2-23Z" />
          <path d="M34 31c6 7 17 8 28 1" />
          <path d="M33 47c8 4 16 5 25 2" />
          <path d="M42 58l8-8" />
        </>
      );
    case "honey":
      return (
        <>
          <path d="M30 31h36l8 10-8 10H30l-8-10 8-10Z" />
          <path d="M30 51h36l7 9-7 9H30l-7-9 7-9Z" />
          <path d="M30 13h36l7 9-7 9H30l-7-9 7-9Z" />
          <path d="M40 24h16M40 42h16M40 60h16" />
        </>
      );
    case "textile":
      return (
        <>
          <path d="M25 18h46v52H25Z" />
          <path d="M35 18v52M48 18v52M61 18v52" />
          <path d="M25 30h46M25 43h46M25 56h46" />
          <path d="M32 25l33 38M65 25 32 63" />
        </>
      );
    case "carving":
      return (
        <>
          <path d="M47 14c13 10 19 22 19 36 0 13-7 24-18 31-11-7-18-18-18-31 0-14 5-26 17-36Z" />
          <path d="M39 38c2-4 6-6 10-3M56 38c-2-4-6-6-10-3" />
          <path d="M43 52c3 2 7 2 10 0" />
          <path d="M48 25v44M35 29c5 4 8 7 10 12M61 29c-5 4-8 7-10 12" />
        </>
      );
    case "spice":
      return (
        <>
          <path d="M29 31c8-13 27-13 35 0 9 3 13 11 10 20-4 13-18 20-26 20S26 64 22 51c-3-9 1-17 7-20Z" />
          <path d="M48 18v13M39 20c7-4 14-4 21 0" />
          <path d="M34 47c7 5 21 5 28 0M38 58c6 3 14 3 20 0" />
        </>
      );
  }
}

export function HomeArtPattern() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-20 overflow-hidden mix-blend-multiply">
      {motifs.map((motif, index) => (
        <svg
          key={`${motif.kind}-${index}`}
          viewBox="0 0 96 96"
          fill="none"
          className={`absolute block text-clay/25 opacity-75 ${motif.className}`}
          stroke="currentColor"
          strokeWidth="1.45"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Motif kind={motif.kind} />
        </svg>
      ))}
    </div>
  );
}
