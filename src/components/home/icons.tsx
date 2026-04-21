import type { ComponentType, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/* Hand-drawn style minimal SVG icons — single stroke, organic */

export const CompassIcon: ComponentType<IconProps> = (props) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M24 5c10.4.2 18.7 8.7 19 19-.3 10.5-8.6 18.8-19 19C13.5 42.7 5.2 34.4 5 24 5.3 13.6 13.6 5.3 24 5Z" />
    <path d="M30 18 L26 26 L18 30 L22 22 Z" />
    <circle cx="24" cy="24" r="1.2" fill="currentColor" />
  </svg>
);

export const ThreadIcon: ComponentType<IconProps> = (props) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M8 12c4 3 8 3 12 0s8-3 12 0 8 3 12 0" />
    <path d="M8 24c4 3 8 3 12 0s8-3 12 0 8 3 12 0" />
    <path d="M8 36c4 3 8 3 12 0s8-3 12 0 8 3 12 0" />
  </svg>
);

export const VesselIcon: ComponentType<IconProps> = (props) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 8h12M19 8v4c-4 1-7 5-7 10 0 8 4 18 12 18s12-10 12-18c0-5-3-9-7-10V8" />
    <path d="M14 22c4 2 16 2 20 0" opacity="0.5" />
  </svg>
);

export const LeafIcon: ComponentType<IconProps> = (props) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M8 40c0-18 14-32 32-32-1 18-14 32-32 32Z" />
    <path d="M8 40 32 16" />
  </svg>
);

export const QuoteGlyph: ComponentType<IconProps> = (props) => (
  <svg viewBox="0 0 80 60" fill="currentColor" aria-hidden {...props}>
    <path d="M0 60V36c0-12 5-24 16-32l5 6c-7 6-11 13-12 20h11v30H0Zm45 0V36c0-12 5-24 16-32l5 6c-7 6-11 13-12 20h11v30H45Z" />
  </svg>
);
