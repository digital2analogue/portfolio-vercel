"use client";
import Link from "next/link";
import { T, mono, sans } from "@/lib/tokens";
import { CASES } from "@/lib/cases";
import { useTypewriter } from "@/lib/useTypewriter";
import Cursor from "@/components/Cursor";
import Divider from "@/components/Divider";
import CaseCard from "@/components/CaseCard";

export default function IndexPage() {
  const line1 = useTypewriter("$ whoami", 60, 200);
  const line2 = useTypewriter("River — Principal Designer", 42, 900);
  const line3 = useTypewriter(
    "Design systems. Complex B2B. Compliance-heavy fintech.",
    28,
    2200,
  );

  return (
    <div style={{ padding: "clamp(40px,8vh,96px) clamp(20px,5vw,64px)" }}>
      {/* Terminal hero */}
      <div style={{ marginBottom: "80px", maxWidth: "720px" }}>
        <div
          style={{
            fontFamily: mono,
            fontSize: "13px",
            color: T.muted,
            marginBottom: "28px",
            lineHeight: 2,
          }}
        >
          <div>
            <span style={{ color: T.accent }}>~</span> {line1.displayed}
            {!line1.done && <Cursor />}
          </div>
          {line1.done && (
            <div style={{ marginTop: "4px" }}>
              <span style={{ color: T.border }}>// </span>
              <span style={{ color: T.fg, fontSize: "15px", fontWeight: 600 }}>
                {line2.displayed}
              </span>
              {line2.done ? null : <Cursor />}
            </div>
          )}
          {line2.done && (
            <div style={{ marginTop: "4px" }}>
              <span style={{ color: T.border }}>// </span>
              <span style={{ color: T.secondary }}>{line3.displayed}</span>
              {!line3.done && <Cursor />}
            </div>
          )}
        </div>

        <div
          style={{
            fontFamily: mono,
            fontSize: "clamp(32px, 6vw, 56px)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: T.fg,
            marginBottom: "28px",
          }}
        >
          Product design
          <br />
          <span style={{ color: T.accent }}>for systems</span>
          <br />
          that scale.
        </div>

        <div
          style={{
            fontFamily: sans,
            fontSize: "15px",
            color: T.secondary,
            lineHeight: 1.7,
            maxWidth: "520px",
            marginBottom: "36px",
          }}
        >
          I design decision tooling, compliance surfaces, and design systems at the intersection of
          policy, data, and enterprise UX. Currently open to senior IC and staff roles.
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link
            href="/work"
            style={{
              fontFamily: mono,
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: T.bg,
              background: T.accent,
              padding: "10px 20px",
              borderRadius: "2px",
              textDecoration: "none",
            }}
          >
            VIEW WORK →
          </Link>
          <Link
            href="/contact"
            style={{
              fontFamily: mono,
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: T.accent,
              background: "transparent",
              border: `1px solid ${T.accent}`,
              padding: "10px 20px",
              borderRadius: "2px",
              textDecoration: "none",
            }}
          >
            GET IN TOUCH
          </Link>
        </div>
      </div>

      <Divider />

      {/* Status bar */}
      <div
        style={{
          display: "flex",
          gap: "32px",
          flexWrap: "wrap",
          padding: "20px 0",
          marginBottom: "64px",
        }}
      >
        {[
          { label: "STATUS", value: "Open to work" },
          { label: "LOCATION", value: "Remote / US" },
          { label: "FOCUS", value: "Fintech · B2B · Systems" },
          { label: "UPDATED", value: "2026-04-18" },
        ].map(({ label, value }) => (
          <div key={label}>
            <div
              style={{
                fontFamily: mono,
                fontSize: "11px",
                letterSpacing: "0.12em",
                color: T.secondary,
                marginBottom: "4px",
              }}
            >
              {label} //
            </div>
            <div style={{ fontFamily: mono, fontSize: "12px", color: T.fg, fontWeight: 500 }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Selected work */}
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <div
          style={{
            fontFamily: mono,
            fontSize: "11px",
            letterSpacing: "0.12em",
            color: T.muted,
          }}
        >
          SELECTED WORK_
        </div>
        <Link
          href="/work"
          style={{
            fontFamily: mono,
            fontSize: "10px",
            color: T.accent,
            textDecoration: "none",
            letterSpacing: "0.08em",
          }}
        >
          VIEW ALL →
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1px",
          background: T.border,
        }}
      >
        {CASES.map((c) => (
          <CaseCard key={c.index} c={c} href="/work" />
        ))}
      </div>
    </div>
  );
}
