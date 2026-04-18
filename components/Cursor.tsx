"use client";
import { useEffect, useState } from "react";
import { T } from "@/lib/tokens";

export default function Cursor({ visible = true }: { visible?: boolean }) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setOn((v) => !v), 530);
    return () => clearInterval(t);
  }, []);
  if (!visible) return null;
  return (
    <span style={{ color: T.accent, opacity: on ? 1 : 0, transition: "opacity 80ms" }}>▋</span>
  );
}
