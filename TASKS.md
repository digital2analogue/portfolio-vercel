# Portfolio Site — Follow-up Tasks

## Design Tokens

- [ ] **Spacing scale audit** — The current semantic spacing names (`micro`, `element`, `group`, `block`, `page`) don't align with industry conventions and the distinction between `element` vs `component` is fuzzy. Audit the full scale, consider splitting into two families (component spacing vs layout rhythm), and reduce step count to 6–8. Start in `brand-tokens`, propagate to `portfolio-vercel` and `decisioning-table`.

## Work Page

- [x] **Work row UX (#1 from design critique)** — Resolved: `.work-row` elements are navigation links. The dead `work-row[aria-expanded="true"]` accordion CSS hooks were removed (they could never match — the rows render as plain `<Link>`s).
