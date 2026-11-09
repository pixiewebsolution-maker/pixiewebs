"use client"

import { useRef, type ReactNode } from "react"
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react"
import Logo from "@/components/Logo"
import { whatsappLink } from "@/lib/contact"
import TextGlobe from "./TextGlobe"
import ScrollWords from "./ScrollWords"
import VelocityMarquee from "./VelocityMarquee"
import styles from "./AboutPage.module.css"

const EASE = [0.22, 0.8, 0.24, 1] as const

const GLOBE_WORDS = ["Websites", "E-Commerce", "ERP", "CRM", "Mobile Apps", "SEO", "UI/UX", "Support"]

const STORY =
    "We started Pixie Webs with a simple belief: *technology* should *move* *a* *business* *forward,* not just look good on a screen. So every project starts with how you work and who you serve. From fight gyms and bridal studios to exporters, clinics and shipping agencies, we build websites, stores and systems that bring in customers, save hours every week, and *grow* *with* *you.*"

const MARQUEE = ["Websites", "E-Commerce", "ERP & CRM", "Mobile Apps", "UI/UX Design", "SEO & Support"]

const icon = (children: ReactNode) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {children}
    </svg>
)

const VALUES: { title: string; text: string; icon: ReactNode }[] = [
    {
        title: "Business first",
        text: "We start with your goals, your customers and your numbers, then shape the technology around them.",
        icon: icon(
            <>
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="12" cy="12" r="1.4" fill="currentColor" />
            </>,
        ),
    },
    {
        title: "Made for you",
        text: "No templates. Every site, store and system is built around how your business actually runs.",
        icon: icon(
            <>
                <path d="M12 2.5 20.5 7v10L12 21.5 3.5 17V7z" />
                <path d="M3.5 7 12 11.5 20.5 7M12 11.5v10" />
            </>,
        ),
    },
    {
        title: "Craft in the details",
        text: "Fast pages, clean code and screens people enjoy using, right down to the last pixel.",
        icon: icon(<path d="M12 3l2.6 5.8L21 9.6l-4.8 4.3 1.3 6.3L12 17l-5.5 3.2 1.3-6.3L3 9.6l6.4-.8z" />),
    },
    {
        title: "Here after launch",
        text: "Updates, fixes and new features when you need them, from a team that already knows your product.",
        icon: icon(
            <path d="M3.5 15h2.5a2 2 0 0 1 2 2v2.5a2 2 0 0 1-2 2h-.5a2 2 0 0 1-2-2V12a8.5 8.5 0 0 1 17 0v7.5a2 2 0 0 1-2 2H18a2 2 0 0 1-2-2V17a2 2 0 0 1 2-2h2.5" />,
        ),
    },
]

const STEPS: { title: string; text: string }[] = [
    { title: "Discover", text: "We listen first: your business, your customers, and what success looks like for you." },
    { title: "Plan", text: "A clear scope, timeline and price, so you know exactly what you're getting before we start." },
    { title: "Design", text: "Layouts and visuals shaped around your brand, shared early and refined together with you." },
    { title: "Build", text: "Clean, fast code, tested on every screen, with regular updates on how it's going." },
    { title: "Launch & grow", text: "We go live together, then keep improving it with support, SEO and new features." },
]

function Arrow() {
    return (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
        </svg>
    )
}

/** one line of the heading, rising out of its own mask */
function Line({ children, delay, em }: { children: string; delay: number; em?: boolean }) {
    const Tag = em ? motion.em : motion.span
    return (
        <span className={styles.line}>
            <Tag initial={{ y: "105%" }} animate={{ y: "0%" }} transition={{ duration: 0.9, delay, ease: EASE }}>
                {children}
            </Tag>
        </span>
    )
}

/** a section heading: small capitals, then white over silver */
function Heading({ id, tag, title, em }: { id: string; tag: string; title: string; em: string }) {
    return (
        <motion.div
            className={styles.head}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ duration: 0.8, ease: EASE }}
        >
            <p className={styles.tag}>{tag}</p>
            <h2 id={id} className={styles.sectionTitle}>
                <span>{title}</span>
                <em>{em}</em>
            </h2>
        </motion.div>
    )
}

/** the "How we work" steps, with a line that draws down them as the page scrolls */
function Timeline() {
    const ref = useRef<HTMLOListElement>(null)
    const reduce = useReducedMotion()
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "end 0.6"] })
    const drawn = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.5 })

    return (
        <ol ref={ref} className={styles.steps}>
            <span className={styles.track} aria-hidden="true">
                <motion.span className={styles.trackFill} style={{ scaleY: reduce ? 1 : drawn }} />
            </span>
            {STEPS.map((s, i) => (
                <motion.li
                    key={s.title}
                    className={styles.step}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "0px 0px -25% 0px" }}
                    transition={{ duration: 0.7, ease: EASE }}
                >
                    <span className={styles.stepDot} aria-hidden="true" />
                    <span className={styles.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                    <div>
                        <h3 className={styles.stepTitle}>{s.title}</h3>
                        <p className={styles.stepText}>{s.text}</p>
                    </div>
                </motion.li>
            ))}
        </ol>
    )
}

