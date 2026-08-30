/**
 * Evidence gating.
 *
 * Every numeric figure on this site passes through `gate()` before it can be
 * rendered. The rule set is non-negotiable and comes from the project handoff:
 *
 *   - A figure is publishable only when it has been confirmed against the
 *     issuing state's public rate filing (SERFF or the state's own system) AND
 *     carries a source citation naming that filing.
 *   - Tier C is the ingestion tier. It is never publishable.
 *   - The licensed vendor export that seeds the database is never named on any
 *     public page, and its values are never rendered as figures.
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

/** The common envelope every rate record carries. */
export interface EvidenceEnvelope {
  evidence_tier: EvidenceTier;
  verification_status: VerificationStatus;
  publishable: boolean;
  source_citation?: SourceCitation | null;
}

export type GateResult<T> =
  | { published: true; value: T; citation: SourceCitation }
  | { published: false; reason: WithheldReason };

export type WithheldReason =
  | "no_record"
  | "no_value"
  | "tier_c"
  | "not_confirmed"
  | "not_flagged_publishable"
  | "missing_citation"
  | "superseded";

export const WITHHELD_COPY: Record<WithheldReason, string> = {
  no_record: "No filing on record yet for this plan and state.",
  no_value: "The filing is on record but this figure is not in it.",
  tier_c: "Awaiting filing verification — research tier only.",
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
export function gate<T>(
  record: EvidenceEnvelope | null | undefined,
  value: T | null | undefined,
): GateResult<T> {
  if (!record) return { published: false, reason: "no_record" };
  if (record.evidence_tier === "C") return { published: false, reason: "tier_c" };
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
  if (value === null || value === undefined || (typeof value === "number" && !Number.isFinite(value))) {
    return { published: false, reason: "no_value" };
  }
  return { published: true, value, citation: record.source_citation };
}

/** True when the whole record may be rendered as verified content. */
export function isPublishable(record: EvidenceEnvelope | null | undefined): boolean {
  return gate(record, true).published;
}

/** Count how many of a set of records cleared the gate. */
export function publishableCount(records: readonly EvidenceEnvelope[]): number {
  return records.reduce((n, r) => n + (isPublishable(r) ? 1 : 0), 0);
}
