"use client"

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { haptic } from "@/lib/haptics"
import styles from "./OurWork.module.css"

/** home-page screenshots for the wall, in public/work (960px copies of public/Our works) */
const shot = (n: number) => `/work/${String(n).padStart(2, "0")}.webp`
const SHOT_COUNT = 18

/*
 * The three niches the section turns through, three works each, from
 * public/Our works (ERP by each system's hero image; copies are in
 * public/work/featured). Names come from the screens themselves; the one-line
 * descriptions are written from the screenshots, so check them.
 * PLACEHOLDER LINKS: set each `href` to the live site or a case study, and
 * VIEW_ALL_HREF to a full works page, once they exist.
 */
type Work = { img: string; name: string; kind: string; blurb: string; href: string }

const NICHES: { label: string; tagline: string; works: Work[] }[] = [
    {
        label: "ERP Systems",
        tagline: "Business systems built around how each team works.",
        works: [
            {
                img: "erp-radwa",
                name: "Radwa ERP",
                kind: "HR & operations",
                blurb: "An HR-led ERP covering employees, departments, attendance, leave and documents, with live summaries for managers.",
                href: "#",
            },
            {
                img: "erp-billing",
                name: "Projects & Billing Suite",
                kind: "Projects & invoicing",
                blurb: "A projects and billing system that tracks clients, project status, deadlines and invoices from a single dashboard.",
                href: "#",
            },
            {
                img: "erp-smilecare",
                name: "SmileCare Dental",
                kind: "Dental clinic",
                blurb: "A clinic system for a dental practice: appointments, the patient queue, walk-ins, treatments and payments on one dashboard.",
                href: "#",
            },
        ],
    },
    {
        label: "E-Commerce",
        tagline: "Online stores that turn browsing into buying.",
        works: [
            {
                img: "shop-boss",
                name: "Boss Perfumes",
                kind: "Fragrance store",
                blurb: "A refined online store for a perfume brand, built around its collections and signature fragrances.",
                href: "#",
            },
            {
                img: "shop-moven",
                name: "Moven Active",
                kind: "Activewear store",
                blurb: "A clean online store for a performance activewear brand, built around big product imagery and a quick checkout.",
                href: "#",
            },
            {
                img: "shop-velastia",
                name: "Velastia",
                kind: "Cosmetics store",
                blurb: "A rich, luxurious storefront for a cosmetics brand, with offers and collections up front.",
                href: "#",
            },
        ],
    },
    {
        label: "Websites",
        tagline: "Sites that give a brand a first impression worth keeping.",
        works: [
            {
                img: "web-kerala-travel",
                name: "Kerala Luxury Travel",
                kind: "Travel & cabs",
                blurb: "A premium travel site for luxury journeys and airport transfers across Kerala, with WhatsApp bookings.",
                href: "#",
            },
            {
                img: "web-rogue-ninja",
                name: "Rogue Ninja",
                kind: "Fight gym",
                blurb: "A bold, high-energy site for a fight gym, with its programs, gallery and sign-ups.",
                href: "#",
            },
            {
                img: "web-ondezyn",
                name: "Ondezyn",
                kind: "Fashion studio",
                blurb: "An editorial site for a bridal fashion studio, showing its custom designs and collections.",
                href: "#",
            },
        ],
    },
]
const VIEW_ALL_HREF = "#"
const N = NICHES.length
/** how long each work holds in a niche's carousel before the next slides in */
const SLIDE_MS = 3800

/**
 * The wall: rows of screenshots, tilted, sliding sideways like the old
 * carousel (alternate rows in opposite directions). Each row is longer than
 * the screen, so a card wraps from one end to the other out of sight.
 */
