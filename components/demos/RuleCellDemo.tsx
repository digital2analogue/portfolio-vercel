"use client";

/**
 * RuleCellDemo — the Decision Engine's rule cell as a live component instead
 * of a static component sheet. Every part of the row is interactive: the
 * data-attribute badge and operator chip open WAI-ARIA listboxes, the value
 * is an editable input, and the outcome is the same sliding Approve/Deny
 * segment as the standalone outcome demo. The row also demonstrates its own
 * states — hover tints it, the checkbox selects it — and a live sentence
 * below reads back the rule the cell currently encodes (aria-live, so the
 * composition is announced as it changes).
 *
 * The decision-engine is a LIGHT (arctic) sub-brand, so the card scopes the
 * arctic palette locally (`.rcd` in globals.css, same values as the outcome
 * demo's device card) rather than using the dark portfolio tokens. All
 * transition motion is CSS-gated behind prefers-reduced-motion.
 */

import { useEffect, useId, useRef, useState } from "react";

type AttributeKey = "Income" | "Expense" | "Asset" | "Liability";
type OperatorKey = ">" | "≥" | "<" | "≤" | "=";
type Outcome = "Approve" | "Deny";

const ATTRIBUTES: Array<{ key: AttributeKey; tone: string }> = [
  { key: "Income", tone: "blue" },
  { key: "Expense", tone: "red" },
  { key: "Asset", tone: "gray" },
  { key: "Liability", tone: "outline" },
];

const OPERATORS: Array<{ key: OperatorKey; phrase: string }> = [
  { key: ">", phrase: "is greater than" },
  { key: "≥", phrase: "is at least" },
  { key: "<", phrase: "is less than" },
  { key: "≤", phrase: "is at most" },
  { key: "=", phrase: "equals" },
];

function formatValue(digits: string): string {
  if (!digits) return "$0";
  return "$" + Number(digits).toLocaleString("en-US");
}

/**
 * Small popup listbox picker: trigger button + keyboard-operable option list.
 * Mirrors the ARIA pattern used by ReservationStatusDemo (aria-haspopup,
 * aria-expanded, aria-activedescendant, arrows/Home/End/Enter/Escape,
 * click-away close, focus returns to the trigger).
 */
function PickerButton<T extends string>({
  label,
  value,
  options,
  optionLabel,
  onChange,
  triggerClass,
}: {
  label: string;
  value: T;
  options: T[];
  optionLabel: (v: T) => string;
  onChange: (v: T) => void;
  triggerClass: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", away);
    return () => document.removeEventListener("mousedown", away);
  }, [open]);

  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  const openList = () => {
    setActive(Math.max(0, options.indexOf(value)));
    setOpen(true);
  };

  const commit = (v: T) => {
    onChange(v);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(options.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      commit(options[active]);
    } else if (e.key === "Escape" || e.key === "Tab") {
      e.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    }
  };

  return (
    <div className="rcd-picker" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className={triggerClass}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${optionLabel(value)}`}
        onClick={() => (open ? setOpen(false) : openList())}
      >
        {optionLabel(value)}
        <svg className="rcd-caret" width="8" height="5" viewBox="0 0 8 5" fill="none" aria-hidden="true">
          <path d="M1 1l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul
          ref={listRef}
          className="rcd-listbox"
          role="listbox"
          aria-label={label}
          tabIndex={-1}
          aria-activedescendant={`${id}-${active}`}
          onKeyDown={onListKeyDown}
        >
          {options.map((opt, i) => (
            <li
              key={opt}
              id={`${id}-${i}`}
              role="option"
              aria-selected={opt === value}
              className={`rcd-option${i === active ? " is-active" : ""}`}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => {
                e.preventDefault();
                commit(opt);
              }}
            >
              {optionLabel(opt)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function RuleCellDemo() {
  const [attribute, setAttribute] = useState<AttributeKey>("Income");
  const [operator, setOperator] = useState<OperatorKey>(">");
  const [digits, setDigits] = useState("50000");
  const [outcome, setOutcome] = useState<Outcome>("Approve");
  const [selected, setSelected] = useState(false);
  const checkboxId = useId();

  const tone = ATTRIBUTES.find((a) => a.key === attribute)?.tone ?? "blue";
  const phrase = OPERATORS.find((o) => o.key === operator)?.phrase ?? "";

  return (
    <div className="rcd">
      <div className="rcd-title">Decision Model · Rule cell</div>

      <div className={`rcd-row${selected ? " is-selected" : ""}`}>
        <input
          id={checkboxId}
          type="checkbox"
          className="rcd-check"
          checked={selected}
          onChange={(e) => setSelected(e.target.checked)}
          aria-label="Select rule Income check"
        />
        <span className="rcd-num" aria-hidden="true">1</span>
        <span className="rcd-name">Income check</span>

        <PickerButton
          label="Data attribute"
          value={attribute}
          options={ATTRIBUTES.map((a) => a.key)}
          optionLabel={(v) => v}
          onChange={setAttribute}
          triggerClass={`rcd-badge rcd-badge--${tone}`}
        />

        <PickerButton
          label="Operator"
          value={operator}
          options={OPERATORS.map((o) => o.key)}
          optionLabel={(v) => v}
          onChange={setOperator}
          triggerClass="rcd-op"
        />

        <label className="rcd-value">
          <span className="rcd-value-prefix" aria-hidden="true">$</span>
          <input
            type="text"
            inputMode="numeric"
            value={digits === "" ? "" : Number(digits).toLocaleString("en-US")}
            onChange={(e) => setDigits(e.target.value.replace(/\D/g, "").slice(0, 9))}
            aria-label="Threshold value in dollars"
          />
        </label>

        <div
          className="rcd-seg"
          data-value={outcome}
          role="radiogroup"
          aria-label="Outcome for Income check"
        >
          <span
            className={`rcd-seg-indicator${outcome === "Deny" ? " rcd-seg-indicator--right" : ""}`}
            aria-hidden="true"
          />
          <button
            type="button"
            role="radio"
            aria-checked={outcome === "Approve"}
            onClick={() => setOutcome("Approve")}
            className={`rcd-seg-btn${outcome === "Approve" ? " is-approve" : ""}`}
          >
            Approve
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={outcome === "Deny"}
            onClick={() => setOutcome("Deny")}
            className={`rcd-seg-btn${outcome === "Deny" ? " is-deny" : ""}`}
          >
            Deny
          </button>
        </div>
      </div>

      <p className="rcd-sentence" aria-live="polite">
        Reads as: If <strong>{attribute}</strong> {phrase}{" "}
        <strong>{formatValue(digits)}</strong> →{" "}
        <strong className={outcome === "Approve" ? "rcd-sentence-approve" : "rcd-sentence-deny"}>
          {outcome}
        </strong>
      </p>

      <p className="rcd-hint">
        Every part is live: swap the attribute, pick an operator, edit the
        value, flip the outcome. Hover the row or tick the checkbox for its
        hover and selected states.
      </p>
    </div>
  );
}
