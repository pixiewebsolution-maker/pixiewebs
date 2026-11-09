"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import Logo from "@/components/Logo"
import { haptic } from "@/lib/haptics"
import { WORKS, screen, type CategoryId, type Work } from "@/lib/works"
import ScrollStroke from "./ScrollStroke"
import styles from "./WorksPage.module.css"

const EASE = [0.22, 0.8, 0.24, 1] as const

/* the page's three groups, in this order */
const GROUPS: { id: string; label: string; tagline: string; categories: CategoryId[] }[] = [
    { id: "erp", label: "ERP Systems", tagline: "Business systems built around how each team works.", categories: ["erp"] },
    { id: "ecommerce", label: "E-Commerce", tagline: "Online stores that turn browsing into buying.", categories: ["ecommerce"] },
    { id: "websites", label: "Websites", tagline: "Sites that give a brand a first impression worth keeping.", categories: ["website"] },
]

type Filter = "all" | string

/** a group's works, in the order its categories are listed */
const worksIn = (g: (typeof GROUPS)[number]) => g.categories.flatMap((c) => WORKS.filter((w) => w.category === c))
const pad = (n: number) => String(n).padStart(2, "0")
/** "https://www.sezocabs.com/" → "sezocabs.com", for the browser bar */
const domain = (href: string) => href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/.*$/, "")

function Arrow() {
    return (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
        </svg>
    )
}

function Chevron({ dir }: { dir: "left" | "right" }) {
    return (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d={dir === "left" ? "M10 3.5L5.5 8l4.5 4.5" : "M6 3.5L10.5 8 6 12.5"} />
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

/** a project: its cover in a browser frame (opens the viewer), and its details under it */
function Card({ work, index, onOpen }: { work: Work; index: number; onOpen: (w: Work) => void }) {
    return (
        <motion.article
            id={work.slug}
            className={styles.card}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.8, delay: (index % 2) * 0.08, ease: EASE }}
        >
            <button
                type="button"
                className={styles.frame}
                onClick={() => onOpen(work)}
                // a soft light that follows the pointer across the screen
                onPointerMove={(e) => {
                    const r = e.currentTarget.getBoundingClientRect()
                    e.currentTarget.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`)
                    e.currentTarget.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`)
                }}
            >
                <span className={styles.srOnly}>
                    {work.screens > 1 ? `View ${work.screens} screens of ${work.name}` : `View ${work.name}`}
                </span>
                <span className={styles.bar} aria-hidden="true">
                    <span className={styles.dots}>
                        <i />
                        <i />
                        <i />
                    </span>
                    <span className={styles.url}>{work.href ? domain(work.href) : work.name}</span>
                </span>
                <span className={styles.shot}>
                    <img
                        src={screen(work.slug, 1, 960)}
                        srcSet={`${screen(work.slug, 1, 960)} 960w, ${screen(work.slug, 1, 1600)} 1600w`}
                        sizes="(min-width: 900px) 46vw, 92vw"
                        alt={`${work.name}, ${work.kind.toLowerCase()} by Pixie Webs`}
                        loading="lazy"
                        decoding="async"
                    />
                </span>
                <span className={styles.peek} aria-hidden="true">
                    {work.screens > 1 ? `${work.screens} screens` : "View"}
                    <Arrow />
                </span>
            </button>

            <div className={styles.meta}>
                <span className={styles.num}>{pad(index + 1)}</span>
                <div className={styles.text}>
                    <p className={styles.kind}>{work.kind}</p>
                    <h3 className={styles.name}>{work.name}</h3>
                    <p className={styles.blurb}>{work.blurb}</p>
                </div>
                {work.href && (
                    <a
                        href={work.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.visit}
                        aria-label={`Visit ${work.name} (opens in a new tab)`}
                        onClick={() => haptic(12)}
                    >
                        Visit site
                        <span className={styles.visitIcon}>
                            <Arrow />
                        </span>
                    </a>
                )}
            </div>
        </motion.article>
    )
}

/** the full-screen viewer: a project's screens, one at a time, with arrows, keys and swipes */
function Viewer({ work, onClose }: { work: Work; onClose: () => void }) {
    const [i, setI] = useState(0)
    const closeRef = useRef<HTMLButtonElement>(null)
    const touchX = useRef<number | null>(null)
    const many = work.screens > 1

    const go = useCallback(
        (d: number) => {
            if (!many) return
            setI((v) => (v + d + work.screens) % work.screens)
            haptic(8)
        },
        [many, work.screens],
    )

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
            else if (e.key === "ArrowRight") go(1)
            else if (e.key === "ArrowLeft") go(-1)
        }
        window.addEventListener("keydown", onKey)
        // hold the page still behind the viewer
        const root = document.documentElement
        const overflow = root.style.overflow
        root.style.overflow = "hidden"
        const before = document.activeElement as HTMLElement | null
        closeRef.current?.focus({ preventScroll: true })
        return () => {
            window.removeEventListener("keydown", onKey)
            root.style.overflow = overflow
            before?.focus({ preventScroll: true })
        }
    }, [go, onClose])

    return (
        <motion.div
            className={styles.viewer}
            role="dialog"
            aria-modal="true"
            aria-label={`${work.name} screens`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className={styles.viewerTop}>
                <div>
                    <p className={styles.kind}>{work.kind}</p>
                    <p className={styles.viewerName}>{work.name}</p>
                </div>
                <button ref={closeRef} type="button" className={styles.close} onClick={onClose} aria-label="Close">
                    <span aria-hidden="true" />
                    <span aria-hidden="true" />
                </button>
            </div>

            <div
                className={styles.stagePic}
                onClick={(e) => e.target === e.currentTarget && onClose()}
                onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
                onTouchEnd={(e) => {
                    if (touchX.current === null) return
                    const dx = e.changedTouches[0].clientX - touchX.current
                    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
                    touchX.current = null
                }}
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.img
                        key={i}
                        src={screen(work.slug, i + 1, 1600)}
                        alt={`${work.name}, screen ${i + 1} of ${work.screens}`}
                        className={styles.bigShot}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.3, ease: EASE }}
                    />
                </AnimatePresence>
            </div>

            <div className={styles.viewerBottom}>
                {many ? (
                    <>
                        <button type="button" className={styles.navBtn} onClick={() => go(-1)} aria-label="Previous screen">
                            <Chevron dir="left" />
                        </button>
                        <span className={styles.counter} aria-live="polite">
                            {pad(i + 1)} / {pad(work.screens)}
                        </span>
                        <button type="button" className={styles.navBtn} onClick={() => go(1)} aria-label="Next screen">
                            <Chevron dir="right" />
                        </button>
                    </>
                ) : (
                    <span />
                )}
                {work.href && (
                    <a href={work.href} target="_blank" rel="noopener noreferrer" className={styles.pill}>
                        Visit site
                        <span className={styles.pillIcon}>
                            <Arrow />
                        </span>
                    </a>
                )}
            </div>
        </motion.div>
    )
}

