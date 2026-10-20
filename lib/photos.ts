/**
 * The site's photographs, in one place.
 *
 * Every image is a generated illustration, not a photograph of a client, a
 * policyholder or anyone at the agency. None carries a caption, a name or a
 * quote, so none can read as a testimonial — keep it that way. They also
 * carry no Medicare cards, government seals or carrier logos: the gov-bar
 * says the site is not connected with Medicare, and a picture must not say
 * otherwise.
 *
 * Files live in public/img/ as `<name>.webp` (1x) and `<name>@2x.webp`.
 */

export interface Photo {
  /** Basename under /img/. */
  name: string;
  /** Describes the picture for a screen reader. Never a claim about the reader. */
  alt: string;
  /** 1x intrinsic size; the 2x file is double. Reserves layout space. */
  width: number;
  height: number;
}

const wide = { width: 1280, height: 724 } as const;
const photo = { width: 880, height: 585 } as const;

export const PHOTOS = {
  homeHero: {
    name: "home-hero",
    alt: "A couple in their seventies at a kitchen table, one reading a letter while the other looks at a laptop.",
    ...wide,
  },
  premiumNotice: {
    name: "premium-notice",
    alt: "Hands holding an insurance premium notice beside an opened envelope, reading glasses and a calculator.",
    ...photo,
  },
  researchDesk: {
    name: "research-desk",
    alt: "A desk stacked with tabbed filing folders, printed tables and a magnifying glass under a lamp.",
    ...photo,
  },
  neighborhood: {
    name: "neighborhood",
    alt: "An aerial view of a tree-lined residential neighbourhood at golden hour.",
    ...photo,
  },
  doctorVisit: {
    name: "doctor-visit",
    alt: "A physician talking with an older patient in a bright exam room.",
    ...photo,
  },
  turning65: {
    name: "turning-65",
    alt: "A couple in their sixties laughing on a desert foothills trail in the early morning.",
    ...photo,
  },
  comparingPlans: {
    name: "comparing-plans",
    alt: "An older man at a home desk making notes on a legal pad beside a laptop.",
    ...photo,
  },
  phoneReview: {
    name: "phone-review",
    alt: "A woman in her seventies in an armchair, smiling during a phone call, with a notepad on her lap.",
    ...photo,
  },
  retirementGuide: {
    name: "retirement-guide",
    alt: "A printed guidebook open on a wooden table beside a cup of coffee and reading glasses.",
    ...photo,
  },
  agencyOffice: {
    name: "agency-office",
    alt: "A small agency office with a wooden desk, a desk phone, folders and two chairs for visitors.",
    ...photo,
  },
  porchFriends: {
    name: "porch-friends",
    alt: "A group of friends in their seventies and eighties talking on a front porch on a summer evening.",
    ...photo,
  },
  claimsVsPremiums: {
    name: "claims-vs-premiums",
    alt: "Medical bills and receipts sorted into two piles on a table beside a calculator.",
    ...photo,
  },
} as const satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof PHOTOS;
