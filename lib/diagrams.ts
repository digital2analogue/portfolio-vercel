import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Block } from "@/lib/caseContent";

/**
 * Server-only: inline the hand-authored diagram SVG sources into diagram
 * blocks at render time. The case-study diagrams live as .svg files in
 * public/projects/images (see CLAUDE.md "Case-Study Diagrams"); inlining the
 * markup lets DiagramBlock animate the actual nodes (draw-on connectors,
 * staged card entrances) instead of shipping a flattened PNG.
 *
 * The root <svg> tag is made responsive (fixed width/height stripped —
 * viewBox drives scaling) and labeled for assistive tech. A missing file
 * fails the build loudly, matching lib/tokenValues.ts's philosophy.
 */
export function inlineDiagrams(blocks: Block[]): Block[] {
  return blocks.map((b) => {
    if (b.type !== "diagram") return b;
    const raw = readFileSync(join(process.cwd(), "public", b.src), "utf8");
    const svg = raw.replace(/<svg([^>]*)>/, (_, attrs: string) => {
      const cleaned = attrs
        .replace(/\s(width|height)="[^"]*"/g, "")
        .trim();
      return `<svg ${cleaned} role="img" aria-label="${escapeAttr(b.alt)}">`;
    });
    return { ...b, svg };
  });
}

function escapeAttr(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
