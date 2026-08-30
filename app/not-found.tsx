import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap wrap-narrow">
        <p className="eyebrow">404</p>
        <h1 style={{ marginTop: 0 }}>That page is not here</h1>
        <p className="lede">
          The address may have changed, or the state and plan combination may not have a page yet.
        </p>
        <div className="btn-row">
          <Link href="/medigap-rate-history" className="btn btn--primary">
            Browse rate history by state
          </Link>
          <Link href="/medigap-plans" className="btn btn--ghost">
            Compare plans
          </Link>
        </div>
      </div>
    </section>
  );
}
