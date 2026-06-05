"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { label: "WORK", href: "/work" },
  { label: "SYSTEM", href: "/work/design-tokens" },
  { label: "ABOUT", href: "/about" },
  { label: "CONTACT", href: "/contact" },
] as const;

export default function Nav() {
  const pathname = usePathname();
  // Most specific match wins, so /work/design-tokens lights up SYSTEM (not WORK),
  // while /work and other /work/* pages light up WORK.
  const matches = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
  const activeHref = LINKS
    .map((l) => l.href)
    .filter(matches)
    .sort((a, b) => b.length - a.length)[0];

  return (
    <nav className="topbar" aria-label="Primary">
      <Link className="topbar__brand" href="/" aria-label="Home">
        <span className="topbar__brand-glyph" aria-hidden="true">›</span>
        river.
        <span className="cursor cursor--sm" aria-hidden="true" />
      </Link>
      <div className="topbar__links">
        {LINKS.map((l) => {
          const active = l.href === activeHref;
          return (
            <Link
              key={l.label}
              href={l.href}
              aria-current={active ? "page" : undefined}
            >
              {l.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
