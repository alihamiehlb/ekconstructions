import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { legalLinks, legalUpdated } from "@/content/legal";
import Link from "next/link";

type Props = {
  title: string;
  summary?: string;
  children: React.ReactNode;
};

export function LegalLayout({ title, summary, children }: Props) {
  return (
    <>
      <Header />
      <main className="bg-white pt-[68px] lg:pt-[74px]">
        <div className="landing-container py-10 sm:py-12 md:py-14">
          <nav aria-label="Breadcrumb" className="text-xs font-semibold tracking-wide text-ek-muted uppercase">
            <Link href="/" className="text-ek-teal hover:underline">
              Home
            </Link>
            <span className="mx-2 text-ek-navy/30">/</span>
            <span className="text-ek-navy/70">{title}</span>
          </nav>

          <header className="mt-5 max-w-3xl border-b border-ek-navy/8 pb-6">
            <h1 className="text-2xl font-black tracking-tight text-ek-navy uppercase sm:text-3xl">
              {title}
            </h1>
            {summary && (
              <p className="mt-3 text-sm leading-relaxed text-ek-muted sm:text-base">{summary}</p>
            )}
            <p className="mt-3 text-xs text-ek-muted">Last updated: {legalUpdated}</p>
          </header>

          <article className="legal-prose mt-8 max-w-3xl">{children}</article>

          <aside className="mt-12 max-w-3xl rounded-xl border border-ek-navy/8 bg-ek-gray/50 p-5 sm:p-6">
            <p className="text-xs font-semibold tracking-[0.2em] text-ek-teal uppercase">
              Related policies
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex rounded-full border border-ek-navy/10 bg-white px-3 py-1.5 text-[11px] font-semibold tracking-wide text-ek-navy uppercase transition hover:border-ek-teal hover:text-ek-teal"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="legal-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
