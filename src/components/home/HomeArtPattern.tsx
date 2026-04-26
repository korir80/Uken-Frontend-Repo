const motifs = [
  { kind: "coffee", className: "left-[6%] top-[10%] h-20 w-20 rotate-[-12deg] md:h-28 md:w-28" },
  { kind: "basket", className: "right-[8%] top-[18%] h-24 w-24 rotate-[10deg] md:h-32 md:w-32" },
  { kind: "pottery", className: "left-[12%] top-[34%] h-24 w-24 rotate-[7deg] md:h-36 md:w-36" },
  { kind: "beads", className: "right-[12%] top-[43%] h-24 w-24 rotate-[-8deg] md:h-32 md:w-32" },
  { kind: "woodwork", className: "left-[5%] top-[61%] h-24 w-24 rotate-[12deg] md:h-36 md:w-36" },
  { kind: "weave", className: "right-[7%] top-[69%] h-24 w-24 rotate-[-10deg] md:h-40 md:w-40" },
  { kind: "coffee", className: "left-[18%] top-[84%] h-20 w-20 rotate-[14deg] md:h-28 md:w-28" },
  { kind: "pottery", className: "right-[20%] top-[88%] h-20 w-20 rotate-[-6deg] md:h-28 md:w-28" },
] as const;

type MotifKind = (typeof motifs)[number]["kind"];

function Motif({ kind }: { kind: MotifKind }) {
  switch (kind) {
    case "coffee":
      return (
        <>
          <path d="M21 33c8-14 22-19 34-12-7 13-21 18-34 12Z" />
          <path d="M28 30c7-1 13-4 20-9" />
          <path d="M25 48c10-4 21-3 31 2" />
          <path d="M23 55c11-3 24-2 36 3" />
        </>
      );
    case "basket":
      return (
        <>
          <path d="M17 32c4 22 9 30 31 30s27-8 31-30H17Z" />
          <path d="M26 32c1-14 9-22 22-22s21 8 22 22" />
          <path d="M25 42h46M29 51h38" />
          <path d="M35 32c0 12 2 21 7 30M48 32v30M61 32c0 12-2 21-7 30" />
        </>
      );
    case "pottery":
      return (
        <>
          <path d="M38 12h20M41 12v11c-9 4-14 12-14 23 0 18 10 30 21 30s21-12 21-30c0-11-5-19-14-23V12" />
          <path d="M30 44c10 5 26 5 36 0" />
          <path d="M34 59c8 4 20 4 28 0" />
        </>
      );
    case "beads":
      return (
        <>
          <path d="M18 24c5 25 16 38 30 38s25-13 30-38" />
          <circle cx="22" cy="28" r="4" />
          <circle cx="29" cy="43" r="4" />
          <circle cx="41" cy="55" r="4" />
          <circle cx="55" cy="55" r="4" />
          <circle cx="67" cy="43" r="4" />
          <circle cx="74" cy="28" r="4" />
        </>
      );
    case "woodwork":
      return (
        <>
          <path d="M24 22h44v42H24Z" />
          <path d="M24 34h44M36 22v42" />
          <path d="M31 29c8 6 20 6 30 0" />
          <path d="M31 50c10-6 20-6 30 0" />
          <path d="M18 70h56" />
        </>
      );
    case "weave":
      return (
        <>
          <path d="M18 24c8 6 16 6 24 0s16-6 24 0 16 6 24 0" />
          <path d="M18 39c8 6 16 6 24 0s16-6 24 0 16 6 24 0" />
          <path d="M18 54c8 6 16 6 24 0s16-6 24 0 16 6 24 0" />
          <path d="M28 18v45M46 18v45M64 18v45M82 18v45" />
        </>
      );
  }
}

export function HomeArtPattern() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {motifs.map((motif, index) => (
        <svg
          key={`${motif.kind}-${index}`}
          viewBox="0 0 96 96"
          fill="none"
          className={`absolute hidden text-clay/10 sm:block ${motif.className}`}
          stroke="currentColor"
          strokeWidth="1.15"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Motif kind={motif.kind} />
        </svg>
      ))}
    </div>
  );
}