/**
 * The Our Works page, in the site's dark band: the statement,
 * a row of filter chips, every project grouped by category in browser frames
 * (each opens a full-screen viewer of its screens), and a closing call to action.
 */
export default function WorksPage() {
    const [filter, setFilter] = useState<Filter>("all")
    const [open, setOpen] = useState<Work | null>(null)
    const listRef = useRef<HTMLDivElement>(null)
    const pageRef = useRef<HTMLDivElement>(null)
    // stable, so the viewer's key and focus handling don't re-run while it's open
    const close = useCallback(() => setOpen(null), [])

    const pick = (f: Filter) => {
        setFilter(f)
        haptic(10)
        // bring the list's top into view if the visitor has scrolled past it
        const top = listRef.current?.getBoundingClientRect().top ?? 0
        if (top < 0) listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    // a link to /work#slug opens straight on that project
    useEffect(() => {
        const slug = decodeURIComponent(window.location.hash.slice(1))
        if (!slug) return
        const el = document.getElementById(slug)
        if (el) requestAnimationFrame(() => el.scrollIntoView({ block: "center" }))
    }, [])

    const groups = GROUPS.filter((g) => filter === "all" || filter === g.id)
    const chips: { id: Filter; label: string }[] = [{ id: "all", label: "All" }, ...GROUPS.map((g) => ({ id: g.id, label: g.label }))]

    return (
        <div ref={pageRef} className={styles.page}>
            <ScrollStroke pageRef={pageRef} />

            {/* the logo lockup, as at the top of the home page */}
            <a href="/" className={styles.lockup} aria-label="Pixie Webs home">
                <Logo tone="light" className={styles.logo} />
                <span aria-hidden="true" className={styles.divider} />
                <span className={styles.brand}>PIXIE WEBS</span>
            </a>

            <header className={styles.hero}>
                <motion.p
                    className={styles.tag}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                >
                    Our Works
                </motion.p>
                <h1 className={styles.title} data-stroke-knot>
                    <Line delay={0.15}>Work that moves</Line>
                    <Line delay={0.27} em>
                        businesses forward.
                    </Line>
                </h1>
                <motion.p
                    className={styles.intro}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
                >
                    Business systems, online stores and websites for brands in travel, hospitality, healthcare, retail
                    and more.
                </motion.p>

            </header>

            <div ref={listRef} className={styles.filters} role="group" aria-label="Filter projects">
                {chips.map((c) => (
                    <button
                        key={c.id}
                        type="button"
                        className={styles.chip}
                        aria-pressed={filter === c.id}
                        onClick={() => pick(c.id)}
                    >
                        {c.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={filter}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {groups.map((c) => {
                        const works = worksIn(c)
                        return (
                            <section key={c.id} className={styles.group} aria-labelledby={`group-${c.id}`}>
                                <div className={styles.groupHead}>
                                    <h2 id={`group-${c.id}`} className={styles.groupTitle}>
                                        {c.label}
                                    </h2>
                                    <p className={styles.groupLine}>{c.tagline}</p>
                                </div>
                                <div className={styles.grid}>
                                    {works.map((w, k) => (
                                        <Card key={w.slug} work={w} index={k} onOpen={setOpen} />
                                    ))}
                                </div>
                            </section>
                        )
                    })}
                </motion.div>
            </AnimatePresence>

            <section className={styles.cta} aria-labelledby="works-cta">
                <h2 id="works-cta" className={styles.ctaTitle} data-stroke-end>
                    <span>Your project</span>
                    <em>could be next.</em>
                </h2>
                <p className={styles.ctaText}>Tell us what you&rsquo;re building, and we&rsquo;ll take it from there.</p>
                <a href="/contact" className={styles.pill}>
                    Start a Project
                    <span className={styles.pillIcon}>
                        <Arrow />
                    </span>
                </a>
            </section>

            <AnimatePresence>{open && <Viewer key={open.slug} work={open} onClose={close} />}</AnimatePresence>
        </div>
    )
}
