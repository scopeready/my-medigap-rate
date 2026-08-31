/**
 * Evidence gating.
 *
 * Every numeric figure on this site passes through `gate()` before it can be
 * rendered. The rule set is non-negotiable and comes from the project handoff:
 *
 *   - A figure confirmed against the issuing state's public rate filing, and
 *     carrying a citation naming that filing, is published as verified.
 *   - A figure from the licensed research panel is published only when it
 *     carries the panel's own provenance: the scenario that produced it and
 *     the fact that no filing has confirmed it yet. It is never presented as
 *     filing-confirmed, and the vendor is never named.
 *   - Anything else is withheld, with the reason shown.
 *
 * The two dispositions are not equal and the page must never blur them. A
 * filing citation is checkable by the reader; a research figure is a starting
 * point that verification later upgrades. Rendering them identically would
 * turn the site's central claim into decoration.
 *
 * The gate fails closed: anything it does not fully understand is withheld.
 */

/** Strength of the evidence behind a single record. */
export type EvidenceTier =
  /** Confirmed against the filing document itself, with an exhibit reference. */
  | "A"
  /** Confirmed against the filing's public summary or the state's rate table. */
  | "B"
  /** Ingested from a licensed vendor export. Research use only. Never public. */
  | "C";

export type VerificationStatus =
  | "unverified"
  | "in_review"
  | "filing_confirmed"
  | "superseded"
  | "withdrawn";

export interface SourceCitation {
  /** Public filing identifier, e.g. a SERFF tracking number. */
  filingNumber: string;
  /** Public URL where the filing can be read. */
  url: string;
  /** Regulator that received the filing, e.g. "Nevada Division of Insurance". */
  regulator: string;
  /** ISO date the filing was accessed. */
  accessed: string;
  /** Optional exhibit / page reference within the filing. */
  exhibit?: string;
}

/**
 * The scenario a research-panel figure describes.
 *
 * It travels with the data rather than living in a page, so no page can render
 * a panel premium without saying what produced it. A premium quoted for a
 * 65-year-old non-smoking woman in one ZIP is not the reader's premium, and
 * presenting it without that qualification would mislead most readers.
 */
export interface ResearchPanel {
  /** Rated profile, e.g. "Female, non-tobacco". */
  profile: string;
  /** Issue ages the panel covers. */
  ages: readonly number[];
  /** How the geographic area was chosen. */
  areaBasis: string;
  /** Quote effective date, ISO. */
  quoteEffective: string;
  /** Date the panel was collected, ISO. */
  collected: string;
  /** Neutral description of the source. The vendor is never named. */
  sourceLabel: string;
}

/** Where a published figure came from, and therefore how it must be labelled. */
export type Provenance =
  | { kind: "filing"; citation: SourceCitation }
  | { kind: "research"; panel: ResearchPanel };

/** The common envelope every rate record carries. */
export interface EvidenceEnvelope {
  evidence_tier: EvidenceTier;
  verification_status: VerificationStatus;
  publishable: boolean;
  source_citation?: SourceCitation | null;
  /**
   * Present only on records loaded from the committed research dataset. Its
   * presence is what allows a Tier C figure to render at all, and it is what
   * forces the scenario onto the page alongside the number.
   */
  research_panel?: ResearchPanel | null;
}

export type GateResult<T> =
  | { published: true; value: T; provenance: Provenance }
  | { published: false; reason: WithheldReason };

export type WithheldReason =
  | "no_record"
  | "no_value"
  | "tier_c"
  | "not_confirmed"
  | "not_flagged_publishable"
  | "missing_citation"
  | "no_panel"
  | "superseded";

export const WITHHELD_COPY: Record<WithheldReason, string> = {
  no_record: "No filing on record yet for this plan and state.",
  no_value: "The filing is on record but this figure is not in it.",
  tier_c: "Awaiting filing verification — research tier only.",
  no_panel: "No research figure on record, and no filing confirmed yet.",
  not_confirmed: "Filing verification in progress.",
  not_flagged_publishable: "Held back pending final review.",
  missing_citation: "Held back until the filing can be cited.",
  superseded: "Superseded by a newer filing; the replacement is not yet verified.",
};

function isCitation(c: SourceCitation | null | undefined): c is SourceCitation {
  return Boolean(
    c &&
      typeof c.filingNumber === "string" &&
      c.filingNumber.trim() &&
      typeof c.url === "string" &&
      /^https?:\/\//.test(c.url) &&
      typeof c.regulator === "string" &&
      c.regulator.trim(),
  );
}

/**
 * Decide whether a single value may be shown. Fails closed.
 *
 * @param record  the evidence envelope the value belongs to
 * @param value   the value itself (null/undefined is treated as absent)
 */
function hasValue<T>(value: T | null | undefined): value is T {
  if (value === null || value === undefined) return false;
  return !(typeof value === "number" && !Number.isFinite(value));
}

export function gate<T>(
  record: EvidenceEnvelope | null | undefined,
  value: T | null | undefined,
): GateResult<T> {
  if (!record) return { published: false, reason: "no_record" };

  // Tier C is the research tier. It publishes only through the panel path, and
  // only ever labelled as unverified — never as a filing.
  if (record.evidence_tier === "C") {
    if (!record.research_panel) return { published: false, reason: "tier_c" };
    if (!hasValue(value)) return { published: false, reason: "no_value" };
    return { published: true, value, provenance: { kind: "research", panel: record.research_panel } };
  }

  if (record.verification_status === "superseded" || record.verification_status === "withdrawn") {
    return { published: false, reason: "superseded" };
  }
  if (record.verification_status !== "filing_confirmed") {
    return { published: false, reason: "not_confirmed" };
  }
  if (record.publishable !== true) {
    return { published: false, reason: "not_flagged_publishable" };
  }
  if (!isCitation(record.source_citation)) {
    return { published: false, reason: "missing_citation" };
  }
  if (!hasValue(value)) return { published: false, reason: "no_value" };
  return { published: true, value, provenance: { kind: "filing", citation: record.source_citation } };
}

/** True when the record is confirmed against a filing — the strong claim. */
export function isFilingConfirmed(record: EvidenceEnvelope | null | undefined): boolean {
  const r = gate(record, true);
  return r.published && r.provenance.kind === "filing";
}

/** True when the record may be rendered at all, by either route. */
export function isPublishable(record: EvidenceEnvelope | null | undefined): boolean {
  return gate(record, true).published;
}

/** Count how many of a set of records cleared the gate. */
export function publishableCount(records: readonly EvidenceEnvelope[]): number {
  return records.reduce((n, r) => n + (isPublishable(r) ? 1 : 0), 0);
}
