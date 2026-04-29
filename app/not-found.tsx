import Link from "next/link";

export default function NotFound() {
  return (
    <div className="column">
      <section className="hero">
        <span className="marginalia" aria-hidden="true">
          §&nbsp;<span className="accent">00</span>&nbsp;/&nbsp;NOT FOUND
        </span>

        <div className="hero__term rise d1">
          <div>
            <span className="accent" aria-hidden="true">~</span> $ cat ./404.md
          </div>
          <div>
            <span className="hero__term-slash" aria-hidden="true">// </span>
            <span className="hero__term-ans">No such file or directory</span>
          </div>
        </div>

        <h1 className="display rise d2">
          404 — <em>lost route.</em>
        </h1>

        <p className="lede rise d3">
          This page doesn&apos;t exist. The path you followed might be broken,
          moved, or never was.
        </p>

        <div className="rise d4" style={{ marginTop: "var(--primitive-space-xl)" }}>
          <Link
            href="/"
            className="accent"
            style={{ fontFamily: "var(--primitive-font-family-mono)", fontSize: "var(--primitive-font-size-sm)" }}
          >
            ← cd ~/
          </Link>
        </div>
      </section>
    </div>
  );
}
