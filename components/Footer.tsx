import type { ReactNode } from "react"
import { FaInstagram, FaLinkedinIn, FaThreads } from "react-icons/fa6"
import HalftoneWordmark from "@/components/HalftoneWordmark"
import Logo from "@/components/Logo"
import { EMAIL, PHONES, SOCIALS, whatsappLink } from "@/lib/contact"
import styles from "./Footer.module.css"

/** the legal pages: linked only from here, not from the main menu */
const LEGAL = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
]

/** the official brand marks for the social links (Font Awesome brands, via react-icons) */
const SOCIAL_ICONS: Record<string, ReactNode> = {
    Instagram: <FaInstagram aria-hidden="true" />,
    LinkedIn: <FaLinkedinIn aria-hidden="true" />,
    Threads: <FaThreads aria-hidden="true" />,
}

const COLUMNS = [
    {
        title: "Explore",
        links: [
            { label: "Home", href: "/#home" },
            { label: "Services", href: "/#services" },
            { label: "Why Us", href: "/#why" },
            { label: "Our Works", href: "/work" },
            { label: "About", href: "/about" },
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
                    <ul className={styles.socials} aria-label="Pixie Webs on social media">
                        {SOCIALS.map((s) => (
                            <li key={s.name}>
                                <a href={s.href} target="_blank" rel="noopener noreferrer" className={styles.social} aria-label={s.name}>
                                    {SOCIAL_ICONS[s.name]}
                                </a>
                            </li>
                        ))}
                    </ul>
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
                        <li>
                            <a href={`mailto:${EMAIL}`} className={styles.link}>
                                {EMAIL}
                            </a>
                        </li>
                        {PHONES.map((p) => (
                            <li key={p.tel}>
                                <a href={`tel:${p.tel}`} className={styles.link}>
                                    {p.display}
                                </a>
                            </li>
                        ))}
                        <li>
                            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={styles.link}>
                                Chat on WhatsApp
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className={styles.rule}>
                <div className={styles.ruleInner}>
                    <nav className={styles.legal} aria-label="Legal">
                        {LEGAL.map((l) => (
                            <a key={l.href} href={l.href} className={styles.legalLink}>
                                {l.label}
                            </a>
                        ))}
                    </nav>
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