const ROWS = 7
const COLS = 8
const WALL = ROWS * COLS
/** sliding speed in px/s, varied a little per row */
const SLIDE = Array.from({ length: ROWS }, (_, r) => (r % 2 ? 1 : -1) * 48 * (1 + (((r * 0.37) % 1) - 0.5) * 0.45))
/** which screenshot each wall card shows, mixed so neighbours differ */
const WALL_SHOT = Array.from({ length: WALL }, (_, i) => ((i * 5 + Math.floor(i / COLS) * 7) % SHOT_COUNT) + 1)
const TILT_DEG = -16
const TILT = (TILT_DEG * Math.PI) / 180
/** each wall card's head start in the break, so they don't all leave together */
const DELAY = Array.from({ length: WALL }, (_, i) => ((i * 0.618034) % 1) * 0.3)

/**
 * The scroll each part takes, in screen heights: the wall breaking, the first
 * card arriving, the turns from niche to niche, and the closing call to
 * action. The section is one screen plus their total.
 */
// hold: the opening frame (the sliding wall and its title) stays put for this
// much scroll before the zoom starts.
// overlap: how much of the break's tail the first card's arrival runs under,
// so it comes up out of the dark while the last cards fly past, with no empty screen
const PHASES = { hold: 0.7, breakup: 2.1, overlap: 0.7, arrive: 0.75, niches: 4.1, outro: 0.9 }
/** where the arrival starts, in screen heights */
const ARRIVE_AT = PHASES.hold + PHASES.breakup - PHASES.overlap
const TOTAL = ARRIVE_AT + PHASES.arrive + PHASES.niches + PHASES.outro

const PERSPECTIVE = 1200
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const smooth = (a: number, b: number, v: number) => {
    const t = clamp((v - a) / (b - a))
    return t * t * (3 - 2 * t)
}

type Geo = {
    vh: number
    /** the wall's spacing along a row and between rows, and one row's full length */
    gx: number
    gy: number
    span: number
    wallW: number
    frontW: number
    drumX: number
    drumY: number
    drumR: number
}

function measure(): Geo {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const phone = vw < 900
    // the wall: a brick grid of cards, rotated as a whole
    const wallW = phone ? vw * 0.52 : clamp(vw * 0.21, 220, 400)
    const gx = wallW * 1.12
    const gy = (wallW / 2) * 1.28
    // the front card
    // on wide screens, small enough that the heading above and the thumbnails below still fit
    const frontW = phone ? vw * 0.86 : Math.min(vw * 0.48, 780, Math.max(420, (vh - 330) * 2))
    return {
        vh,
        gx,
        gy,
        span: COLS * gx,
        wallW,
        frontW,
        drumX: phone ? 0 : -vw * 0.14,
        drumY: phone ? -vh * 0.12 : vh * 0.02,
        // a three-sided prism: the distance from its axis to each 2:1 face, with a little air
        drumR: (frontW / 4 / Math.tan(Math.PI / N)) * 1.6,
    }
}

function Arrow() {
    return (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
        </svg>
    )
}

/**
 * Our Work, as one pinned scroll sequence in the dark band:
 *  1. the tilted wall of client sites, its rows sliding like a carousel, with
 *     OUR WORKS across it; scrolling zooms into it and the wall breaks apart,
 *     its cards flying out past you;
 *  2. out of the dark behind it, the first niche's card drifts forward into place;
 *  3. scrolling turns a three-sided prism from niche to niche (ERP systems,
 *     e-commerce, websites). Inside each face a carousel slides through that
 *     niche's three works on its own; the panel beside it has the work's
 *     details, a View more link and the three niches; the niche's heading
 *     sits above the card and its works as thumbnails below;
 *  4. after the last niche, the prism steps back and a View All Works call to
 *     action comes up.
 * The wall, the break and the turns follow the scroll exactly, so they run
 * both ways; only the carousels move on a timer.
 */
