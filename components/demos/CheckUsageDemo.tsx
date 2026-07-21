"use client";

/**
 * CheckUsageDemo — a live, in-page port of Parsimony's `check_usage` MCP tool,
 * embedded in the /work/system case study. Paste (or edit) a snippet on the
 * left; the right panel lists every rule violation as you type — the same
 * static rules the build gate and drift scan enforce (see lib/checkUsageRules).
 *
 * This is the case's "governance, moved upstream" argument made interactive:
 * the reader catches the hardcoded hex, the primitive reference, the hardcoded
 * type before it ships, exactly as an agent would before writing the code.
 *
 * Dark-system surface (native to the site, not an OTKit light demo). The
 * textarea is natively keyboard-operable; the result count announces via
 * aria-live.
 */

import { useMemo, useState } from "react";
import {
  lintSnippet,
  SAMPLE_VIOLATIONS,
  SAMPLE_CLEAN,
  type Violation,
} from "@/lib/checkUsageRules";

const RULE_LABEL: Record<string, string> = {
  "no-hex": "no-hex",
  "no-primitive": "no-primitive",
  "font-size": "hardcoded-size",
  "font-weight": "hardcoded-weight",
  "font-family": "font-family",
};

export default function CheckUsageDemo() {
  const [code, setCode] = useState<string>(SAMPLE_VIOLATIONS);
  const violations = useMemo<Violation[]>(() => lintSnippet(code), [code]);
  const clean = violations.length === 0;
  // Lines that carry at least one violation, for the editor gutter marks.
  const badLines = useMemo(() => new Set(violations.map((v) => v.line)), [violations]);
  const lineCount = code.split("\n").length;

  return (
    <div className="cu">
      <div className="cu__toolbar">
        <span className="cu__title">check_usage</span>
        <span className="cu__playground-tag">playground — edit the CSS below</span>
        <span className="cu__toolbar-spacer" />
        <button
          type="button"
          className="cu__preset"
          onClick={() => setCode(SAMPLE_VIOLATIONS)}
          aria-pressed={code === SAMPLE_VIOLATIONS}
        >
          Messy
        </button>
        <button
          type="button"
          className="cu__preset"
          onClick={() => setCode(SAMPLE_CLEAN)}
          aria-pressed={code === SAMPLE_CLEAN}
        >
          Compliant
        </button>
      </div>

      <div className="cu__grid">
        {/* ── Input ── */}
        <div className="cu__panel">
          <div className="cu__panel-label" aria-hidden="true">Agent-proposed CSS</div>
          <div className="cu__editor">
            <div className="cu__gutter" aria-hidden="true">
              {Array.from({ length: lineCount }, (_, i) => (
                <span key={i} data-bad={badLines.has(i + 1)}>{i + 1}</span>
              ))}
            </div>
            <textarea
              className="cu__code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              rows={lineCount}
              aria-label="CSS snippet to check against the design-system rules"
            />
          </div>
        </div>

        {/* ── Output ── */}
        <div className="cu__panel">
          <div className="cu__panel-label" aria-hidden="true">Rule check</div>
          <div className="cu__out" data-clean={clean}>
            <div className="cu__verdict" role="status" aria-live="polite">
              {clean ? (
                <>
                  <span className="cu__verdict-mark" aria-hidden="true">✓</span>
                  Compliant — 0 violations
                </>
              ) : (
                <>
                  <span className="cu__verdict-mark cu__verdict-mark--bad" aria-hidden="true">▲</span>
                  {violations.length} violation{violations.length === 1 ? "" : "s"}
                </>
              )}
            </div>

            {!clean && (
              <ul className="cu__list">
                {violations.map((v, i) => (
                  <li key={i} className="cu__item">
                    <span className="cu__loc">Ln&nbsp;{v.line}:{v.col}</span>
                    <span className="cu__rule">{RULE_LABEL[v.rule] ?? v.rule}</span>
                    <span className="cu__msg">{v.message}</span>
                  </li>
                ))}
              </ul>
            )}

            {clean && (
              <p className="cu__hint">
                Every value traces to a semantic token. This is what the build gate
                and drift scan let through.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
