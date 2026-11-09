"use client"

import { useRef, useState, type ReactNode } from "react"
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react"
import styles from "./HeroStack.module.css"

/**
 * The hero stays put while the section after it scrolls up over it, like a
 * card laid on top. As it's covered the hero sinks back a little (shrinks),
 * and once it's fully hidden it stops being drawn, so its orb and
 * particles cost nothing behind the page.
 */
export default function HeroStack({ hero, children }: { hero: ReactNode; children: ReactNode }) {
    const overRef = useRef<HTMLDivElement>(null)
    const reduce = useReducedMotion()
    // 0 as the next section's top enters at the bottom of the screen, 1 once it reaches the top
    const { scrollYProgress } = useScroll({ target: overRef, offset: ["start end", "start start"] })
    const scale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.94])
    const [covered, setCovered] = useState(false)
    useMotionValueEvent(scrollYProgress, "change", (v) => {
        const now = v >= 0.999
        if (now === covered) return
        setCovered(now)
        // tells the hero's sphere and orb to rest while they're hidden (and wake after)
        document.documentElement.dataset.heroCovered = String(now)
        window.dispatchEvent(new CustomEvent("pixie:hero", { detail: { covered: now } }))
    })

    return (
        <div className={styles.stack}>
            <div className={styles.pin} style={{ visibility: covered ? "hidden" : "visible" }}>
                <motion.div className={styles.hero} style={{ scale }}>
                    {hero}
                </motion.div>
            </div>
            <div ref={overRef} className={styles.over}>
                {children}
            </div>
        </div>
    )
}
