"use client";
import { useState } from "react";
import { T, mono, sans } from "@/lib/tokens";
import {
  tokenCatalog,
  sectionColors,
  type TokenItem,
  type TokenSection,
  type TokenSectionKey,
} from "@/lib/tokenCatalog";

function Label({ text, color }: { text: string; color?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
      <span
        style={{
          fontFamily: mono,
          fontSize: "9px",
          fontWeight: 700,
          letterSpacing: "0.15em",
          color: color || T.accent,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </span>
      <div style={{ flex: 1, height: "1px", background: color || T.accent, opacity: 0.18 }} />
    </div>
  );
}

function TokenRow({ token, value, note, swatch }: TokenItem) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    try {
      navigator.clipboard.writeText(value);
    } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div
      onClick={copy}
      style={{
        display: "grid",
        gridTemplateColumns: "200px 1fr 48px",
        gap: "10px",
        alignItems: "center",
        padding: "6px 10px",
        cursor: "pointer",
        borderRadius: "2px",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(200,82,10,0.09)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
        {swatch && (
          <div
            style={{
              width: "13px",
              height: "13px",
              flexShrink: 0,
              borderRadius: "2px",
              background: swatch,
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          />
        )}
        <span
          style={{
            fontFamily: mono,
            fontSize: "11px",
            color: T.accent,
            fontWeight: 500,
          }}
        >
          {token}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px", overflow: "hidden" }}>
        <span
          style={{
            fontFamily: mono,
            fontSize: "10.5px",
            color: T.secondary,
            background: T.surface2,
            padding: "2px 6px",
            borderRadius: "2px",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {value}
        </span>
        {note && (
          <span
            style={{
              fontFamily: sans,
              fontSize: "11px",
              color: T.muted,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {note}
          </span>
        )}
      </div>

      <span
        style={{
          fontFamily: mono,
          fontSize: "9px",
          color: copied ? T.accent : T.muted,
          transition: "color 120ms",
          textAlign: "right",
        }}
      >
        {copied ? "✓ ok" : "copy"}
      </span>
    </div>
  );
}

function Section({
  sectionKey,
  data,
  active,
  onClick,
}: {
  sectionKey: TokenSectionKey;
  data: TokenSection;
  active: boolean;
  onClick: () => void;
}) {
  const color = sectionColors[sectionKey];
  return (
    <div style={{ borderBottom: `1px solid ${T.border}` }}>
      <button
        onClick={onClick}
        style={{
          width: "100%",
          background: active ? T.surface : "transparent",
          border: "none",
          padding: "13px 18px",
          cursor: "pointer",
          textAlign: "left",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "12px",
          transition: "background 120ms",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: mono,
              fontSize: "10.5px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: active ? color : T.secondary,
              textTransform: "uppercase",
            }}
          >
            {data.label}
          </div>
          {active && (
            <div
              style={{
                fontFamily: sans,
                fontSize: "11.5px",
                color: T.muted,
                marginTop: "4px",
                lineHeight: 1.5,
              }}
            >
              {data.description}
            </div>
          )}
        </div>
        <span
          style={{
            fontFamily: mono,
            fontSize: "11px",
            color: active ? color : T.muted,
            flexShrink: 0,
            marginTop: "1px",
          }}
        >
          {active ? "[ − ]" : "[ + ]"}
        </span>
      </button>

      {active && (
        <div style={{ background: T.surface, paddingBottom: "10px" }}>
          {data.groups.map((group, gi) => (
            <div key={gi} style={{ padding: "12px 18px 4px" }}>
              <Label text={group.name} color={color} />
              {group.items.map((item, ii) => (
                <TokenRow key={ii} {...item} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TokensPage() {
  const [active, setActive] = useState<TokenSectionKey | null>("typography");
  const [showPreview, setShowPreview] = useState(true);

  return (
    <div
      style={{
        background: T.bg,
        color: T.fg,
        padding: "32px 20px",
        maxWidth: "860px",
        margin: "0 auto",
        fontFamily: sans,
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            fontFamily: mono,
            fontSize: "9px",
            letterSpacing: "0.15em",
            color: T.muted,
            textTransform: "uppercase",
            marginBottom: "8px",
          }}
        >
          PORTFOLIO // DESIGN SYSTEM · v0.1 · 2026
        </div>
        <h1
          style={{
            fontFamily: mono,
            fontSize: "clamp(18px, 3vw, 24px)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: T.fg,
            margin: "0 0 6px",
            lineHeight: 1.1,
          }}
        >
          $ cat ./tokens/index.css
        </h1>
        <p style={{ fontFamily: sans, fontSize: "12px", color: T.muted, margin: 0 }}>
          Click any token row to copy its value.
        </p>
      </div>

      {/* Toggle */}
      <div style={{ marginBottom: "16px" }}>
        <button
          onClick={() => setShowPreview((v) => !v)}
          style={{
            fontFamily: mono,
            fontSize: "10px",
            letterSpacing: "0.08em",
            color: T.accent,
            background: "transparent",
            border: `1px solid ${T.accent}`,
            padding: "5px 11px",
            borderRadius: "2px",
            cursor: "pointer",
          }}
        >
          {showPreview ? "[ HIDE PREVIEW ]" : "[ SHOW PREVIEW ]"}
        </button>
      </div>

      {/* Type preview */}
      {showPreview && (
        <div
          style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: "2px",
            padding: "24px 28px",
            marginBottom: "12px",
          }}
        >
          <Label text="TYPE PREVIEW_" color={T.accent} />
          <div
            style={{
              fontFamily: mono,
              fontSize: "9px",
              letterSpacing: "0.15em",
              color: T.muted,
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            STATUS // ACTIVE · ROLE // SR. PRODUCT DESIGNER · 2023
          </div>
          <div
            style={{
              fontFamily: mono,
              fontSize: "clamp(22px, 3.5vw, 32px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: T.fg,
              marginBottom: "12px",
            }}
          >
            01 — Capital One
            <br />
            Decision Engine
          </div>
          <div
            style={{
              fontFamily: sans,
              fontSize: "13.5px",
              color: T.secondary,
              lineHeight: 1.65,
              maxWidth: "500px",
              marginBottom: "18px",
            }}
          >
            Replaced spreadsheet-driven policy workflows with a modular, compliance-ready decision
            engine — enabling non-technical stakeholders to manage complex rule logic without
            engineering support.
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {["DESIGN SYSTEMS", "FINTECH", "COMPLIANCE", "2023"].map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: mono,
                  fontSize: "8px",
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  color: T.muted,
                  border: `1px solid ${T.border}`,
                  padding: "3px 7px",
                  borderRadius: "2px",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Color palette preview */}
      {showPreview && (
        <div
          style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: "2px",
            padding: "18px 22px",
            marginBottom: "20px",
          }}
        >
          <Label text="COLOR PREVIEW_" color={sectionColors.color} />
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-end" }}>
            {[
              {
                label: "DARK (default)",
                row: ["#0D0C0A", "#161410", "#2A2724", "#96928E", "#A09B93", "#F0EDE6"],
              },
              {
                label: "LIGHT",
                row: ["#F2F0EB", "#ECEAE4", "#D4D0C8", "#9E9A91", "#4A4743", "#0F0E0C"],
              },
              { label: "ACCENT", row: ["#0A1F12", "#3DDB84", "#28A05E"] },
            ].map(({ label, row }) => (
              <div key={label}>
                <div
                  style={{
                    fontFamily: mono,
                    fontSize: "8px",
                    color: T.muted,
                    marginBottom: "5px",
                    letterSpacing: "0.1em",
                  }}
                >
                  {label}
                </div>
                <div style={{ display: "flex" }}>
                  {row.map((c, i) => (
                    <div
                      key={i}
                      title={c}
                      style={{
                        width: "32px",
                        height: "32px",
                        background: c,
                        border: "1px solid rgba(255,255,255,0.07)",
                        borderRight:
                          i < row.length - 1
                            ? "none"
                            : "1px solid rgba(255,255,255,0.07)",
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Token sections */}
      <div
        style={{
          border: `1px solid ${T.border}`,
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        {(Object.entries(tokenCatalog) as [TokenSectionKey, TokenSection][]).map(([key, data]) => (
          <Section
            key={key}
            sectionKey={key}
            data={data}
            active={active === key}
            onClick={() => setActive(active === key ? null : key)}
          />
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "24px",
          paddingTop: "14px",
          borderTop: `1px solid ${T.border}`,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <span style={{ fontFamily: mono, fontSize: "10px", color: T.muted }}>
          river@portfolio ~ % <span style={{ color: T.accent }}>▋</span>
        </span>
        <span style={{ fontFamily: mono, fontSize: "10px", color: T.muted }}>
          Next.js · Tailwind · CSS Custom Properties
        </span>
      </div>
    </div>
  );
}
