"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion, type PanInfo } from "motion/react"
import styles from "./Testimonials.module.css"

type Testimonial = { quote: string; name: string; role: string }

/*
 * PLACEHOLDER TESTIMONIALS — replace every entry with a real quote from a real
 * client (and their permission) before the site goes live. These are sample
 * wording only, so the layout can be seen; they must not be published as genuine.
 */
const TESTIMONIALS: Testimonial[] = [
    {
        quote: "Pixie Webs rebuilt our website from the ground up. It loads fast, looks premium, and enquiries have picked up since launch.",
        name: "Client Name",
        role: "Founder, Travel Company",
    },
    {
        quote: "They understood our brand from the first call. The new site finally feels like the experience we give our guests.",
        name: "Client Name",
        role: "Director, Hospitality Brand",
    },
    {
        quote: "Our online store is easier to manage and far easier to shop. The team was quick, clear and always available.",
        name: "Client Name",
        role: "Owner, Retail Brand",
    },
    {
        quote: "The custom CRM replaced three spreadsheets and a lot of phone calls. Our team actually enjoys using it.",
        name: "Client Name",
        role: "Operations Head, Trading Company",
    },
    {
        quote: "From design to launch, every step was explained. We always knew what was happening and what came next.",
        name: "Client Name",
        role: "Managing Partner, Events Venue",
    },
    {
        quote: "They took our rough idea and turned it into an app our customers use every day. Support after launch has been excellent.",
        name: "Client Name",
        role: "Co-founder, Fitness Brand",
    },
]

const N = TESTIMONIALS.length
/** how long each quote holds before the next slides in */
const HOLD_MS = 4500
const EASE = [0.22, 0.8, 0.24, 1] as const
const pad = (n: number) => String(n).padStart(2, "0")

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
                                <motion.figure
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
                                        <span className={styles.cardNum}>
                                            {pad(i + 1)} / {pad(N)}
                                        </span>
                                    </div>
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
                                </motion.figure>
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
