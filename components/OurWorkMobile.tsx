"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react"
import { haptic } from "@/lib/haptics"
import styles from "./OurWorkMobile.module.css"

export type MobileWork = { img: string; name: string; kind: string; blurb: string; href: string }
export type MobileNiche = { label: string; tagline: string; works: MobileWork[] }

/** a few of the home-page screenshots for the intro's wall, in public/work */
const WALL_ROWS = [
    [1, 4, 7, 10, 13, 16],
    [2, 5, 8, 11, 14, 17],
    [3, 6, 9, 12, 15, 18],
]
const shot = (n: number) => `/work/${String(n).padStart(2, "0")}.webp`

/**
 * Whether the section is near the screen. Its images all load then, together:
 * the browser's own lazy loading would leave the tilted wall and the slides
 * waiting off to the side blank until they slid into view.
 */
const Near = createContext(false)
/** how long each work holds before the next slides in */
const SLIDE_MS = 4200

function Arrow() {
    return (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
        </svg>
    )
}

/**
 * One niche on its own screen: its name, a swipeable card of its works (moving
 * on by itself while it's on screen and untouched), dots for each work, and
 * the showing work's details with its link.
 */
function NichePanel({ niche, index }: { niche: MobileNiche; index: number }) {
    const panelRef = useRef<HTMLElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)
    const [active, setActive] = useState(0)
    const [inView, setInView] = useState(false)
    const touching = useRef(false)
    const n = niche.works.length

    // only runs its slideshow while it's the panel on screen
    useEffect(() => {
        const el = panelRef.current
        if (!el) return
        const io = new IntersectionObserver(([e]) => setInView(e.intersectionRatio > 0.6), { threshold: [0, 0.6, 1] })
        io.observe(el)
        return () => io.disconnect()
    }, [])

    const goTo = (k: number, smooth = true) => {
        const track = trackRef.current
        if (!track) return
        track.scrollTo({ left: k * track.clientWidth, behavior: smooth ? "smooth" : "auto" })
    }

    useEffect(() => {
        if (!inView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
        const t = window.setTimeout(() => {
            if (!touching.current) goTo((active + 1) % n)
        }, SLIDE_MS)
        return () => window.clearTimeout(t)
    }, [inView, active, n])

    // the showing work follows the swipe
    const onScroll = () => {
        const track = trackRef.current
        if (!track) return
        const k = Math.round(track.scrollLeft / track.clientWidth)
        if (k !== active && k >= 0 && k < n) {
            setActive(k)
            haptic(6)
        }
    }

    const work = niche.works[active]
    const id = `work-m-${index}`
    const near = useContext(Near)

    return (
        <section ref={panelRef} className={styles.panel} aria-labelledby={id}>
            <div className={styles.head}>
                <h3 id={id} className={styles.nicheTitle}>
                    {niche.label}
                </h3>
                <p className={styles.nicheLine}>{niche.tagline}</p>
            </div>

            <div
                ref={trackRef}
                className={styles.track}
                onScroll={onScroll}
                onTouchStart={() => (touching.current = true)}
                onTouchEnd={() => (touching.current = false)}
                aria-roledescription="carousel"
                aria-label={`${niche.label} projects`}
            >
                {niche.works.map((w, k) => (
                    <div key={w.img} className={styles.slide} aria-hidden={k !== active}>
                        <img src={near ? `/work/featured/${w.img}.webp` : undefined} alt={`${w.name}, ${w.kind.toLowerCase()}`} decoding="async" />
                    </div>
                ))}
            </div>

            <div className={styles.dots} role="group" aria-label={`Choose a ${niche.label} project`}>
                {niche.works.map((w, k) => (
                    <button
                        key={w.img}
                        type="button"
                        className={styles.dot}
                        aria-label={w.name}
                        aria-current={k === active}
                        onClick={() => goTo(k)}
                    />
                ))}
            </div>

            <div key={active} className={styles.details}>
                <p className={styles.kind}>{work.kind}</p>
                <p className={styles.name}>{work.name}</p>
                <p className={styles.blurb}>{work.blurb}</p>
                <a href={work.href} className={styles.pill} onClick={() => haptic(12)}>
                    View more
                    <span className={styles.pillIcon}>
                        <Arrow />
                    </span>
                </a>
            </div>
        </section>
    )
}

/**
 * Our Works on phones: a run of full screens instead of the desktop's pinned 3D
 * sequence, each one a stop as you scroll (scroll-snap). First the title over a
 * slowly drifting wall of client sites, then one screen per niche, then the
 * call to view everything.
 */
export default function OurWorkMobile({ niches, viewAll }: { niches: MobileNiche[]; viewAll: string }) {
    const rootRef = useRef<HTMLDivElement>(null)
    const [near, setNear] = useState(false)

    // a screen ahead; never on desktop, where this is hidden and so never intersects
    useEffect(() => {
        const el = rootRef.current
        if (!el) return
        const io = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    setNear(true)
                    io.disconnect()
                }
            },
            { rootMargin: "100% 0px" },
        )
        io.observe(el)
        return () => io.disconnect()
    }, [])

    return (
        <Near.Provider value={near}>
        <div ref={rootRef} className={styles.root}>
            <section className={`${styles.panel} ${styles.intro}`} aria-labelledby="work-title-m">
                <div className={styles.wall} aria-hidden="true">
                    {WALL_ROWS.map((row, r) => (
                        <div key={r} className={styles.wallRow} data-dir={r % 2 ? "right" : "left"}>
                            {/* twice over, so the drift loops without a seam */}
                            {[...row, ...row].map((n, k) => (
                                <img key={k} src={near ? shot(n) : undefined} alt="" decoding="async" />
                            ))}
                        </div>
                    ))}
                </div>
                <div className={styles.veil} aria-hidden="true" />
                <div className={styles.introText}>
                    <h2 id="work-title-m" className={styles.title}>
                        Our Works
                    </h2>
                    <p className={styles.introLine}>Business systems, online stores and websites we&rsquo;ve built.</p>
                    <span className={styles.hint} aria-hidden="true">
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M8 3v10M4 9l4 4 4-4" />
                        </svg>
                    </span>
                </div>
            </section>

            {niches.map((n, i) => (
                <NichePanel key={n.label} niche={n} index={i} />
            ))}

            <section className={`${styles.panel} ${styles.outro}`} aria-label="All our works">
                <p className={styles.outroTitle}>
                    <span>That&rsquo;s just</span>
                    <em>a few of them.</em>
                </p>
                <p className={styles.outroText}>
                    Business systems, online stores and websites for brands in travel, hospitality, healthcare, retail
                    and more.
                </p>
                <a href={viewAll} className={styles.pill}>
                    View All Works
                    <span className={styles.pillIcon}>
                        <Arrow />
                    </span>
                </a>
            </section>
        </div>
        </Near.Provider>
    )
}
