import type { ReactNode } from "react"
import Logo from "@/components/Logo"
import styles from "./LegalPage.module.css"

export type LegalSection = { heading: string; body: ReactNode }

/** "How we use it" → "how-we-use-it", for each section's link */
const slug = (s: string) =>
    s
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")

/**
 * A legal page (Privacy Policy, Terms & Conditions) in the site's dark band:
 * the logo lockup, a two-tone title with the date it took effect, the
 * numbered sections in one readable column on the right, and on wide screens
 * a contents list on the left that stays in view. Linked only from the footer.
 */
export default function LegalPage({
    title,
    em,
    updated,
    intro,
    sections,
}: {
    title: string
    em: string
    updated: string
    intro: ReactNode
    sections: LegalSection[]
}) {
    return (
        <main className={styles.page}>
            <a href="/" className={styles.lockup} aria-label="Pixie Webs home">
                <Logo tone="light" className={styles.logo} />
                <span aria-hidden="true" className={styles.divider} />
                <span className={styles.brand}>PIXIE WEBS</span>
            </a>

            <header className={styles.hero}>
                <p className={styles.tag}>Legal</p>
                <h1 className={styles.title}>
                    <span>{title}</span>
                    <em>{em}</em>
                </h1>
                <p className={styles.updated}>Last updated: {updated}</p>
            </header>

            <div className={styles.rule} />

            <div className={styles.layout}>
                {/* the contents, kept in view on the left, the text to its right */}
                <nav className={styles.toc} aria-label="On this page">
                    <p className={styles.tocTitle}>On this page</p>
                    <ol>
                        {sections.map((s, i) => (
                            <li key={s.heading}>
                                <a href={`#${slug(s.heading)}`} className={styles.tocLink}>
                                    <span className={styles.tocNum}>{String(i + 1).padStart(2, "0")}</span>
                                    {s.heading}
                                </a>
                            </li>
                        ))}
                    </ol>
                </nav>

                <article className={styles.body}>
                    <div className={styles.intro}>{intro}</div>
                    {sections.map((s, i) => (
                        <section key={s.heading} id={slug(s.heading)} className={styles.section}>
                            <h2 className={styles.heading}>
                                <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                                {s.heading}
                            </h2>
                            <div className={styles.text}>{s.body}</div>
                        </section>
                    ))}
                </article>
            </div>
        </main>
    )
}
