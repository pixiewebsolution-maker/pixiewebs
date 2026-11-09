"use client"

import { useEffect } from "react"
import Lenis from "lenis"
import "lenis/dist/lenis.css"

/**
 * Smooth scrolling (Lenis) for mouse wheels and trackpads: each wheel step
 * glides instead of jumping. Phones and tablets keep their own touch scrolling,
 * which is already smooth and is where the scroll stops (scroll-snap) live, so
 * it's left off on narrow or touch screens. Also off for visitors who ask for
 * less motion.
 */
export default function SmoothScroll() {
    useEffect(() => {
        const mq = window.matchMedia("(min-width: 901px) and (pointer: fine) and (prefers-reduced-motion: no-preference)")
        let lenis: Lenis | null = null
        const sync = () => {
            if (mq.matches && !lenis) {
                lenis = new Lenis({
                    // how quickly it catches up to the wheel: lower is softer
                    lerp: 0.1,
                    // in-page links (like /#services) glide there too
                    anchors: true,
                    autoRaf: true,
                })
            } else if (!mq.matches && lenis) {
                lenis.destroy()
                lenis = null
            }
        }
        sync()
        mq.addEventListener("change", sync)
        return () => {
            mq.removeEventListener("change", sync)
            lenis?.destroy()
        }
    }, [])
    return null
}
