import Link from "next/link";
import { Logo } from "./Logo";
import { GOVERNMENT_DISCLAIMER } from "@/lib/site";

const LINKS = [
  { href: "/medigap-rate-history", label: "Rate history" },
  { href: "/medigap-plans", label: "Plans" },
  { href: "/methodology", label: "Methodology" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      {/*
        Government non-affiliation, at the top of every page. The site is
        designed to read as neutral research, which makes stating who operates
        it more necessary rather than less.
      */}
      <div className="gov-bar">
        <div className="wrap">
          <p>{GOVERNMENT_DISCLAIMER}</p>
        </div>
      </div>
      <div className="wrap site-header__inner">
        <Link href="/" className="brand">
          <Logo />
          <span className="brand__name">
            My<b>Medigap</b>Rate
          </span>
        </Link>
        <nav className="nav" aria-label="Primary">
          <ul>
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
            <li>
              <Link href="/contact" className="cta">
                Talk to a person
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
