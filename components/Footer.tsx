import Link from "next/link";
import { T, mono } from "@/lib/tokens";
import Cursor from "./Cursor";

const FOOTER_LINKS = [
  { label: "WORK", href: "/work" },
  { label: "ABOUT", href: "/about" },
  { label: "CONTACT", href: "/contact" },
] as const;

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: `1px solid ${T.border}`,
        padding: "20px clamp(20px,5vw,64px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "12px",
      }}
    >
      <span style={{ fontFamily: mono, fontSize: "10px", color: T.muted }}>
        river@portfolio ~ % <Cursor />
      </span>
      <div style={{ display: "flex", gap: "16px" }}>
        {FOOTER_LINKS.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            style={{
              fontFamily: mono,
              fontSize: "9px",
              letterSpacing: "0.1em",
              color: T.muted,
              textDecoration: "none",
            }}
          >
            {l.label}
          </Link>
        ))}
      </div>
      <span style={{ fontFamily: mono, fontSize: "10px", color: T.muted }}>© 2026 River</span>
    </footer>
  );
}
