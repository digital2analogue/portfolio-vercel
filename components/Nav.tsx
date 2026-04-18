"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { T, mono } from "@/lib/tokens";

const LINKS = [
  { label: "INDEX", href: "/" },
  { label: "WORK", href: "/work" },
  { label: "ABOUT", href: "/about" },
  { label: "CONTACT", href: "/contact" },
] as const;

export default function Nav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: T.bg,
        borderBottom: `1px solid ${T.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 clamp(20px,5vw,64px)",
        height: "52px",
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: mono,
          fontSize: "13px",
          fontWeight: 700,
          color: T.fg,
          textDecoration: "none",
          letterSpacing: "-0.01em",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span style={{ color: T.accent }}>›</span> river.
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
        {LINKS.map((l, i) => {
          const active = isActive(l.href);
          return (
            <Link
              key={l.label}
              href={l.href}
              style={{
                fontFamily: mono,
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                color: active ? T.accent : T.secondary,
                background: active ? `${T.accent}14` : "none",
                padding: "6px 12px",
                borderRadius: "2px",
                textDecoration: "none",
                transition: "color 150ms, background 150ms",
              }}
            >
              {i + 1}. {l.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
