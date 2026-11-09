"use client"

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { haptic } from "@/lib/haptics"
import Image from "next/image"
import styles from "./Services.module.css"

type Service = {
    name: string
    /** short label for the progress meter */
    tag: string
    /** headline: white first line, silver-gradient second line */
    title: [string, string]
    body: string
    includes: string[]
    image: string
    /** where the photo's subject sits, as a fraction of its width */
    focus: number
}

const SERVICES: Service[] = [
    {
        name: "Web Design & Development",
        tag: "Web",
        title: ["Web Design &", "Development."],
        body: "Modern, responsive websites and scalable web applications designed for performance and usability.",
        includes: ["Website Design", "Web Development", "UI/UX Design"],
        image: "/services/website.webp",
        focus: 0.53,
    },
    {
        name: "E-Commerce Solutions",
        tag: "E-Commerce",
        title: ["E-Commerce", "Solutions."],
        body: "Powerful online stores built to simplify shopping experiences and drive business growth.",
        includes: ["WooCommerce", "Shopify", "Custom E-Commerce"],
        image: "/services/ecommerce.webp",
        focus: 0.52,
    },
    {
        name: "ERP & CRM Solutions",
        tag: "ERP & CRM",
        title: ["ERP & CRM", "Solutions."],
        body: "Custom business management systems that streamline operations, workflows and customer relationships.",
        includes: ["ERP", "CRM", "Business Automation", "Custom Management Systems"],
        image: "/services/erp.webp",
        focus: 0.58,
    },
    {
        name: "Mobile App Development",
        tag: "Mobile",
        title: ["Mobile App", "Development."],
        body: "Feature-rich mobile applications built for seamless experiences across Android and iOS.",
        includes: ["Android Apps", "iOS Apps", "Cross-platform Apps"],
        image: "/services/apps.webp",
        focus: 0.525,
    },
    {
        name: "Digital Growth & Support",
        tag: "Growth",
        title: ["Digital Growth", "& Support."],
        body: "Improve online visibility, maintain performance and keep your digital platforms running smoothly.",
        includes: ["SEO Optimization", "Maintenance", "Technical Support"],
        image: "/services/digital-growth.webp",
        focus: 0.63,
    },
]

const icon = (children: ReactNode) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {children}
    </svg>
)

const phone = (
    <>
        <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
        <path d="M10.5 18.5h3" />
    </>
)

const ICONS: Record<string, ReactNode> = {
    "Website Design": icon(
        <>
            <rect x="2.5" y="3.5" width="19" height="13" rx="2" />
            <path d="M8 20.5h8M12 16.5v4" />
        </>
    ),
    "Web Development": icon(<path d="m8 6.5-5.5 5.5L8 17.5M16 6.5l5.5 5.5-5.5 5.5" />),
    "UI/UX Design": icon(
        <>
            <path d="M12 2.5 2.5 7.5 12 12.5l9.5-5z" />
            <path d="m2.5 12 9.5 5 9.5-5M2.5 16.5l9.5 5 9.5-5" />
        </>
    ),
    WooCommerce: icon(
        <>
            <circle cx="9" cy="20" r="1.4" />
            <circle cx="18" cy="20" r="1.4" />
            <path d="M2.5 3.5h3l2.4 11.2a1.5 1.5 0 0 0 1.5 1.3h8.7a1.5 1.5 0 0 0 1.5-1.2L21 7H6.2" />
        </>
    ),
    Shopify: icon(
        <>
            <path d="M5 7.5h14l-1 13H6z" />
            <path d="M9 7.5V6a3 3 0 0 1 6 0v1.5" />
        </>
    ),
    "Custom E-Commerce": icon(
        <>
            <path d="M3.5 9.5 5 4h14l1.5 5.5" />
            <path d="M3.5 9.5a2.8 2.8 0 0 0 5.6 0 2.9 2.9 0 0 0 5.8 0 2.8 2.8 0 0 0 5.6 0" />
            <path d="M5 12.5V20h14v-7.5M10 20v-4.5h4V20" />
        </>
    ),
    ERP: icon(
        <>
            <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
            <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
            <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
            <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
        </>
    ),
    CRM: icon(
        <>
            <circle cx="9" cy="8" r="3.5" />
            <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.2a6.5 6.5 0 0 1 3.5 5.8" />
        </>
    ),
    "Business Automation": icon(<path d="M13 2.5 4.5 13.5H12l-1 8 8.5-11H12z" />),
    "Custom Management Systems": icon(
        <>
            <path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1" />
            <circle cx="15" cy="6" r="2" />
            <circle cx="9" cy="12" r="2" />
            <circle cx="17" cy="18" r="2" />
        </>
    ),
    "Android Apps": icon(phone),
    "iOS Apps": icon(
        <>
            {phone}
            <path d="M10 5h4" />
        </>
    ),
    "Cross-platform Apps": icon(
        <>
            <rect x="2.5" y="5" width="13" height="10" rx="1.5" />
            <path d="M5.5 18.5h7" />
            <rect x="16.5" y="8.5" width="5" height="11" rx="1.2" />
        </>
    ),
    "SEO Optimization": icon(
        <>
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m15.5 15.5 5 5M7.5 12l2-2 1.5 1.5 2.5-3" />
        </>
    ),
    Maintenance: icon(
        <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3.5 17.5a1.8 1.8 0 0 0 2.5 2.5l5.8-5.8a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z" />
    ),
    "Technical Support": icon(
        <path d="M3.5 15h2.5a2 2 0 0 1 2 2v2.5a2 2 0 0 1-2 2h-.5a2 2 0 0 1-2-2V12a8.5 8.5 0 0 1 17 0v7.5a2 2 0 0 1-2 2H18a2 2 0 0 1-2-2V17a2 2 0 0 1 2-2h2.5" />
    ),
}

