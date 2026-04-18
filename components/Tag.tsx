import { T, mono } from "@/lib/tokens";

export default function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: mono,
        fontSize: "8px",
        fontWeight: 600,
        letterSpacing: "0.14em",
        color: T.muted,
        border: `1px solid ${T.border}`,
        padding: "3px 7px",
        borderRadius: "2px",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}
