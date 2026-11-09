"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion, type PanInfo } from "motion/react"
import styles from "./Testimonials.module.css"

type Testimonial = { quote: string; name: string; role: string }

/*
 * Client testimonials. The clients are real and agreed to be featured; the
 * wording was drafted for them from the work we did, so check each quote with
 * its client before launch. `role` is shown under the name (here, the company).
 */
const TESTIMONIALS: Testimonial[] = [
    {
        quote: "Our new store finally looks as good as our gear. It's fast on mobile, easy for us to manage, and customers keep telling us how smooth checkout feels.",
        name: "Shreya",
        role: "Moven Active",
    },
    {
        quote: "Pixie Webs captured the feel of our studio perfectly. Brides now find us online, browse our collections and reach out before they even visit.",
        name: "Aneesh Mangalath",
        role: "Ondezyn",
    },
    {
        quote: "They matched the energy of our gym exactly. The site is bold and quick, and sign-ups for our programs have gone up since it launched.",
        name: "Abhijith Krishnan",
        role: "Rogue Ninja Fight Club",
    },
    {
        quote: "As an exporter we needed to look credible to buyers abroad. The new site presents our products clearly and brings in genuine international enquiries.",
        name: "Rahul Chandran",
        role: "Zenvitaa Exports",
    },
    {
        quote: "The team understood our business without us having to over-explain. Our site now sets out our services clearly and looks every bit the global operation we are.",
        name: "Abhinav",
        role: "Sri Sai Shipping Agencies",
    },
    {
        quote: "Elegant, calm and just like walking into our spa. Clients love browsing our services online, and working with Pixie Webs was easy from start to finish.",
        name: "Prem Kollanoor",
        role: "Trishika Saloon & Wellness Spa",
    },
    {
        quote: "Our fragrance store feels premium from the very first click. Pixie Webs handled everything from design to launch and were always quick to respond.",
        name: "Basim Rasheed",
        role: "Boss Perfumes",
    },
    {
        quote: "Clear communication, sharp design and delivery right on time. Pixie Webs turned our idea into a platform our users find simple and trustworthy.",
        name: "Anshaan",
        role: "Curefully",
    },
]

const N = TESTIMONIALS.length
/** how long each quote holds before the next slides in */
const HOLD_MS = 4500
const EASE = [0.22, 0.8, 0.24, 1] as const

const initials = (name: string) =>
    name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()

/**
 * Where a card sits for its place in the deck: the front card, two behind it
 * peeking out to the right, and the one just shown sliding off to the left.
 */
function placeFor(offset: number) {
    if (offset === 0) return { x: "0%", scale: 1, opacity: 1 }
    if (offset === N - 1) return { x: "-14%", scale: 0.94, opacity: 0 }
    if (offset <= 2) return { x: `${offset * 12}%`, scale: 1 - offset * 0.06, opacity: offset === 1 ? 0.55 : 0.25 }
    return { x: "34%", scale: 0.82, opacity: 0 }
}

function Arrow() {
    return (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
    )
}

function QuoteMark() {
    return (
        <svg viewBox="0 0 33 24" fill="currentColor" aria-hidden="true" className={styles.mark}>
            <path d="M0 24V14.4C0 6.6 4.2 1.8 12.6 0l1.5 3.6C9.6 5 7.3 7.6 7.1 11.4H13V24H0Zm18.9 0V14.4C18.9 6.6 23.1 1.8 31.5 0L33 3.6c-4.5 1.4-6.8 4-7 7.8H32V24H18.9Z" />
        </svg>
    )
}

/**
 * Testimonials, in the dark band that runs on from Our Work: a two-tone title
 * on the left, and on the right a deck of frosted quote cards that slides on
 * to the next quote every few seconds, all the time it's on screen. The arrow
 * beside the deck, a swipe or a drag skip ahead by hand. It holds still off
 * screen and for anyone who asks for less motion.
 */
export default function Testimonials() {
    const ref = useRef<HTMLElement>(null)
    const [active, setActive] = useState(0)
    const [onScreen, setOnScreen] = useState(false)
    const [reduce, setReduce] = useState(false)

    const go = useCallback((step: number) => setActive((a) => (a + step + N) % N), [])

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.35 })
        io.observe(el)
        return () => io.disconnect()
    }, [])

    useEffect(() => {
        setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    }, [])

    // Each quote holds for HOLD_MS, then the next slides in. Any move, by the
    // timer or by hand, starts the next hold from zero.
    useEffect(() => {
        if (!onScreen || reduce) return
        const t = window.setTimeout(() => go(1), HOLD_MS)
        return () => window.clearTimeout(t)
    }, [active, onScreen, reduce, go])

    const onDragEnd = (_: unknown, info: PanInfo) => {
        if (info.offset.x < -60 || info.velocity.x < -400) go(1)
        else if (info.offset.x > 60 || info.velocity.x > 400) go(-1)
    }

    return (
        <section
            id="testimonials"
            ref={ref}
            className={styles.section}
            aria-labelledby="testimonials-title"
            aria-roledescription="carousel"
        >
            <div className={styles.inner}>
                <div className={styles.head}>
                    <h2 id="testimonials-title" className={styles.title}>
                        <span>What our</span>
                        <em>clients say.</em>
                    </h2>
                    <p className={styles.lede}>
                        Businesses that trusted us with their websites, stores, systems and apps, in their own words.
                    </p>
                </div>

                <div className={styles.stageRow}>
                    <div className={styles.stage}>
                        {TESTIMONIALS.map((t, i) => {
                            const offset = (i - active + N) % N
                            const front = offset === 0
                            return (
                                <motion.div
                                    key={i}
                                    className={styles.card}
                                    role="group"
                                    aria-roledescription="slide"
                                    aria-label={`${i + 1} of ${N}`}
                                    aria-hidden={!front}
                                    initial={false}
                                    animate={placeFor(offset)}
                                    transition={{ duration: 0.7, ease: EASE }}
                                    style={{ zIndex: N - offset, pointerEvents: front ? "auto" : "none" }}
                                    drag={front ? "x" : false}
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={0.25}
                                    onDragEnd={onDragEnd}
                                >
                                    <div className={styles.cardTop}>
                                        <QuoteMark />
                                    </div>
                                    {/* the slide is a group; the quote and its author keep their figure */}
                                    <figure style={{ display: "contents" }}>
                                    <blockquote className={styles.quote}>{t.quote}</blockquote>
                                    <figcaption className={styles.who}>
                                        <span className={styles.avatar} aria-hidden="true">
                                            {initials(t.name)}
                                        </span>
                                        <span>
                                            <span className={styles.name}>{t.name}</span>
                                            <span className={styles.role}>{t.role}</span>
                                        </span>
                                    </figcaption>
                                    </figure>
                                </motion.div>
                            )
                        })}
                    </div>

                    {/* skips to the next quote, beside the deck */}
                    <button type="button" className={styles.next} onClick={() => go(1)} aria-label="Next testimonial">
                        <Arrow />
                    </button>
                </div>
            </div>
        </section>
    )
}
