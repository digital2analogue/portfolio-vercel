import { T, mono, sans } from "@/lib/tokens";
import Tag from "@/components/Tag";

const SKILLS = [
  "Design Systems",
  "B2B / Enterprise UX",
  "Compliance UX",
  "Decision Tooling",
  "Figma",
  "Research",
  "Prototyping",
  "Cross-functional Leadership",
];

const EXPERIENCE = [
  { role: "Principal Designer", company: "Capital One", period: "2021 – Present" },
  { role: "Principal Designer", company: "OpenTable", period: "2019 – 2021" },
];

const SIDEBAR = [
  { label: "STATUS", value: "Open to work" },
  { label: "TYPE", value: "Senior IC / Staff" },
  { label: "MODE", value: "Remote" },
  { label: "TIMEZONE", value: "US" },
];

export default function AboutPage() {
  return (
    <div
      style={{
        padding: "clamp(32px,6vh,64px) clamp(20px,5vw,64px)",
        maxWidth: "800px",
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
          $ cat ./about.md
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
          River
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: "48px" }}>
        <div>
          <p
            style={{
              fontFamily: sans,
              fontSize: "15px",
              color: T.secondary,
              lineHeight: 1.75,
              marginBottom: "20px",
              marginTop: 0,
            }}
          >
            I&apos;m a senior product designer specializing in complex B2B systems — decision
            tooling, compliance surfaces, and the design infrastructure that makes large teams move
            fast without breaking things.
          </p>
          <p
            style={{
              fontFamily: sans,
              fontSize: "15px",
              color: T.secondary,
              lineHeight: 1.75,
              marginBottom: "20px",
            }}
          >
            My work lives at the intersection of policy, data, and enterprise UX. I care about
            making the invisible legible — surfacing the rules, states, and edge cases that
            software usually buries.
          </p>
          <p
            style={{
              fontFamily: sans,
              fontSize: "15px",
              color: T.secondary,
              lineHeight: 1.75,
              marginBottom: "32px",
            }}
          >
            I bring a systems-first mindset to every project: I&apos;m as comfortable in a Figma
            component library as I am co-authoring a product brief or running a research sprint.
          </p>

          <div style={{ marginBottom: "32px" }}>
            <div
              style={{
                fontFamily: mono,
                fontSize: "11px",
                letterSpacing: "0.12em",
                color: T.muted,
                marginBottom: "12px",
              }}
            >
              CURRENTLY STRONG IN //
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {SKILLS.map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </div>
          </div>

          <div
            style={{
              fontFamily: mono,
              fontSize: "11px",
              letterSpacing: "0.12em",
              color: T.muted,
              marginBottom: "12px",
            }}
          >
            EXPERIENCE //
          </div>
          {EXPERIENCE.map((e) => (
            <div
              key={e.company + e.period}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: `1px solid ${T.border}`,
              }}
            >
              <div>
                <div style={{ fontFamily: mono, fontSize: "12px", color: T.fg, fontWeight: 600 }}>
                  {e.role}
                </div>
                <div style={{ fontFamily: mono, fontSize: "10px", color: T.muted }}>
                  {e.company}
                </div>
              </div>
              <div style={{ fontFamily: mono, fontSize: "10px", color: T.muted }}>{e.period}</div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div>
          <div
            style={{
              width: "100%",
              aspectRatio: "1",
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: "2px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <div style={{ fontFamily: mono, fontSize: "24px", color: T.accent }}>R</div>
            <div
              style={{
                fontFamily: mono,
                fontSize: "11px",
                color: T.muted,
                letterSpacing: "0.08em",
              }}
            >
              PHOTO //
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {SIDEBAR.map(({ label, value }) => (
              <div key={label}>
                <div
                  style={{
                    fontFamily: mono,
                    fontSize: "11px",
                    letterSpacing: "0.12em",
                    color: T.muted,
                    marginBottom: "2px",
                  }}
                >
                  {label} //
                </div>
                <div style={{ fontFamily: mono, fontSize: "11px", color: T.fg }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
