import type { Metadata } from "next"
import SideNav from "@/components/SideNav"
import Logo from "@/components/Logo"
import Footer from "@/components/Footer"
import styles from "./not-found.module.css"

export const metadata: Metadata = {
    title: "Page not found | Pixie Webs",
    robots: { index: false },
}

function Arrow() {
    return (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
        </svg>
    )
}

/** Any address the site doesn't have: a short note in the dark band, and the ways back. */
export default function NotFound() {
    return (
        <>
            <SideNav />
            <main className={styles.page}>
                <a href="/" className={styles.lockup} aria-label="Pixie Webs home">
                    <Logo tone="light" className={styles.logo} />
                    <span aria-hidden="true" className={styles.divider} />
                    <span className={styles.brand}>PIXIE WEBS</span>
                </a>

                <section className={styles.body}>
                    <p className={styles.code}>404</p>
                    <h1 className={styles.title}>
                        <span>This page</span>
                        <em>doesn&rsquo;t exist.</em>
                    </h1>
                    <p className={styles.text}>
                        The link may be old, or the address mistyped. Everything we make is a click away.
                    </p>
                    <div className={styles.actions}>
                        <a href="/" className={styles.pill}>
                            Back to Home
                            <span className={styles.pillIcon}>
                                <Arrow />
                            </span>
                        </a>
                        <a href="/work" className={styles.link}>
                            See our work
                        </a>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
