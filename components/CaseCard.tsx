"use client";
import Link from "next/link";
import { useState } from "react";
import { T, mono, sans } from "@/lib/tokens";
import type { CaseStudy } from "@/lib/cases";
import Tag from "./Tag";
import Divider from "./Divider";

export default function CaseCard({ c, href = "/work" }: { c: CaseStudy; href?: string }) {
  const [hover, setHover] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "block",
        background: hover ? T.surface : T.bg,
        padding: "24px",
        cursor: "pointer",
        transition: "background 150ms",
        borderLeft: hover ? `2px solid ${T.accent}` : "2px solid transparent",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "14px",
        }}
      >
        <span style={{ fontFamily: mono, fontSize: "11px", color: T.accent, fontWeight: 700 }}>
          {c.index}
        </span>
        <span style={{ fontFamily: mono, fontSize: "11px", letterSpacing: "0.10em", color: T.muted }}>
          {c.status}
        </span>
      </div>

      <div
        style={{
          fontFamily: mono,
          fontSize: "11px",
          letterSpacing: "0.10em",
          color: T.muted,
          marginBottom: "6px",
        }}
      >
        {c.company} · {c.year}
      </div>
      <div
        style={{
          fontFamily: mono,
          fontSize: "16px",
          fontWeight: 700,
          color: T.fg,
          marginBottom: "10px",
          lineHeight: 1.2,
          letterSpacing: "-0.01em",
        }}
      >
        {c.title}
      </div>
      <div
        style={{
          fontFamily: sans,
          fontSize: "12.5px",
          color: T.secondary,
          lineHeight: 1.6,
          marginBottom: "16px",
        }}
      >
        {c.summary}
      </div>

      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "16px" }}>
        {c.tags.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>

      <Divider />

      <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
        {c.metrics.map((m) => (
          <div
            key={m}
            style={{ fontFamily: mono, fontSize: "10px", color: T.accent, letterSpacing: "0.02em" }}
          >
            {m}
          </div>
        ))}
      </div>
    </Link>
  );
}
