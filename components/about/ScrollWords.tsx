"use client"

import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react"

/** one word, dim until the scroll reaches its slice of the paragraph */
function Word({ children, progress, range, strong }: { children: string; progress: MotionValue<number>; range: [number, number]; strong?: boolean }) {
    const opacity = useTransform(progress, range, [0.16, 1])
    return (
        <motion.span style={{ opacity }} data-strong={strong || undefined}>
            {children}
        </motion.span>
    )
}

/**
 * A paragraph that lights up word by word as it scrolls through the screen,
 * from dim silver to full white. Words wrapped in *asterisks* in the text are
 * set bold. Shown fully lit for visitors who ask for less motion.
 */
export default function ScrollWords({ text, className }: { text: string; className?: string }) {
    const ref = useRef<HTMLParagraphElement>(null)
    const reduce = useReducedMotion()
    // lit from when its top is low on the screen until its foot is a little above the middle
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] })
    const words = text.split(" ")

    if (reduce) {
        return (
            <p className={className}>
                {words.map((w, i) => (
                    <span key={i} data-strong={w.startsWith("*") || undefined}>
                        {w.replace(/\*/g, "")}{" "}
                    </span>
                ))}
            </p>
        )
    }

    return (
        <p ref={ref} className={className}>
            {words.map((w, i) => (
                <span key={i}>
                    <Word progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} strong={w.startsWith("*")}>
                        {w.replace(/\*/g, "")}
                    </Word>{" "}
                </span>
            ))}
        </p>
    )
}
