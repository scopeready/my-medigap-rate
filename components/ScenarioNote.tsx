import type { ResearchPanel } from "@/lib/evidence";

/**
 * What an unverified premium actually describes.
 *
 * Every premium on this site that has not yet been matched to a filing comes
 * from one quoted scenario. A reader who is male, or a smoker, or 78, or in a
 * different county pays something else — so the number is a like-for-like
 * comparison between carriers, never a quote. Saying that beside the table is
 * not a disclaimer; without it the figures misdescribe most of the people
 * reading them.
 *
 * It renders only while unverified figures are on the page. Once a state and
 * plan is fully filing-confirmed, `getResearchPanel()` returns null and this
 * disappears rather than lingering as untrue boilerplate.
 */
export function ScenarioNote({ panel }: { panel: ResearchPanel | null }) {
  if (!panel) return null;

  const ages =
    panel.ages.length > 1
      ? `${panel.ages.slice(0, -1).join(", ")} and ${panel.ages[panel.ages.length - 1]}`
      : String(panel.ages[0] ?? "");

  return (
    <aside className="scenario-note" aria-label="What these premiums describe">
      <p>
        <strong>What these premiums describe.</strong> Figures marked{" "}
        <span className="figure-unverified">(unverified)</span> come from {panel.sourceLabel} and
        have not yet been matched to a public rate filing. They are quoted for one scenario:{" "}
        <strong>{panel.profile.toLowerCase()}</strong>, at age {ages}, in {panel.areaBasis
          .charAt(0)
          .toLowerCase() + panel.areaBasis.slice(1)}, effective {panel.quoteEffective}.
      </p>
      <p style={{ marginBottom: 0 }}>
        If you are a different age or sex, use tobacco, or live in another part of the state, your
        own premium will differ — often substantially, because most Medigap policies are
        attained-age rated. Read the figures as a like-for-like comparison between carriers, not as
        a quote. Rate-increase history is a property of the block of policies and does not change
        with the scenario.
      </p>
    </aside>
  );
}
