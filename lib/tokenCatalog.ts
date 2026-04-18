// Display data for /tokens viewer. Hex values here are literal (for swatches),
// not references to the CSS variables — this is documentation, not runtime tokens.

export type TokenItem = {
  token: string;
  value: string;
  note?: string;
  swatch?: string;
};

export type TokenGroup = {
  name: string;
  items: TokenItem[];
};

export type TokenSection = {
  label: string;
  description: string;
  groups: TokenGroup[];
};

export type TokenSectionKey =
  | "typography"
  | "color"
  | "spacing"
  | "layout"
  | "motion"
  | "surface";

export const sectionColors: Record<TokenSectionKey, string> = {
  typography: "#3DDB84",
  color: "#5B7FC4",
  spacing: "#4A9A60",
  layout: "#9A6AC8",
  motion: "#C89A3A",
  surface: "#4A9AAA",
};

export const tokenCatalog: Record<TokenSectionKey, TokenSection> = {
  typography: {
    label: "TYPOGRAPHY_",
    description:
      "Monospace-first type system. Mono carries the structural load; sans is the guest.",
    groups: [
      {
        name: "Font Families",
        items: [
          { token: "--font-mono", value: "'JetBrains Mono', 'IBM Plex Mono', monospace", note: "Primary — UI, labels, nav" },
          { token: "--font-sans", value: "'Instrument Sans', 'DM Sans', system-ui", note: "Secondary — body copy, prose" },
          { token: "--font-display", value: "'JetBrains Mono', monospace", note: "Hero text — tracked out" },
        ],
      },
      {
        name: "Scale (Major Second — 1.125x)",
        items: [
          { token: "--text-2xs", value: "0.64rem / 10.2px", note: "Metadata, timestamps, tags" },
          { token: "--text-xs", value: "0.72rem / 11.5px", note: "Section labels (ALL CAPS)" },
          { token: "--text-sm", value: "0.875rem / 14px", note: "Nav, captions, secondary UI" },
          { token: "--text-base", value: "1rem / 16px", note: "Body text baseline" },
          { token: "--text-md", value: "1.125rem / 18px", note: "Lead text, callouts" },
          { token: "--text-lg", value: "1.266rem / 20.3px", note: "Sub-headings, card titles" },
          { token: "--text-xl", value: "1.424rem / 22.8px", note: "Section headings" },
          { token: "--text-2xl", value: "1.602rem / 25.6px", note: "Page headings" },
          { token: "--text-3xl", value: "2.027rem / 32.4px", note: "Case study titles" },
          { token: "--text-4xl", value: "2.566rem / 41px", note: "Hero headline" },
          { token: "--text-5xl", value: "3.247rem / 52px", note: "Display / splash only" },
        ],
      },
      {
        name: "Weight & Leading",
        items: [
          { token: "--weight-regular", value: "400", note: "Body, nav items" },
          { token: "--weight-medium", value: "500", note: "Labels, metadata" },
          { token: "--weight-semibold", value: "600", note: "Headings" },
          { token: "--weight-bold", value: "700", note: "Display, emphasis" },
          { token: "--leading-tight", value: "1.1", note: "Display, hero text" },
          { token: "--leading-snug", value: "1.3", note: "Headings" },
          { token: "--leading-normal", value: "1.5", note: "Body text" },
          { token: "--leading-relaxed", value: "1.7", note: "Long-form prose" },
          { token: "--tracking-tight", value: "-0.02em", note: "Large display text" },
          { token: "--tracking-normal", value: "0em", note: "Body" },
          { token: "--tracking-wide", value: "0.08em", note: "Section labels (CAPS)" },
          { token: "--tracking-widest", value: "0.15em", note: "Status badges, tags" },
        ],
      },
    ],
  },
  color: {
    label: "COLOR_",
    description:
      "Near-monochrome base with one precise signal color. The accent should feel like a cursor blink.",
    groups: [
      {
        name: "Base — Dark Mode (default)",
        items: [
          { token: "--color-bg", value: "#0D0C0A", swatch: "#0D0C0A", note: "Page background — warm near-black" },
          { token: "--color-surface", value: "#161410", swatch: "#161410", note: "Cards, panels" },
          { token: "--color-surface-2", value: "#1E1C18", swatch: "#1E1C18", note: "Nested surfaces, code chips" },
          { token: "--color-border", value: "#2A2724", swatch: "#2A2724", note: "Lines, dividers" },
          { token: "--color-muted", value: "#96928E", swatch: "#96928E", note: "Timestamps, metadata" },
          { token: "--color-secondary", value: "#A09B93", swatch: "#A09B93", note: "Secondary text" },
          { token: "--color-fg", value: "#F0EDE6", swatch: "#F0EDE6", note: "Primary text — warm off-white" },
        ],
      },
      {
        name: "Base — Light Mode",
        items: [
          { token: "--color-bg", value: "#F2F0EB", swatch: "#F2F0EB", note: "Warm off-white, not sterile" },
          { token: "--color-surface", value: "#ECEAE4", swatch: "#ECEAE4", note: "Cards, panels" },
          { token: "--color-border", value: "#D4D0C8", swatch: "#D4D0C8", note: "Dividers" },
          { token: "--color-muted", value: "#9E9A91", swatch: "#9E9A91", note: "Metadata" },
          { token: "--color-secondary", value: "#4A4743", swatch: "#4A4743", note: "Secondary text" },
          { token: "--color-fg", value: "#0F0E0C", swatch: "#0F0E0C", note: "Primary text" },
        ],
      },
      {
        name: "Accent — Signal Color",
        items: [
          { token: "--color-accent", value: "#3DDB84", swatch: "#3DDB84", note: "The one color — links, cursor, active states" },
          { token: "--color-accent-subtle", value: "#0A1F12", swatch: "#0A1F12", note: "Accent backgrounds (dark mode)" },
          { token: "--color-accent-muted", value: "#28A05E", swatch: "#28A05E", note: "Pressed / active variant" },
        ],
      },
    ],
  },
  spacing: {
    label: "SPACING_",
    description:
      "8px base grid. All spacing is a multiple of 4px. Rhythm is structural.",
    groups: [
      {
        name: "Scale",
        items: [
          { token: "--space-1", value: "4px", note: "Micro — icon gaps" },
          { token: "--space-2", value: "8px", note: "XS — label padding" },
          { token: "--space-3", value: "12px", note: "SM — nav item padding" },
          { token: "--space-4", value: "16px", note: "Base — standard gap" },
          { token: "--space-6", value: "24px", note: "MD — card padding" },
          { token: "--space-8", value: "32px", note: "LG — component separation" },
          { token: "--space-12", value: "48px", note: "XL — section breaks" },
          { token: "--space-16", value: "64px", note: "2XL — major section spacing" },
          { token: "--space-20", value: "80px", note: "3XL — hero padding" },
          { token: "--space-24", value: "96px", note: "4XL — page-level breathing" },
          { token: "--space-32", value: "128px", note: "Max section padding" },
        ],
      },
    ],
  },
  layout: {
    label: "LAYOUT_",
    description:
      "Single max-width constraint. Wide gutters. Content never touches the edge.",
    groups: [
      {
        name: "Grid & Containers",
        items: [
          { token: "--container-prose", value: "680px", note: "Case study body text" },
          { token: "--container-content", value: "960px", note: "Default content width" },
          { token: "--container-wide", value: "1280px", note: "Full-bleed sections" },
          { token: "--gutter", value: "clamp(24px,5vw,80px)", note: "Responsive page margin" },
          { token: "--col-gap", value: "24px", note: "Grid column gap" },
          { token: "--row-gap", value: "48px", note: "Grid row gap" },
        ],
      },
    ],
  },
  motion: {
    label: "MOTION_",
    description:
      "Fast in, slow out. Animation is data — it communicates state, not decoration.",
    groups: [
      {
        name: "Duration",
        items: [
          { token: "--duration-instant", value: "80ms", note: "Focus rings, immediate feedback" },
          { token: "--duration-fast", value: "150ms", note: "Hover states, toggles" },
          { token: "--duration-base", value: "250ms", note: "Most transitions" },
          { token: "--duration-slow", value: "400ms", note: "Page elements, reveals" },
          { token: "--duration-slower", value: "600ms", note: "Hero, splash sequences" },
        ],
      },
      {
        name: "Easing",
        items: [
          { token: "--ease-out", value: "cubic-bezier(0.0, 0.0, 0.2, 1.0)", note: "Elements entering" },
          { token: "--ease-in", value: "cubic-bezier(0.4, 0.0, 1.0, 1.0)", note: "Elements leaving" },
          { token: "--ease-in-out", value: "cubic-bezier(0.4, 0.0, 0.2, 1.0)", note: "Repositioning" },
          { token: "--ease-spring", value: "cubic-bezier(0.34, 1.56, 0.64, 1.0)", note: "Playful — use rarely" },
        ],
      },
    ],
  },
  surface: {
    label: "SURFACE_",
    description: "Borders over shadows. Depth through contrast, not elevation.",
    groups: [
      {
        name: "Radius",
        items: [
          { token: "--radius-none", value: "0px", note: "Default — terminal aesthetic is sharp" },
          { token: "--radius-sm", value: "2px", note: "Tags, badges" },
          { token: "--radius-md", value: "4px", note: "Buttons, inputs — subtle only" },
          { token: "--radius-lg", value: "8px", note: "Cards — used sparingly" },
        ],
      },
      {
        name: "Border & Shadow",
        items: [
          { token: "--border-width", value: "1px", note: "Default stroke weight" },
          { token: "--border-width-2", value: "2px", note: "Active / focus states" },
          { token: "--shadow-none", value: "none", note: "Preferred — use borders instead" },
          { token: "--shadow-sm", value: "0 1px 3px rgba(0,0,0,0.3)", note: "Floating elements only" },
          { token: "--shadow-md", value: "0 4px 12px rgba(0,0,0,0.4)", note: "Modals, popovers" },
        ],
      },
    ],
  },
};