const pad = (n: number) => String(n).padStart(2, "0")

function Arrow() {
    return (
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function Play() {
    return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M5.5 3.6v8.8L12.4 8z" fill="currentColor" />
        </svg>
    )
}

/** When the band pins and the scroll steps through the services: side by side
    on wide screens, and on phones and tablets tall enough (600px+) for the
    compact stacked layout to fit one screen. Short landscape phones scroll
    normally and tap to pick. Matches the media queries in Services.module.css. */
const PIN_QUERY = "(min-width: 901px), (min-height: 600px)"

export default function Services() {
    const trackRef = useRef<HTMLDivElement>(null)
    const ref = useRef<HTMLElement>(null)
    const [active, setActive] = useState(0)
    const [inView, setInView] = useState(false)
    // pinned: the band holds the screen while the page scrolls through one slice
    // per service. Otherwise (phones) a tap picks the service.
    const [pinned, setPinned] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const reveal = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) setInView(true)
            },
            { threshold: 0.3 }
        )
        reveal.observe(el)
        return () => reveal.disconnect()
    }, [])

    useEffect(() => {
        const mq = window.matchMedia(PIN_QUERY)
        const sync = () => setPinned(mq.matches)
        sync()
        mq.addEventListener("change", sync)
        return () => mq.removeEventListener("change", sync)
    }, [])

    // Pinned: the scroll position through the track picks the service.
    useEffect(() => {
        const track = trackRef.current
        if (!pinned || !track) return
        // one rect read per scroll event; setActive with the same index is a no-op
        let shown: number | null = null
        const read = () => {
            const r = track.getBoundingClientRect()
            const total = r.height - window.innerHeight
            const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0
            const i = Math.min(SERVICES.length - 1, Math.floor(p * SERVICES.length))
            // a tap as the scroll moves onto the next service (not on the first read,
            // nor when a jump down the page skips past the section)
            if (shown !== null && i !== shown && r.bottom > 60 && r.top < window.innerHeight - 60) haptic()
            shown = i
            setActive(i)
        }
        read()
        window.addEventListener("scroll", read, { passive: true })
        window.addEventListener("resize", read)
        return () => {
            window.removeEventListener("scroll", read)
            window.removeEventListener("resize", read)
        }
    }, [pinned])

    // Stacked: a picked service holds until the band scrolls away, then it's
    // back to the first.
    useEffect(() => {
        const el = ref.current
        if (pinned || !el) return
        const away = new IntersectionObserver(([e]) => {
            if (!e.isIntersecting) setActive(0)
        })
        away.observe(el)
        return () => away.disconnect()
    }, [pinned])

    // Pinned, picking a service scrolls to the middle of its slice, so the
    // scroll and the list never disagree.
    const pick = useCallback(
        (i: number) => {
            const track = trackRef.current
            if (!pinned || !track) return setActive(i)
            const r = track.getBoundingClientRect()
            const total = r.height - window.innerHeight
            const top = window.scrollY + r.top + ((i + 0.5) / SERVICES.length) * total
            const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
            window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" })
        },
        [pinned]
    )

    return (
        // the track gives the pinned band its scroll room: one slice per service
        <div id="services" ref={trackRef} className={styles.scroller} style={{ ["--n" as string]: SERVICES.length }}>
            {/* while pinned, a stop in the middle of each service's slice of the
                track; on touch screens one swipe moves one service (ScrollSteps) */}
            {pinned && SERVICES.map((sv, i) => (
                <span
                    key={sv.image}
                    data-scroll-stop
                    className={styles.stop}
                    style={{ top: `calc(${(((i + 0.5) / SERVICES.length) * (SERVICES.length - 1) * 70).toFixed(2)}svh)` }}
                    aria-hidden="true"
                />
            ))}
        <section ref={ref} className={styles.section} data-inview={inView} aria-label="Our services">
            {/* the photo is the section's background: a blurred copy fills it, the sharp
                one sits large between the copy and the list and fades into it */}
            <div className={styles.bg} aria-hidden="true">
                {SERVICES.map((s, i) => (
                    <div key={s.image} className={styles.frame} data-on={i === active} style={{ ["--fx" as string]: s.focus }}>
                        <div className={styles.ambient}>
                            <Image src={s.image} alt="" fill sizes="50vw" className={styles.photo} />
                        </div>
                        <div className={styles.sharp}>
                            <Image src={s.image} alt="" fill sizes="(max-width: 900px) 100vw, 75vw" className={styles.photo} />
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.shade} aria-hidden="true" />

            <div className={styles.inner}>
                <div className={styles.left}>
                    {/* every service's copy stacks in one cell and crossfades */}
                    <div className={`${styles.copy} ${styles.reveal}`} style={{ ["--d" as string]: 1 }} aria-live="polite">
                        {SERVICES.map((s, i) => (
                            <div
                                key={s.name}
                                className={styles.pane}
                                data-state={i === active ? "active" : i < active ? "before" : "after"}
                                aria-hidden={i !== active}
                            >
                                <h2 className={styles.title} style={{ ["--i" as string]: 0 }}>
                                    <span>{s.title[0]}</span>
                                    <em>{s.title[1]}</em>
                                </h2>
                                <p className={styles.body} style={{ ["--i" as string]: 1 }}>
                                    {s.body}
                                </p>
                                <ul className={styles.includes} style={{ ["--i" as string]: 2 }} aria-label="Includes">
                                    {s.includes.map((x) => (
                                        <li key={x}>
                                            {ICONS[x]}
                                            {x}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className={`${styles.ctas} ${styles.reveal}`} style={{ ["--d" as string]: 2 }}>
                        <a href="/contact" className={styles.pill}>
                            Discuss Your Project
                            <span className={styles.pillIcon}>
                                <Arrow />
                            </span>
                        </a>
                        <a href="#work" className={styles.watch}>
                            <span className={styles.watchIcon}>
                                <Play />
                            </span>
                            View Our Work
                        </a>
                    </div>
                </div>

                <ul className={styles.list}>
                    {SERVICES.map((s, i) => (
                        <li key={s.name} className={styles.reveal} style={{ ["--d" as string]: 1 + i * 0.5 }}>
                            <button
                                type="button"
                                className={styles.row}
                                data-active={i === active}
                                aria-pressed={i === active}
                                // hover and focus preview only when nothing is pinned; pinned,
                                // the scroll is in charge and a click scrolls to the service
                                onMouseEnter={pinned ? undefined : () => setActive(i)}
                                onFocus={pinned ? undefined : () => setActive(i)}
                                onClick={() => pick(i)}
                            >
                                <span className={styles.num}>{pad(i + 1)}</span>
                                <span className={styles.name}>{s.name}</span>
                                <span className={styles.rowArrow}>
                                    <Arrow />
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className={`${styles.meter} ${styles.reveal}`} style={{ ["--d" as string]: 4 }} aria-hidden="true">
                <span>{pad(active + 1)}</span>
                <span className={styles.track}>
                    <span className={styles.fill} style={{ ["--p" as string]: (active + 1) / SERVICES.length }} />
                </span>
                {/* every label stacks in one cell, so the meter keeps the width of the
                    longest and the number and bar never shift as the label changes */}
                <span className={styles.tags}>
                    {SERVICES.map((s, i) => (
                        <span key={s.tag} data-on={i === active}>
                            Services → {s.tag}
                        </span>
                    ))}
                </span>
            </div>
        </section>
        </div>
    )
}
