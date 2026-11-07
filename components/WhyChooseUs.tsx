"use client"

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { haptic } from "@/lib/haptics"
import Logo from "./Logo"
import styles from "./WhyChooseUs.module.css"

type Reason = { title: [string, string]; icon: ReactNode; body: string; points: string[] }

const icon = (children: ReactNode) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {children}
    </svg>
)

const REASONS: Reason[] = [
    {
        title: ["Strategic", "Approach"],
        icon: icon(
            <>
                <circle cx="12" cy="12" r="9.5" />
                <circle cx="12" cy="12" r="5.5" />
                <circle cx="12" cy="12" r="1.6" fill="currentColor" />
            </>
        ),
        body: "Every project begins with research, business goals, and measurable outcomes. We build digital experiences that solve problems instead of simply looking attractive.",
        points: ["Business-first planning", "Data-driven decisions", "Long-term scalability"],
    },
    {
        title: ["Custom", "Solutions"],
        icon: icon(
            <>
                <path d="M12 2.5 20.5 7v10L12 21.5 3.5 17V7z" />
                <path d="M3.5 7 12 11.5 20.5 7M12 11.5v10" />
            </>
        ),
        body: "No templates and no one-size-fits-all. Every website, system and app is shaped around how your business actually works, so the technology fits you rather than the other way round.",
        points: ["Tailored to your workflow", "Integrates with your tools", "Flexible as you grow"],
    },
    {
        title: ["Modern", "Design"],
        icon: icon(
            <>
                <path d="M12 2.5 2.5 7.5 12 12.5l9.5-5z" />
                <path d="m2.5 12 9.5 5 9.5-5M2.5 16.5l9.5 5 9.5-5" />
            </>
        ),
        body: "Interfaces that feel current, considered and unmistakably yours. We design for clarity first, so every screen guides people toward what matters most.",
        points: ["Conversion-focused layouts", "Consistent brand systems", "Responsive on every screen"],
    },
    {
        title: ["Clean", "Code"],
        icon: icon(
            <>
                <path d="m8 6.5-5.5 5.5L8 17.5M16 6.5l5.5 5.5-5.5 5.5M14 4l-4 16" />
            </>
        ),
        body: "Readable, well-structured code that your team can build on. We follow proven standards so your product stays stable, secure and easy to extend for years.",
        points: ["Maintainable architecture", "Security best practices", "Documented and tested"],
    },
    {
        title: ["Performance", "Focused"],
        icon: icon(
            <>
                <path d="M4 20.5v-5M9.5 20.5v-8M15 20.5V9M20.5 20.5v-14" />
                <path d="M16.5 3.5h4v4M20.5 3.5 15 9" />
            </>
        ),
        body: "Fast pages keep visitors and rank higher. We tune every build for speed, from lean assets to smart caching, so your product feels instant on any connection.",
        points: ["Core Web Vitals optimised", "SEO-ready structure", "Lightweight, efficient builds"],
    },
    {
        title: ["Reliable", "Support"],
        icon: icon(
            <>
                <path d="M3.5 15h2.5a2 2 0 0 1 2 2v2.5a2 2 0 0 1-2 2h-.5a2 2 0 0 1-2-2V12a8.5 8.5 0 0 1 17 0v7.5a2 2 0 0 1-2 2H18a2 2 0 0 1-2-2V17a2 2 0 0 1 2-2h2.5" />
            </>
        ),
        body: "We don't disappear after launch. From quick fixes to new features, you get a team that knows your product and responds when you need us.",
        points: ["Responsive communication", "Ongoing maintenance", "Updates and monitoring"],
    },
]

const N = REASONS.length
const STEP = 360 / N

// Dial geometry, in SVG units (viewBox −300…300)
const R_OUT = 286
const R_IN = 110
const GAP = 8

const pt = (r: number, deg: number) => {
    const a = (deg * Math.PI) / 180
    return `${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`
}

/** An annular sector centred on `mid` degrees, trimmed so the gaps either side keep a constant width. */
function sector(mid: number, rOut = R_OUT) {
    const to = (Math.asin(GAP / 2 / rOut) * 180) / Math.PI
    const ti = (Math.asin(GAP / 2 / R_IN) * 180) / Math.PI
    const a0 = mid - STEP / 2,
        a1 = mid + STEP / 2
    return [
        `M ${pt(rOut, a0 + to)}`,
        `A ${rOut} ${rOut} 0 0 1 ${pt(rOut, a1 - to)}`,
        `L ${pt(R_IN, a1 - ti)}`,
        `A ${R_IN} ${R_IN} 0 0 0 ${pt(R_IN, a0 + ti)}`,
        "Z",
    ].join(" ")
}

const pad = (n: number) => String(n).padStart(2, "0")

