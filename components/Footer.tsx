import Link from "next/link";

export default function Footer() {
  return (
    <footer className="sign">
      <span>
        river@portfolio ~ %{" "}
        <span className="cursor cursor--sm" aria-hidden="true" />
      </span>
      <Link href="/contact">
        river@email.com<span aria-hidden="true"> →</span>
      </Link>
    </footer>
  );
}
