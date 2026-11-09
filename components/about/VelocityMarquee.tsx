"use client"

import { useRef } from "react"
import {
    motion,
    useAnimationFrame,
    useMotionValue,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
    useVelocity,
    wrap,
} from "motion/react"

/**
 * A line of words running sideways forever, that speeds up while the page
 * scrolls and flips direction when the scroll does. Two copies sit side by
 * side so the loop never shows a seam. Still for visitors who ask for less motion.
 */
export default function VelocityMarquee({
    items,
    speed = 2.2,
    reverse,
    className,
    itemClassName,
    dotClassName,
}: {
    items: string[]
    /** percent of one copy's width per second at rest */
    speed?: number
    reverse?: boolean
    className?: string
    itemClassName?: string
    dotClassName?: string
}) {
    const reduce = useReducedMotion()
    const base = useMotionValue(0)
    const { scrollY } = useScroll()
    const velocity = useVelocity(scrollY)
    const smooth = useSpring(velocity, { damping: 50, stiffness: 400 })
    // a fast scroll adds up to about 5x the resting speed
    const boost = useTransform(smooth, [-1500, 0, 1500], [-5, 0, 5], { clamp: false })
    const dir = useRef(reverse ? -1 : 1)
    const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`)

    useAnimationFrame((_, delta) => {
        if (reduce) return
        const b = boost.get()
        if (b < 0) dir.current = reverse ? 1 : -1
        else if (b > 0) dir.current = reverse ? -1 : 1
        // half the track is one copy, so -50% → 0% is one full loop
        const step = dir.current * (speed / 2) * (delta / 1000) * (1 + Math.abs(b))
        base.set(base.get() - step)
    })

    const copy = (key: number) => (
        <span key={key} className={itemClassName} aria-hidden={key > 0 || undefined}>
            {items.map((it) => (
                <span key={it}>
                    {it}
                    <i className={dotClassName} aria-hidden="true" />
                </span>
            ))}
        </span>
    )

    return (
        <div className={className}>
            <motion.div style={{ x, display: "flex", width: "max-content" }}>{[0, 1].map(copy)}</motion.div>
        </div>
    )
}