const clamp = (x: number, a: number, b: number) => Math.min(Math.max(x, a), b)
const smoothstep = (a: number, b: number, x: number) => {
    const t = clamp((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)
}

export default function WhyChooseUs() {
    const trackRef = useRef<HTMLDivElement>(null)
    const dialRef = useRef<HTMLDivElement>(null)
    const [active, setActive] = useState(0)
    const [hover, setHover] = useState<number | null>(null)

    // The section pins while the page scrolls through it. The dial follows
    // the scroll continuously: it rests on each feature for the middle of its
    // slice, eases round to the next between slices, and is damped so a
    // flick of the wheel glides instead of jumping.
    useEffect(() => {
        const track = trackRef.current
        const dial = dialRef.current
        if (!track || !dial) return
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        let raf = 0,
            last = 0,
            target = 0,
            cur = 0,
            shown = -1

        const read = () => {
            const r = track.getBoundingClientRect()
            const total = r.height - window.innerHeight
            const p = total > 0 ? clamp(-r.top / total, 0, 1) : 0
            const s = clamp(p * N - 0.5, 0, N - 1)
            const base = Math.floor(s)
            const v = base + smoothstep(0.3, 0.7, s - base)
            return reduce ? Math.round(v) : v
        }
        const apply = (v: number) => {
            dial.style.setProperty("--rot", `${(v * STEP).toFixed(3)}deg`)
            const a = Math.round(v)
            if (a !== shown) {
                // a tap as the wheel clicks onto the next point (not when it's first
                // placed, nor while it catches up off screen after a jump down the page)
                if (shown !== -1) {
                    const r = track.getBoundingClientRect()
                    if (r.bottom > 60 && r.top < window.innerHeight - 60) haptic()
                }
                shown = a
                setActive(a)
            }
        }
        const tick = (now: number) => {
            const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60
            last = now
            cur += (target - cur) * (1 - Math.exp(-dt / 0.16))
            if (Math.abs(target - cur) < 0.0005) {
                cur = target
                raf = 0
                last = 0
            } else raf = requestAnimationFrame(tick)
            apply(cur)
        }
        const onScroll = () => {
            target = read()
            if (reduce) {
                cur = target
                apply(cur)
            } else if (!raf) raf = requestAnimationFrame(tick)
        }

        cur = target = read()
        apply(cur)
        window.addEventListener("scroll", onScroll, { passive: true })
        window.addEventListener("resize", onScroll)
        return () => {
            if (raf) cancelAnimationFrame(raf)
            window.removeEventListener("scroll", onScroll)
            window.removeEventListener("resize", onScroll)
        }
    }, [])

    // Picking a segment scrolls to its slice, so scroll and dial never disagree.
    const goTo = useCallback((i: number) => {
        const track = trackRef.current
        if (!track) return
        const r = track.getBoundingClientRect()
        const total = r.height - window.innerHeight
        const top = window.scrollY + r.top + ((i + 0.5) / N) * total
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" })
    }, [])


    return (
        <section id="why" className={styles.section} aria-labelledby="why-title">
            <div ref={trackRef} className={styles.track} style={{ ["--steps" as string]: N }}>
                <div className={styles.stage}>
                    <header className={styles.head}>
                        <h2 id="why-title" className={styles.title}>
                            Why Choose Us.
                        </h2>
                    </header>

                    <div className={styles.body}>
                        <div ref={dialRef} className={styles.dial}>
                            <svg className={styles.ring} viewBox="-300 -300 600 600" aria-hidden="true">
                                {REASONS.map((r, i) => (
                                    <path
                                        key={r.title.join(" ")}
                                        d={sector(-i * STEP)}
                                        className={styles.seg}
                                        data-hover={hover === i && i !== active}
                                        onClick={() => goTo(i)}
                                        onMouseEnter={() => setHover(i)}
                                        onMouseLeave={() => setHover(null)}
                                    />
                                ))}
                            </svg>

                            {/* the fixed stop each feature turns into, like the finger stop on a rotary phone */}
                            <svg className={styles.slot} viewBox="-300 -300 600 600" aria-hidden="true">
                                <path d={sector(0, R_OUT + 14)} />
                            </svg>

                            <div className={styles.labels}>
                                {REASONS.map((r, i) => (
                                    <button
                                        key={r.title.join(" ")}
                                        type="button"
                                        className={styles.label}
                                        style={{ ["--a" as string]: `${-i * STEP}deg` }}
                                        data-active={i === active}
                                        data-hover={hover === i && i !== active}
                                        aria-current={i === active ? "step" : undefined}
                                        onClick={() => goTo(i)}
                                        onMouseEnter={() => setHover(i)}
                                        onMouseLeave={() => setHover(null)}
                                        onFocus={() => setHover(i)}
                                        onBlur={() => setHover(null)}
                                    >
                                        <span className={styles.labelInner}>
                                            <span className={styles.labelTop}>
                                                <span className={styles.num}>{pad(i + 1)}</span>
                                                <span className={styles.labelIcon}>{r.icon}</span>
                                            </span>
                                            <span className={styles.labelText}>
                                                {r.title[0]}
                                                <br />
                                                {r.title[1]}
                                            </span>
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <div className={styles.hub}>
                                <Logo className={styles.hubLogo} />
                                <span>PIXIE WEBS</span>
                            </div>
                        </div>

                        {/* every feature's content sits stacked in one cell, so the card
                            keeps the tallest height and the swap is a pure crossfade */}
                        <article className={styles.card} aria-live="polite">
                            {REASONS.map((item, i) => (
                                <div
                                    key={item.title.join(" ")}
                                    className={styles.pane}
                                    data-state={i === active ? "active" : i < active ? "before" : "after"}
                                    aria-hidden={i !== active}
                                >
                                    <div className={styles.cardHead} style={{ ["--i" as string]: 0 }}>
                                        <span className={styles.cardIcon}>{item.icon}</span>
                                        <h3 className={styles.cardTitle}>{item.title.join(" ")}</h3>
                                    </div>
                                    <p className={styles.cardBody} style={{ ["--i" as string]: 1 }}>
                                        {item.body}
                                    </p>
                                    <ul className={styles.points} style={{ ["--i" as string]: 2 }}>
                                        {item.points.map((p) => (
                                            <li key={p}>{p}</li>
                                        ))}
                                    </ul>
                                    <footer className={styles.cardFoot} style={{ ["--i" as string]: 3 }}>
                                        <span>{item.title.join(" ")}</span>
                                        <span className={styles.count}>
                                            {pad(i + 1)} / {pad(N)}
                                        </span>
                                    </footer>
                                </div>
                            ))}
                        </article>
                    </div>
                </div>
            </div>
        </section>
    )
}
