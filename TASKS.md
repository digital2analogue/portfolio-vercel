# Portfolio Site — Follow-up Tasks

## Design Tokens

- [ ] **Spacing scale audit** — The current semantic spacing names (`micro`, `element`, `group`, `block`, `page`) don't align with industry conventions and the distinction between `element` vs `component` is fuzzy. Audit the full scale, consider splitting into two families (component spacing vs layout rhythm), and reduce step count to 6–8. Start in `brand-tokens`, propagate to `portfolio-vercel` and `decisioning-table`.

## Work Page

- [ ] **Work row UX (#1 from design critique)** — Resolve whether `.work-row` elements are navigation links or accordions. CSS has `work-row[aria-expanded="true"]` hooks suggesting accordion was originally intended. Decide on one pattern and remove the other.
