"use client";
import { useState } from "react";
import { T, mono, sans } from "@/lib/tokens";

const LINKS = [
  { label: "EMAIL", value: "river@email.com", href: "#" },
  { label: "LINKEDIN", value: "/in/river", href: "#" },
  { label: "GITHUB", value: "digital2analogue", href: "#" },
  { label: "RESUME", value: "river_resume_2026.pdf", href: "#" },
];

export default function ContactPage() {
  const [hover, setHover] = useState<string | null>(null);

  return (
    <div
      style={{
        padding: "clamp(32px,6vh,64px) clamp(20px,5vw,64px)",
        maxWidth: "640px",
      }}
    >
      <div style={{ marginBottom: "40px" }}>
        <div
          style={{
            fontFamily: mono,
            fontSize: "11px",
            letterSpacing: "0.12em",
            color: T.muted,
            marginBottom: "8px",
          }}
        >
          $ cat ./contact.md
        </div>
        <h1
          style={{
            fontFamily: mono,
            fontSize: "clamp(24px,4vw,36px)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: T.fg,
            margin: "0 0 16px",
          }}
        >
          Let&apos;s talk.
        </h1>
        <p
          style={{
            fontFamily: sans,
            fontSize: "14px",
            color: T.secondary,
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          Open to senior IC and staff roles in design systems, B2B product, or fintech. Also happy
          to talk about your hard design problem.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1px",
          background: T.border,
          marginBottom: "40px",
        }}
      >
        {LINKS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            onMouseEnter={() => setHover(l.label)}
            onMouseLeave={() => setHover(null)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 20px",
              background: hover === l.label ? T.surface : T.bg,
              borderLeft:
                hover === l.label ? `2px solid ${T.accent}` : "2px solid transparent",
              textDecoration: "none",
              transition: "background 150ms, border-color 150ms",
            }}
          >
            <span
              style={{
                fontFamily: mono,
                fontSize: "11px",
                letterSpacing: "0.12em",
                color: T.muted,
              }}
            >
              {l.label}
            </span>
            <span
              style={{
                fontFamily: mono,
                fontSize: "12px",
                color: hover === l.label ? T.accent : T.fg,
              }}
            >
              {l.value}
            </span>
          </a>
        ))}
      </div>

      <div
        style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderLeft: `2px solid ${T.accent}`,
          padding: "20px 24px",
        }}
      >
        <div
          style={{
            fontFamily: mono,
            fontSize: "11px",
            letterSpacing: "0.12em",
            color: T.muted,
            marginBottom: "8px",
          }}
        >
          STATUS //
        </div>
        <div style={{ fontFamily: mono, fontSize: "13px", color: T.fg }}>
          <span style={{ color: T.accent }}>●</span> Available for new opportunities
        </div>
        <div
          style={{
            fontFamily: sans,
            fontSize: "12px",
            color: T.muted,
            marginTop: "6px",
            lineHeight: 1.6,
          }}
        >
          Response time: usually within 24–48 hours.
        </div>
      </div>
    </div>
  );
}
