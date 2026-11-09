"use client"

import { useEffect } from "react"

/**
 * One step per swipe, on touch screens, through the stretch of the home page
 * marked with [data-scroll-stop]: each service, each stage of Our Works, its
 * close, Testimonials and the FAQs.
 *
 * Inside that stretch a swipe doesn't scroll the page itself (so a fast flick
 * can't fly through several steps); when the finger lifts, the page glides to
 * the next stop in that direction. A flick coming in from outside the stretch
 * is caught at the first stop it reaches. Above the first stop and below the
 * last, the page scrolls normally.
 *
 * (The browser's own scroll-snap "stop" is only a hint that phones ignore on a
 * fast flick, hence this.)
 */
export default function ScrollSteps() {
    useEffect(() => {
        if (!window.matchMedia("(pointer: coarse)").matches) return
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

        const TOL = 6 // px: counts as "at" a stop
        const SWIPE = 28 // px: shorter moves stay put
        const GLIDE_MS = 650 // how long a step's glide is given before the next swipe counts

        let stops: number[] = []
        let touching = false
        let startY = 0
        let lastY = 0
        /** null: undecided; true: this swipe is a step; false: native scrolling */
        let stepping: boolean | null = null
        let gliding = false
        let glideTimer = 0
        let prevScroll = window.scrollY

        const collect = () =>
            [...document.querySelectorAll<HTMLElement>("[data-scroll-stop]")]
                .map((el) => Math.round(el.getBoundingClientRect().top + window.scrollY))
                .sort((a, b) => a - b)

        const glideTo = (y: number) => {
            gliding = true
            window.clearTimeout(glideTimer)
            window.scrollTo({ top: y, behavior: "smooth" })
            glideTimer = window.setTimeout(() => {
                gliding = false
                prevScroll = window.scrollY
            }, GLIDE_MS)
        }

        /** whether a swipe in this direction (1 down the page, -1 up) should step */
        const shouldStep = (dir: number) => {
            if (gliding) return true
            if (stops.length < 2) return false
            const y = window.scrollY
            const first = stops[0]
            const last = stops[stops.length - 1]
            if (y < first - TOL || y > last + TOL) return false
            // leaving the stretch: past the last stop downward, or above the first upward
            if (dir > 0 && y >= last - TOL) return false
            if (dir < 0 && y <= first + TOL) return false
            return true
        }

        const onStart = (e: TouchEvent) => {
            touching = true
            stops = collect()
            startY = lastY = e.touches[0].clientY
            stepping = null
        }

        const onMove = (e: TouchEvent) => {
            const y = e.touches[0].clientY
            lastY = y
            if (stepping === null) {
                if (Math.abs(startY - y) < 6) return
                stepping = shouldStep(startY - y > 0 ? 1 : -1)
            }
            // a step: the page itself doesn't move under the finger
            if (stepping && e.cancelable) e.preventDefault()
        }

        const onEnd = () => {
            touching = false
            if (!stepping || gliding) return
            const dy = startY - lastY
            const y = window.scrollY
            if (Math.abs(dy) < SWIPE) return
            const target =
                dy > 0 ? stops.find((s) => s > y + TOL) : [...stops].reverse().find((s) => s < y - TOL)
            if (target !== undefined) glideTo(target)
        }

        // a flick from outside the stretch is caught at the first stop it reaches
        const onScroll = () => {
            const y = window.scrollY
            if (!gliding && !touching && stops.length > 1) {
                const first = stops[0]
                const last = stops[stops.length - 1]
                if (prevScroll < first - TOL && y >= first) glideTo(first)
                else if (prevScroll > last + TOL && y <= last) glideTo(last)
            }
            prevScroll = y
        }

        const refresh = () => {
            stops = collect()
        }
        refresh()
        // layout settles (fonts, images) after load; measure again then
        const late = window.setTimeout(refresh, 1500)

        window.addEventListener("touchstart", onStart, { passive: true })
        window.addEventListener("touchmove", onMove, { passive: false })
        window.addEventListener("touchend", onEnd, { passive: true })
        window.addEventListener("touchcancel", onEnd, { passive: true })
        window.addEventListener("scroll", onScroll, { passive: true })
        window.addEventListener("resize", refresh)
        return () => {
            window.clearTimeout(late)
            window.clearTimeout(glideTimer)
            window.removeEventListener("touchstart", onStart)
            window.removeEventListener("touchmove", onMove)
            window.removeEventListener("touchend", onEnd)
            window.removeEventListener("touchcancel", onEnd)
            window.removeEventListener("scroll", onScroll)
            window.removeEventListener("resize", refresh)
        }
    }, [])
    return null
}