/**
 * The About page, in the site's dark band: a two-tone statement beside a
 * turning globe of the services, the story lighting up word by word, a
 * scroll-quickened marquee, four values on spotlight cards, the way we work as
 * a drawn timeline, and a closing call to action.
 */
export default function AboutPage() {
    return (
        <main className={styles.page}>
            <a href="/" className={styles.lockup} aria-label="Pixie Webs home">
                <Logo tone="light" className={styles.logo} />
                <span aria-hidden="true" className={styles.divider} />
                <span className={styles.brand}>PIXIE WEBS</span>
            </a>

            {/* ── the statement and the globe ── */}
            <section className={styles.hero}>
                <div className={styles.heroText}>
                    <motion.p className={styles.tag} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.1 }}>
                        About Pixie Webs
                    </motion.p>
                    <h1 className={styles.title}>
                        <Line delay={0.15}>We build the</Line>
                        <Line delay={0.27} em>
                            digital side
                        </Line>
                        <Line delay={0.39} em>
                            of business.
                        </Line>
                    </h1>
                    <motion.p
                        className={styles.lede}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
                    >
                        Pixie Webs is a digital studio from Kerala, India. We design and build websites, online stores,
                        business systems and mobile apps, and we stay with you long after launch.
                    </motion.p>
                </div>
                <motion.div
                    className={styles.globeWrap}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.4, delay: 0.3, ease: EASE }}
                >
                    <TextGlobe words={GLOBE_WORDS} className={styles.globe} />
                    <p className={styles.globeHint} aria-hidden="true">
                        Drag to spin
                    </p>
                </motion.div>
            </section>

            {/* ── the story ── */}
            <section className={styles.story} aria-label="Our story">
                <p className={styles.tag}>Our story</p>
                <ScrollWords text={STORY} className={styles.storyText} />
            </section>

            {/* ── what we make, running past ── */}
            <div className={styles.marquees} aria-hidden="true">
                <VelocityMarquee items={MARQUEE} className={styles.marquee} itemClassName={styles.marqueeItems} dotClassName={styles.marqueeDot} />
                <VelocityMarquee
                    items={MARQUEE}
                    reverse
                    speed={1.6}
                    className={`${styles.marquee} ${styles.marqueeOutline}`}
                    itemClassName={styles.marqueeItems}
                    dotClassName={styles.marqueeDot}
                />
            </div>

            {/* ── values, on spotlight cards ── */}
            <section className={styles.section} aria-labelledby="values-title">
                <Heading id="values-title" tag="What we believe" title="What we" em="stand for." />
                <ul className={styles.values}>
                    {VALUES.map((v, i) => (
                        <motion.li
                            key={v.title}
                            className={styles.value}
                            initial={{ opacity: 0, y: 32 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                            transition={{ duration: 0.8, delay: i * 0.08, ease: EASE }}
                            // the spotlight and the glowing edge follow the pointer
                            onPointerMove={(e) => {
                                const r = e.currentTarget.getBoundingClientRect()
                                e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`)
                                e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`)
                            }}
                        >
                            <span className={styles.valueIcon}>{v.icon}</span>
                            <h3 className={styles.valueTitle}>{v.title}</h3>
                            <p className={styles.valueText}>{v.text}</p>
                        </motion.li>
                    ))}
                </ul>
            </section>

            {/* ── how we work ── */}
            <section className={`${styles.section} ${styles.process}`} aria-labelledby="process-title">
                <Heading id="process-title" tag="Our process" title="How we" em="work." />
                <Timeline />
            </section>

            {/* ── the closing call to action ── */}
            <section className={styles.cta} aria-labelledby="about-cta">
                <h2 id="about-cta" className={styles.ctaTitle}>
                    <span>Let&rsquo;s build</span>
                    <em>something great.</em>
                </h2>
                <p className={styles.ctaText}>Tell us what you have in mind, and we&rsquo;ll take it from there.</p>
                <div className={styles.ctaActions}>
                    <a href="/contact" className={styles.pill}>
                        Start a Project
                        <span className={styles.pillIcon}>
                            <Arrow />
                        </span>
                    </a>
                    <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={styles.ghost}>
                        Chat on WhatsApp
                    </a>
                </div>
            </section>
        </main>
    )
}
