"use client"

import { useEffect, useRef } from "react"
import { motion } from "motion/react"
import styles from "./FinalCta.module.css"

/** "Start a Project" opens the contact page and its form */
const START_HREF = "/contact"

const EASE = [0.22, 0.8, 0.24, 1] as const

function Arrow() {
    return (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
        </svg>
    )
}

/** one line of the heading, rising out of its own mask (the mask watches the scroll) */
function Line({ children, delay, em }: { children: string; delay: number; em?: boolean }) {
    const Tag = em ? motion.em : motion.span
    return (
        <motion.span className={styles.line} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.5 }}>
            <Tag variants={{ hidden: { y: "105%" }, shown: { y: "0%" } }} transition={{ duration: 0.9, delay, ease: EASE }}>
                {children}
            </Tag>
        </motion.span>
    )
}

/**
 * The closing call to action: a deep black card in the dark band. On its right,
 * silver blinds catch a soft light that follows the pointer (and drifts on
 * its own when the pointer is away); the heading, a line and two buttons sit
 * on the left.
 */
export default function FinalCta() {
    const cardRef = useRef<HTMLDivElement>(null)

    // The light: eased toward the pointer while it's over the card, otherwise
    // drifting in a slow loop. Runs only while the card is on screen.
    useEffect(() => {
        const card = cardRef.current
        if (!card) return
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        let raf = 0
        let last = 0
        let t = 0
        let cx = 0.7
        let cy = 0.45
        let target: { x: number; y: number } | null = null

        const set = () => {
            card.style.setProperty("--mx", `${(cx * 100).toFixed(2)}%`)
            card.style.setProperty("--my", `${(cy * 100).toFixed(2)}%`)
        }
        const tick = (now: number) => {
            const dt = last ? Math.min(0.05, (now - last) / 1000) : 0
            last = now
            t += dt
            const goal = target ?? { x: 0.7 + Math.sin(t * 0.35) * 0.16, y: 0.45 + Math.sin(t * 0.5 + 1) * 0.22 }
            const k = 1 - Math.exp(-dt / (target ? 0.12 : 0.6))
            cx += (goal.x - cx) * k
            cy += (goal.y - cy) * k
            set()
            raf = requestAnimationFrame(tick)
        }
        const onMove = (e: PointerEvent) => {
            const r = card.getBoundingClientRect()
            target = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }
        }
        const onLeave = () => {
            target = null
        }

        set()
        if (reduce) return
        const io = new IntersectionObserver(([e]) => {
            if (e.isIntersecting && !raf) {
                last = 0
                raf = requestAnimationFrame(tick)
            } else if (!e.isIntersecting && raf) {
                cancelAnimationFrame(raf)
                raf = 0
            }
        })
        io.observe(card)
        card.addEventListener("pointermove", onMove)
        card.addEventListener("pointerleave", onLeave)
        return () => {
            io.disconnect()
            if (raf) cancelAnimationFrame(raf)
            card.removeEventListener("pointermove", onMove)
            card.removeEventListener("pointerleave", onLeave)
        }
    }, [])

    return (
        <section id="start" className={styles.section} aria-labelledby="cta-title">
            <motion.div
                ref={cardRef}
                className={styles.card}
                initial={{ opacity: 0, y: 40, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 1, ease: EASE }}
            >
                {/* the blinds and their light */}
                <div className={styles.blinds} aria-hidden="true">
                    <div className={styles.light} />
                    <div className={styles.slats} />
                </div>

                <div className={styles.content}>
                    <h2 id="cta-title" className={styles.title}>
                        <Line delay={0.1}>Let&rsquo;s build something</Line>
                        <Line delay={0.2} em>
                            worth talking about.
                        </Line>
                    </h2>
                    <motion.p
                        className={styles.text}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.8 }}
                        transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
                    >
                        Tell us about your business and what you want to build. We&rsquo;ll set up a quick call, then
                        follow up with a clear proposal.
                    </motion.p>
                    <motion.div
                        className={styles.actions}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.8 }}
                        transition={{ duration: 0.8, delay: 0.45, ease: EASE }}
                    >
                        <a href={START_HREF} className={styles.pill}>
                            Start a Project
                            <span className={styles.pillIcon}>
                                <Arrow />
                            </span>
                        </a>
                        <a href="#work" className={styles.ghost}>
                            View Our Work
                        </a>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    )
}
