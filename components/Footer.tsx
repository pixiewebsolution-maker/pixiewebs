import HalftoneWordmark from "@/components/HalftoneWordmark"
import Logo from "@/components/Logo"
import styles from "./Footer.module.css"

/*
 * Contact details for the Contact column. Left empty until they're confirmed;
 * an empty one isn't shown, and the column falls back to the Let's Talk link.
 */
const EMAIL: string = ""
const PHONE: string = ""

const COLUMNS = [
    {
        title: "Explore",
        links: [
            { label: "Home", href: "/#home" },
            { label: "Services", href: "/#services" },
            { label: "Why Us", href: "/#why" },
            { label: "Our Works", href: "/#work" },
        ],
    },
    {
        title: "Studio",
        links: [
            { label: "Testimonials", href: "/#testimonials" },
            { label: "FAQs", href: "/#faq" },
            { label: "Start a Project", href: "/contact" },
        ],
    },
]

/**
 * The footer, in the dark band: the studio line and three tracked link
 * columns, a back-to-top link, and under them an enormous PIXIE WEBS
 * wordmark in halftone dots, cropped by the bottom edge, that parts around
 * the pointer. A faint print grain lies over it all.
 */
export default function Footer() {
    const year = new Date().getFullYear()
    return (
        <footer className={styles.footer}>
            <div className={styles.top}>
                <div className={styles.brand}>
                    {/* the same lockup as the hero's top left, in white */}
                    <a href="/#home" className={styles.lockup} aria-label="Pixie Webs home">
                        <Logo tone="light" className={styles.logo} />
                        <span aria-hidden="true" className={styles.divider} />
                        <span className={styles.name}>PIXIE WEBS</span>
                    </a>
                    <p className={styles.tagline}>Websites, business systems and mobile apps that move businesses forward.</p>
                    <p className={styles.copy}>&copy; {year} Pixie Webs. All rights reserved.</p>
                </div>

                {COLUMNS.map((col) => (
                    <nav key={col.title} className={styles.col} aria-label={col.title}>
                        <p className={styles.heading}>{col.title}</p>
                        <ul>
                            {col.links.map((l) => (
                                <li key={l.label}>
                                    <a href={l.href} className={styles.link}>
                                        {l.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                ))}

                <div className={styles.col}>
                    <p className={styles.heading}>Contact</p>
                    <ul>
                        {EMAIL && (
                            <li>
                                <a href={`mailto:${EMAIL}`} className={styles.link}>
                                    {EMAIL}
                                </a>
                            </li>
                        )}
                        {PHONE && (
                            <li>
                                <a href={`tel:${PHONE.replace(/\s/g, "")}`} className={styles.link}>
                                    {PHONE}
                                </a>
                            </li>
                        )}
                        <li>
                            <a href="/contact" className={styles.link}>
                                Let&rsquo;s Talk
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className={styles.rule}>
                <div className={styles.ruleInner}>
                    <a href="/#home" className={styles.link}>
                        Back to top
                        <span className={styles.up} aria-hidden="true">
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M8 13V3M4 7l4-4 4 4" />
                            </svg>
                        </span>
                    </a>
                </div>
            </div>

            <HalftoneWordmark word="pixie webs" className={styles.wordmark} />
        </footer>
    )
}
