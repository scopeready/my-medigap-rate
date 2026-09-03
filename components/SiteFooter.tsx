import Link from "next/link";
import {
  ORG,
  SITE,
  TPMO_DISCLAIMER,
  GOVERNMENT_DISCLAIMER,
  DATA_DISCLAIMER,
  LICENSING_DISCLOSURE,
  COMPENSATION_NOTE,
} from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <h4>Research</h4>
            <ul>
              <li><Link href="/medigap-rate-history">Rate history by state</Link></li>
              <li><Link href="/medigap-plans">Plan benefits</Link></li>
              <li><Link href="/methodology">How we verify figures</Link></li>
            </ul>
          </div>
          <div>
            <h4>Guides</h4>
            <ul>
              <li><Link href="/why-did-my-medigap-premium-increase">Why my premium went up</Link></li>
              <li><Link href="/how-medigap-rates-work">How Medigap rates work</Link></li>
              <li><Link href="/what-is-a-closed-block">What is a closed block</Link></li>
              <li><Link href="/medigap-loss-ratios-explained">Loss ratios explained</Link></li>
              <li><Link href="/switching-medigap-plans">Switching plans</Link></li>
              <li><Link href="/turning-65">Turning 65</Link></li>
            </ul>
          </div>
          <div>
            <h4>Site</h4>
            <ul>
              <li><Link href="/rate-review">Free rate review</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/privacy">Privacy</Link></li>
              <li><Link href="/terms">Terms</Link></li>
            </ul>
          </div>
          <div>
            <h4>Official Medicare</h4>
            <ul>
              <li>
                <a href="https://www.medicare.gov" rel="noopener noreferrer" target="_blank">
                  Medicare.gov
                </a>
              </li>
              <li><a href="tel:+18006334227">1-800-MEDICARE</a></li>
              <li>
                <a href="https://www.shiphelp.org" rel="noopener noreferrer" target="_blank">
                  Free SHIP counseling
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Same agency</h4>
            <ul>
              <li>
                <a href="https://www.medicareenrollmentarizona.com" rel="noopener noreferrer">
                  Medicare Enrollment Arizona
                </a>
              </li>
              <li>
                <a href="https://georgiamedicareenrollment.com" rel="noopener noreferrer">
                  Georgia Medicare Enrollment
                </a>
              </li>
              <li>
                <a href="https://minnesotamedicareenrollment.com" rel="noopener noreferrer">
                  Minnesota Medicare Enrollment
                </a>
              </li>
              <li>
                <a href="https://www.myecos360.com/darin-weidauer" rel="noopener noreferrer">
                  About Darin Weidauer
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li><a href={`tel:${ORG.phoneHref}`}>{ORG.phone}</a></li>
              <li><a href={`mailto:${ORG.email}`}>{ORG.email}</a></li>
              <li>{ORG.legalName}</li>
            </ul>
          </div>
        </div>

        <div className="footer-legal">
          <p>{GOVERNMENT_DISCLAIMER}</p>
          <p>
            {LICENSING_DISCLOSURE} {COMPENSATION_NOTE}
          </p>
          <p>{TPMO_DISCLAIMER}</p>
          <p>{DATA_DISCLAIMER}</p>
          <p>
            Nothing on this site is a quote, an offer of coverage, or a recommendation to buy,
            drop or change a policy. Premiums, benefits and availability vary by carrier, state,
            ZIP code, age, tobacco use and underwriting, and they change. Confirm any figure with
            the carrier or the issuing state&rsquo;s insurance department before you act on it.
          </p>
          <p>
            &copy; {year} {SITE.name}. Operated by {ORG.legalName} &mdash; {ORG.agent}, licensed
            insurance agent, National Producer Number {ORG.npn}.
          </p>
        </div>
      </div>
    </footer>
  );
}