export default function OurWork() {
    const scrollerRef = useRef<HTMLDivElement>(null)
    const wallRefs = useRef<(HTMLDivElement | null)[]>([])
    const faceRefs = useRef<(HTMLDivElement | null)[]>([])
    const titleRef = useRef<HTMLDivElement>(null)
    const veilRef = useRef<HTMLDivElement>(null)
    const panelRef = useRef<HTMLDivElement>(null)
    const frameRef = useRef<HTMLDivElement>(null)
    const glowRef = useRef<HTMLDivElement>(null)
    const outroRef = useRef<HTMLDivElement>(null)
    const geo = useRef<Geo | null>(null)
    /** seconds the wall has slid for; only advances while it's on screen */
    const slideRef = useRef(0)
    /** how far into the break the last frame was, so the slide stops once the wall is gone */
    const breakRef = useRef(0)

    // the niche facing the front (from the scroll), and whether its carousel should run
    const [niche, setNiche] = useState(0)
    const nicheRef = useRef(0)
    /** the last quarter-step of the turn, for the ratchet ticks */
    const notchRef = useRef<number | null>(null)
    const [showing, setShowing] = useState(false)
    const showingRef = useRef(false)
    const [hover, setHover] = useState(false)
    // each carousel's position: 0..n, where n is a copy of the first slide, so
    // the last-to-first step still slides forward before snapping back to 0
    const [pos, setPos] = useState<number[]>(() => NICHES.map(() => 0))
    const [snap, setSnap] = useState<boolean[]>(() => NICHES.map(() => false))

    const frame = useCallback(() => {
        const scroller = scrollerRef.current
        const g = geo.current
        if (!scroller || !g) return
        const total = scroller.offsetHeight - g.vh
        const P = total > 0 ? clamp(-scroller.getBoundingClientRect().top / total) : 0

        const h = PHASES.hold / TOTAL
        const a = PHASES.breakup / TOTAL
        const s0 = ARRIVE_AT / TOTAL
        const b = PHASES.arrive / TOTAL
        const c = PHASES.niches / TOTAL
        const d = PHASES.outro / TOTAL
        const tA = clamp((P - h) / a)
        const tB = clamp((P - s0) / b)
        const tC = clamp((P - s0 - b) / c)
        const tD = clamp((P - s0 - b - c) / d)

        // 1. the wall slides, row by row; scrolling breaks it, each card rushing at
        //    the camera a moment apart
        breakRef.current = tA
        const cos = Math.cos(TILT)
        const sin = Math.sin(TILT)
        for (let i = 0; i < WALL; i++) {
            const el = wallRefs.current[i]
            if (!el) continue
            const r = Math.floor(i / COLS)
            const col = i % COLS
            // place along the row, wrapped round its length, centred on the screen
            const u = col * g.gx + (r % 2 ? g.gx / 2 : 0) + SLIDE[r] * slideRef.current
            const bx = (((u % g.span) + g.span) % g.span) - g.span / 2
            const by = (r - (ROWS - 1) / 2) * g.gy
            // each card's flight is long and starts gently, so the zoom builds rather than jumps
            const t = clamp((tA - DELAY[i]) / 0.7)
            const z = Math.pow(t, 2.4) * (PERSPECTIVE - 120)
            el.style.transform = `translate(-50%, -50%) translate3d(${bx * cos - by * sin}px, ${bx * sin + by * cos}px, ${z}px) rotate(${TILT_DEG}deg)`
            el.style.opacity = String(1 - smooth(0.7, 1, t))
        }
        if (titleRef.current) {
            titleRef.current.style.transform = `translate(-50%, -50%) translateZ(2px) scale(${1 + tA * 1.1})`
            titleRef.current.style.opacity = String(1 - smooth(0.3, 0.75, tA))
        }
        if (veilRef.current) veilRef.current.style.opacity = String(1 - smooth(0.45, 0.9, tA))

        // 3. the prism's turn: a hold on each niche, an eased turn between them
        const v = clamp(tC * N - 0.5, 0, N - 1)
        const base = Math.floor(v)
        const rot = base + smooth(0.2, 0.8, v - base)
        const now = Math.round(rot)
        // light ratchet ticks as the prism turns through a quarter-step, like a dial
        const notch = Math.floor(rot * 4 + 0.001)
        if (notch !== notchRef.current) {
            if (notchRef.current !== null && notch % 4 !== 2) haptic(5)
            notchRef.current = notch
        }
        if (now !== nicheRef.current) {
            nicheRef.current = now
            setNiche(now)
            // a firmer tap as the next niche turns to the front
            haptic(14)
        }
        // the carousel runs once its card has arrived, until the outro takes over
        const on = tB > 0.7 && tD < 0.3
        if (on !== showingRef.current) {
            showingRef.current = on
            setShowing(on)
        }

        // 4. the outro: the prism steps back
        const back = smooth(0, 0.5, tD)

        // 2 + 3. the faces: the first drifts forward out of the dark, then the prism turns
        const arrive = smooth(0, 0.7, tB)
        const step = 360 / N
        for (let i = 0; i < N; i++) {
            const el = faceRefs.current[i]
            if (!el) continue
            const phi = (i - rot) * step
            const ph = (phi * Math.PI) / 180
            // the next niche waits below and rolls up into place as the page scrolls down
            const y = g.drumY + g.drumR * Math.sin(ph)
            const z = g.drumR * Math.cos(ph) - g.drumR - back * 260 - (1 - arrive) * 900
            const s = lerp(0.86, 1, arrive) * (1 - back * 0.08)
            el.style.transform = `translate(-50%, -50%) translate3d(${g.drumX}px, ${y}px, ${z}px) rotateX(${-phi}deg) scale(${s})`
            const facing = clamp(Math.cos(ph) * 1.5 - 0.25)
            el.style.opacity = String(arrive * facing * (1 - back * 0.88))
            // out of focus while it's far off, sharpening as it comes forward
            const blur = (1 - arrive) * 12 + back * 6
            el.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : ""
            el.style.pointerEvents = facing > 0.9 ? "auto" : "none"
        }
        const show = smooth(0.45, 1, tB) * (1 - smooth(0, 0.35, tD))
        // the heading and thumbnails sit around the front card, fading out mid-turn
        // while the next niche rolls up, and back in with its name
        if (frameRef.current) {
            const settled = 1 - smooth(0.08, 0.4, Math.abs(rot - now))
            const o = show * settled
            frameRef.current.style.opacity = String(o)
            frameRef.current.style.transform = `translate(-50%, -50%) translate(${g.drumX}px, ${g.drumY + (1 - show) * 24}px)`
            frameRef.current.style.visibility = o > 0.02 ? "visible" : "hidden"
            // the glow behind the card follows it in and out
            if (glowRef.current) {
                glowRef.current.style.opacity = String(o * 0.45)
                glowRef.current.style.transform = `translate(-50%, -50%) translate(${g.drumX}px, ${g.drumY}px)`
            }
        }
        if (panelRef.current) {
            panelRef.current.style.opacity = String(show)
            panelRef.current.style.transform = `translateY(${(1 - show) * 24}px)`
            panelRef.current.style.visibility = show > 0.02 ? "visible" : "hidden"
        }
        if (outroRef.current) {
            const show = smooth(0.25, 0.75, tD)
            outroRef.current.style.opacity = String(show)
            outroRef.current.style.transform = `translate(-50%, -50%) translateY(${(1 - show) * 30}px)`
            outroRef.current.style.visibility = show > 0.02 ? "visible" : "hidden"
        }
    }, [])

    // The slide: a frame loop that runs only while the section is on screen and
    // the wall hasn't fully broken away, and not at all for reduced motion.
    useLayoutEffect(() => {
        const scroller = scrollerRef.current
        if (!scroller || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
        let raf = 0
        let last = 0
        const tick = (now: number) => {
            const dt = last ? Math.min(0.05, (now - last) / 1000) : 0
            last = now
            if (breakRef.current < 1) {
                slideRef.current += dt
                frame()
            }
            raf = requestAnimationFrame(tick)
        }
        const io = new IntersectionObserver(([e]) => {
            if (e.isIntersecting && !raf) {
                last = 0
                raf = requestAnimationFrame(tick)
            } else if (!e.isIntersecting && raf) {
                cancelAnimationFrame(raf)
                raf = 0
            }
        })
        io.observe(scroller)
        return () => {
            io.disconnect()
            if (raf) cancelAnimationFrame(raf)
        }
    }, [frame])

    useLayoutEffect(() => {
        const scroller = scrollerRef.current
        const sync = () => {
            const g = measure()
            geo.current = g
            scroller?.style.setProperty("--wall-w", `${g.wallW}px`)
            scroller?.style.setProperty("--front-w", `${g.frontW}px`)
            frame()
        }
        sync()
        window.addEventListener("resize", sync)
        window.addEventListener("scroll", frame, { passive: true })
        return () => {
            window.removeEventListener("resize", sync)
            window.removeEventListener("scroll", frame)
        }
    }, [frame])

    // The front niche's carousel moves on by itself, unless the pointer is on it
    // or the visitor asks for less motion.
    useEffect(() => {
        if (!showing || hover || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
        const t = window.setTimeout(() => {
            setSnap((sn) => sn.map((v, i) => (i === niche ? false : v)))
            setPos((p) => p.map((v, i) => (i === niche ? Math.min(v + 1, NICHES[i].works.length) : v)))
        }, SLIDE_MS)
        return () => window.clearTimeout(t)
    }, [showing, hover, niche, pos])

    // after sliding onto the copy of the first slide, jump back to the real one unseen
    const onSlid = (i: number) => {
        if (pos[i] !== NICHES[i].works.length) return
        setSnap((sn) => sn.map((v, k) => (k === i ? true : v)))
        setPos((p) => p.map((v, k) => (k === i ? 0 : v)))
    }

    const pickWork = (i: number, w: number) => {
        haptic(12)
        setSnap((sn) => sn.map((v, k) => (k === i ? false : v)))
        setPos((p) => p.map((v, k) => (k === i ? w : v)))
    }

    // the index jumps the page to the middle of a niche's hold
    const goTo = (k: number) => {
        haptic(12)
        const scroller = scrollerRef.current
        const g = geo.current
        if (!scroller || !g) return
        const total = scroller.offsetHeight - g.vh
        const tC = (k + 0.5) / N
        const P = (ARRIVE_AT + PHASES.arrive + tC * PHASES.niches) / TOTAL
        const top = scroller.getBoundingClientRect().top + window.scrollY + P * total
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" })
    }

    const current = NICHES[niche]
    const slide = pos[niche] % current.works.length
    const work = current.works[slide]

    return (
        <div
            ref={scrollerRef}
            id="work"
            className={styles.scroller}
            // one screen, plus the sequence's scroll
            style={{ height: `calc(100svh + ${TOTAL * 100}svh)` }}
        >
            <section className={styles.stage} aria-labelledby="work-title">
                {/* the front work's colours, blurred into a soft light behind its card */}
                <div ref={glowRef} className={styles.glow} aria-hidden="true" style={{ opacity: 0 }}>
                    {NICHES.map((n, ni) =>
                        n.works.map((w, k) => (
                            <img key={w.img} src={`/work/featured/${w.img}.webp`} alt="" decoding="async" data-on={ni === niche && k === slide} />
                        )),
                    )}
                </div>

                <div className={styles.scene} style={{ perspective: `${PERSPECTIVE}px` }}>
                    <div className={styles.space}>
                        {/* 1. the wall */}
                        {Array.from({ length: WALL }, (_, i) => (
                            <div
                                key={i}
                                ref={(el) => {
                                    wallRefs.current[i] = el
                                }}
                                className={styles.wallCard}
                                aria-hidden="true"
                            >
                                <img src={shot(WALL_SHOT[i])} alt="" decoding="async" />
                            </div>
                        ))}

                        <div ref={veilRef} className={styles.veil} aria-hidden="true" />

                        <div ref={titleRef} className={styles.title}>
                            <h2 id="work-title">Our Works</h2>
                        </div>

                        {/* 2 + 3. the prism: one face per niche, each a carousel of its works */}
                        {NICHES.map((n, i) => (
                            <div
                                key={n.label}
                                ref={(el) => {
                                    faceRefs.current[i] = el
                                }}
                                className={styles.workCard}
                                aria-hidden="true"
                                onMouseEnter={() => setHover(true)}
                                onMouseLeave={() => setHover(false)}
                                // a soft light that follows the pointer across the screen
                                onPointerMove={(e) => {
                                    const r = e.currentTarget.getBoundingClientRect()
                                    e.currentTarget.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`)
                                    e.currentTarget.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`)
                                }}
                            >
                                <div
                                    className={styles.track}
                                    data-snap={snap[i]}
                                    style={{ transform: `translateX(${-pos[i] * 100}%)` }}
                                    onTransitionEnd={(e) => e.target === e.currentTarget && onSlid(i)}
                                >
                                    {[...n.works, n.works[0]].map((w, k) => (
                                        <img
                                            key={k}
                                            src={`/work/featured/${w.img}.webp`}
                                            alt=""
                                            decoding="async"
                                            className={styles.slide}
                                            // the first slide zooms with its copy, so the jump back to it can't be seen
                                            data-on={k === pos[i] || (k === 0 && pos[i] === n.works.length)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* around the front card: the niche's heading above, its works as thumbnails below */}
                <div ref={frameRef} className={styles.frame} style={{ opacity: 0, visibility: "hidden" }}>
                    <div key={niche} className={styles.nicheHead}>
                        <h3 className={styles.nicheTitle}>{current.label}</h3>
                        <p className={styles.nicheLine}>{current.tagline}</p>
                    </div>
                    <div
                        key={`thumbs-${niche}`}
                        className={styles.thumbs}
                        role="group"
                        aria-label={`${current.label} projects`}
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                    >
                        {current.works.map((w, k) => (
                            <button
                                key={w.img}
                                type="button"
                                className={styles.thumb}
                                aria-label={w.name}
                                aria-current={k === slide}
                                onClick={() => pickWork(niche, k)}
                            >
                                <img src={`/work/featured/${w.img}.webp`} alt="" decoding="async" />
                                {/* the time left on this slide, filling until the next one slides in */}
                                {k === slide && (
                                    <span
                                        key={`${pos[niche]}-${hover}-${showing}`}
                                        className={styles.thumbBar}
                                        style={{
                                            animationDuration: `${SLIDE_MS}ms`,
                                            animationPlayState: showing && !hover ? "running" : "paused",
                                        }}
                                    />
                                )}
                            </button>
                        ))}
                        {/* the current work's link, right after its thumbnails */}
                        <a
                            href={work.href}
                            className={`${styles.pill} ${styles.thumbPill}`}
                            aria-label={`View more: ${work.name}`}
                            onClick={() => haptic(12)}
                        >
                            View more
                            <span className={styles.pillIcon}>
                                <Arrow />
                            </span>
                        </a>
                    </div>
                </div>

                {/* the front work's details, and the three niches */}
                <div ref={panelRef} className={styles.panel} style={{ opacity: 0, visibility: "hidden" }}>
                    <div key={`${niche}-${slide}`} className={styles.panelBody}>
                        <p className={styles.category}>{work.kind}</p>
                        <h4 className={styles.name}>{work.name}</h4>
                        <p className={styles.blurb}>{work.blurb}</p>
                    </div>
                    <ul className={styles.index} aria-label="Our work by niche">
                        {NICHES.map((n, ni) => (
                            <li key={n.label}>
                                <button type="button" className={styles.catRow} data-active={ni === niche} onClick={() => goTo(ni)}>
                                    {n.label}
                                    <span className={styles.catArrow} aria-hidden="true">
                                        <Arrow />
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 4. the closing call to action */}
                <div ref={outroRef} className={styles.outro} style={{ opacity: 0, visibility: "hidden" }}>
                    <p className={styles.outroTitle}>
                        <span>That&rsquo;s just</span>
                        <em>a few of them.</em>
                    </p>
                    <p className={styles.outroText}>
                        Business systems, online stores and websites for brands in travel, hospitality, healthcare,
                        retail and more.
                    </p>
                    <a href={VIEW_ALL_HREF} className={styles.pill}>
                        View All Works
                        <span className={styles.pillIcon}>
                            <Arrow />
                        </span>
                    </a>
                </div>
            </section>
        </div>
    )
}
