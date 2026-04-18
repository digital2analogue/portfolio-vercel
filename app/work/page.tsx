"use client";
import { useState } from "react";
import { T, mono, sans } from "@/lib/tokens";
import { CASES } from "@/lib/cases";
import Tag from "@/components/Tag";

export default function WorkPage() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div style={{ padding: "clamp(32px,6vh,64px) clamp(20px,5vw,64px)" }}>
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
          $ ls ./work/
        </div>
        <h1
          style={{
            fontFamily: mono,
            fontSize: "clamp(24px,4vw,36px)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: T.fg,
            margin: 0,
          }}
        >
          Case Studies
        </h1>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: T.border }}>
        {CASES.map((c) => {
          const expanded = open === c.index;
          return (
            <div key={c.index} style={{ background: T.bg }}>
              {/* Header row */}
              <div
                onClick={() => setOpen(expanded ? null : c.index)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "40px 1fr auto",
                  gap: "16px",
                  alignItems: "center",
                  padding: "20px 24px",
                  cursor: "pointer",
                  background: expanded ? T.surface : T.bg,
                  borderLeft: expanded ? `2px solid ${T.accent}` : "2px solid transparent",
                  transition: "background 150ms",
                }}
                onMouseEnter={(e) => {
                  if (!expanded) e.currentTarget.style.background = T.surface2;
                }}
                onMouseLeave={(e) => {
                  if (!expanded) e.currentTarget.style.background = T.bg;
                }}
              >
                <span style={{ fontFamily: mono, fontSize: "11px", color: T.accent, fontWeight: 700 }}>
                  {c.index}
                </span>
                <div>
                  <div
                    style={{
                      fontFamily: mono,
                      fontSize: "11px",
                      letterSpacing: "0.10em",
                      color: T.muted,
                      marginBottom: "3px",
                    }}
                  >
                    {c.company} · {c.year} · {c.role}
                  </div>
                  <div
                    style={{
                      fontFamily: mono,
                      fontSize: "15px",
                      fontWeight: 700,
                      color: T.fg,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {c.title}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: "5px" }}>
                    {c.tags.slice(0, 2).map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                  <span
                    style={{
                      fontFamily: mono,
                      fontSize: "12px",
                      color: expanded ? T.accent : T.muted,
                    }}
                  >
                    {expanded ? "[ − ]" : "[ + ]"}
                  </span>
                </div>
              </div>

              {/* Expanded detail */}
              {expanded && (
                <div
                  style={{
                    background: T.surface,
                    padding: "0 24px 28px 80px",
                    borderLeft: `2px solid ${T.accent}`,
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 220px",
                      gap: "32px",
                      alignItems: "start",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: sans,
                          fontSize: "13.5px",
                          color: T.secondary,
                          lineHeight: 1.7,
                          marginBottom: "24px",
                          marginTop: "20px",
                        }}
                      >
                        {c.summary}
                      </div>
                      <div style={{ marginBottom: "16px" }}>
                        <div
                          style={{
                            fontFamily: mono,
                            fontSize: "11px",
                            letterSpacing: "0.12em",
                            color: T.muted,
                            marginBottom: "8px",
                          }}
                        >
                          IMPACT //
                        </div>
                        {c.metrics.map((m) => (
                          <div
                            key={m}
                            style={{
                              fontFamily: mono,
                              fontSize: "11px",
                              color: T.accent,
                              marginBottom: "4px",
                            }}
                          >
                            {m}
                          </div>
                        ))}
                      </div>
                      <button
                        style={{
                          fontFamily: mono,
                          fontSize: "10px",
                          fontWeight: 600,
                          letterSpacing: "0.08em",
                          color: T.bg,
                          background: T.accent,
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "2px",
                          cursor: "pointer",
                          marginTop: "8px",
                        }}
                      >
                        READ CASE STUDY →
                      </button>
                    </div>
                    <div style={{ marginTop: "20px" }}>
                      <div
                        style={{
                          fontFamily: mono,
                          fontSize: "11px",
                          letterSpacing: "0.12em",
                          color: T.muted,
                          marginBottom: "10px",
                        }}
                      >
                        META //
                      </div>
                      {(
                        [
                          ["Company", c.company],
                          ["Year", c.year],
                          ["Role", c.role],
                          ["Status", c.status],
                        ] as const
                      ).map(([k, v]) => (
                        <div key={k} style={{ marginBottom: "10px" }}>
                          <div
                            style={{
                              fontFamily: mono,
                              fontSize: "11px",
                              color: T.muted,
                              letterSpacing: "0.08em",
                              marginBottom: "2px",
                            }}
                          >
                            {k}
                          </div>
                          <div style={{ fontFamily: mono, fontSize: "11px", color: T.fg }}>{v}</div>
                        </div>
                      ))}
                      <div
                        style={{
                          marginTop: "12px",
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "4px",
                        }}
                      >
                        {c.tags.map((t) => (
                          <Tag key={t}>{t}</Tag>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
