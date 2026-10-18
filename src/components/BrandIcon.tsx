import type { ReactNode, SVGProps } from "react";

export type BrandIconName =
  "home" | "plan" | "circle" | "jar" | "learn" | "sprout" | "sun" | "wallet";

const drawings: Record<BrandIconName, ReactNode> = {
  home: (
    <>
      <path d="m3 11 9-8 9 8M5 10v10h14V10M10 20v-6h4v6" />
      <path d="M9 8h6" />
    </>
  ),
  plan: (
    <>
      <path d="M6 3h12v18H6zM9 7h6M9 11h6M9 15h2" />
      <path d="m13 17 2 2 5-5" />
    </>
  ),
  circle: (
    <>
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="3" r="1.5" />
      <circle cx="20" cy="16.5" r="1.5" />
      <circle cx="4" cy="16.5" r="1.5" />
      <path d="M16 4.5a8.5 8.5 0 0 1 4.5 7M16.5 20a8.5 8.5 0 0 1-9 0M3.5 11.5a8.5 8.5 0 0 1 4.5-7" />
    </>
  ),
  jar: (
    <>
      <path d="M7 5h10M8 5v3c-3 2-3 4-3 6v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5c0-2 0-4-3-6V5M7 2h10v3H7z" />
      <path d="M9 16h6M12 11v7M9 13h4" />
    </>
  ),
  learn: (
    <>
      <path d="M12 6C8 3 5 3 2 4v15c3-1 6-1 10 2 4-3 7-3 10-2V4c-3-1-6-1-10 2v15M5 8l4 1M5 12l4 1M15 9l4-1M15 13l4-1" />
    </>
  ),
  sprout: (
    <>
      <path d="M12 21V10M12 14C5 14 3 9 3 5c7 0 9 4 9 9ZM12 10c0-5 4-7 9-7 0 5-3 9-9 9M7 21h10" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v3M12 20v3M1 12h3M20 12h3M4 4l2 2M18 18l2 2M4 20l2-2M18 6l2-2" />
    </>
  ),
  wallet: (
    <>
      <path d="M4 7h15a2 2 0 0 1 2 2v11H5a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h12v4M21 12h-6v5h6" />
      <path d="M17 14.5h.1M7 12l2 2 3-3" />
    </>
  ),
};

export function BrandIcon({ name, ...props }: SVGProps<SVGSVGElement> & { name: BrandIconName }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {drawings[name]}
    </svg>
  );
}
