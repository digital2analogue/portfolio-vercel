"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { label: "INDEX", href: "/" },
  { label: "WORK", href: "/work" },
  { label: "TOKENS", href: "/tokens" },
  { label: "ABOUT", href: "/about" },
  { label: "CONTACT", href: "/contact" },
] as const;

export default function Nav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <nav className="topbar" aria-label="Primary">
      <Link className="topbar__brand" href="/">
        <span className="topbar__brand-glyph" aria-hidden="true">›</span>
        river.
      </Link>
      <div className="topbar__links">
        {LINKS.map((l) => {
          const active = isActive(l.href);
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
