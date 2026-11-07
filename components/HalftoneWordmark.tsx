"use client"

import { useEffect, useRef } from "react"

type Dot = { hx: number; hy: number; x: number; y: number; vx: number; vy: number; r: number }

/**
 * Grid spacing in CSS px (finer on phones); the dot at each grid point is
 * sized by how much of the letter covers it.
 */
const spacingFor = (w: number) => (w < 600 ? 6 : 9)
/** below this width the word stacks one word per line, so it stays big */
const STACK_BELOW = 600
/** how far the pointer pushes dots, and how hard */
const REACH = 110
const PUSH = 2600
/** the springs pulling dots home, and their damping */
const SPRING = 90
const DAMP = 11

/**
 * An enormous wordmark printed in halftone dots, cropped by the bottom edge.
 * Dots part around the pointer on springs and brighten as they move; a click
 * sends a shock ring out through the letters. Drawn on a canvas in the site's
 * font; it only animates while something is moving, and stays still for
 * anyone who asks for less motion.
 */
export default function HalftoneWordmark({ word, className }: { word: string; className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")
        if (!canvas || !ctx) return
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

        let dots: Dot[] = []
        let SPACING = 9
        let w = 0
        let h = 0
        let raf = 0
        let last = 0
        let pointer: { x: number; y: number } | null = null
        let rings: { x: number; y: number; r: number; life: number }[] = []

        // Lay the word out to span the width, sample its coverage on a grid, and
        // make one dot per covered grid point.
        const build = () => {
            const rect = canvas.getBoundingClientRect()
            // nothing to draw into yet (a page laid out at zero width); the resize rebuilds it
            if (rect.width < 1) return
            w = rect.width
            SPACING = spacingFor(w)
            const family = getComputedStyle(canvas).fontFamily
            const lines = w < STACK_BELOW ? word.split(" ") : [word]
            const probe = document.createElement("canvas").getContext("2d")!
            probe.font = `700 100px ${family}`
            const widest = Math.max(...lines.map((l) => probe.measureText(l).width))
            const fs = (w * 1.02) / (widest / 100)
            const lead = fs * 0.86
            // show the top of the last line; the bottom edge cuts through its letters
            h = Math.round(fs * 0.62 + (lines.length - 1) * lead)
            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            canvas.width = Math.round(w * dpr)
            canvas.height = Math.round(h * dpr)
            canvas.style.height = `${h}px`
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

            const off = document.createElement("canvas")
            off.width = Math.ceil(w)
            off.height = h
            const o = off.getContext("2d")!
            o.fillStyle = "#fff"
            o.font = `700 ${fs}px ${family}`
            o.textBaseline = "alphabetic"
            o.letterSpacing = "-0.02em"
            lines.forEach((line, i) => {
                const tw = o.measureText(line).width
                o.fillText(line, (w - tw) / 2, h + fs * 0.1 - (lines.length - 1 - i) * lead)
            })
            const data = o.getImageData(0, 0, off.width, off.height).data

            dots = []
            for (let y = SPACING / 2; y < h; y += SPACING) {
                for (let x = SPACING / 2; x < w; x += SPACING) {
                    // coverage: the average of a few samples across the cell
                    let sum = 0
                    const q = SPACING * 0.28
                    for (const [dx, dy] of [[0, 0], [-q, -q], [q, -q], [-q, q], [q, q]]) {
                        const sx = Math.min(off.width - 1, Math.max(0, Math.round(x + dx)))
                        const sy = Math.min(off.height - 1, Math.max(0, Math.round(y + dy)))
                        sum += data[(sy * off.width + sx) * 4 + 3]
                    }
                    const cover = sum / (5 * 255)
                    if (cover < 0.08) continue
                    dots.push({ hx: x, hy: y, x, y, vx: 0, vy: 0, r: (SPACING / 2) * 0.92 * Math.sqrt(cover) })
                }
            }
            draw()
        }

        const draw = () => {
            ctx.clearRect(0, 0, w, h)
            // three tones: at rest, moving, moving fast
            const tones = ["rgba(236, 235, 230, 0.92)", "rgba(250, 249, 245, 0.98)", "#ffffff"]
            for (let t = 0; t < 3; t++) {
                ctx.beginPath()
                for (const d of dots) {
                    const off = Math.hypot(d.x - d.hx, d.y - d.hy)
                    const tone = off < 1.5 ? 0 : off < 10 ? 1 : 2
                    if (tone !== t) continue
                    const r = d.r * (1 + Math.min(0.35, off / 60))
                    ctx.moveTo(d.x + r, d.y)
                    ctx.arc(d.x, d.y, r, 0, Math.PI * 2)
                }
                ctx.fillStyle = tones[t]
                ctx.fill()
            }
        }

        const step = (now: number) => {
            const dt = last ? Math.min(0.033, (now - last) / 1000) : 1 / 60
            last = now
            let moving = !!pointer || rings.length > 0
            for (const ring of rings) {
                ring.r += 900 * dt
                ring.life -= dt * 1.1
            }
            rings = rings.filter((r) => r.life > 0 && r.r < Math.hypot(w, h) * 1.2)

            for (const d of dots) {
                let ax = (d.hx - d.x) * SPRING - d.vx * DAMP
                let ay = (d.hy - d.y) * SPRING - d.vy * DAMP
                if (pointer) {
                    const dx = d.x - pointer.x
                    const dy = d.y - pointer.y
                    const dist = Math.hypot(dx, dy) || 1
                    if (dist < REACH) {
                        const f = (1 - dist / REACH) ** 2 * PUSH
                        ax += (dx / dist) * f
                        ay += (dy / dist) * f
                    }
                }
                for (const ring of rings) {
                    const dx = d.hx - ring.x
                    const dy = d.hy - ring.y
                    const dist = Math.hypot(dx, dy) || 1
                    const band = Math.abs(dist - ring.r)
                    if (band < 26) {
                        const f = (1 - band / 26) * 9000 * ring.life
                        ax += (dx / dist) * f
                        ay += (dy / dist) * f
                    }
                }
                d.vx += ax * dt
                d.vy += ay * dt
                d.x += d.vx * dt
                d.y += d.vy * dt
                if (!moving && (Math.abs(d.vx) > 0.5 || Math.abs(d.vy) > 0.5 || Math.abs(d.x - d.hx) > 0.3 || Math.abs(d.y - d.hy) > 0.3)) {
                    moving = true
                }
            }
            draw()
            // rest once everything has settled; the next pointer move wakes it
            if (moving) raf = requestAnimationFrame(step)
            else {
                raf = 0
                last = 0
            }
        }
        const wake = () => {
            if (!raf && !reduce) raf = requestAnimationFrame(step)
        }

        const local = (e: PointerEvent) => {
            const r = canvas.getBoundingClientRect()
            return { x: e.clientX - r.left, y: e.clientY - r.top }
        }
        const onMove = (e: PointerEvent) => {
            pointer = local(e)
            wake()
        }
        const onLeave = () => {
            pointer = null
            wake()
        }
        const onDown = (e: PointerEvent) => {
            const p = local(e)
            rings.push({ x: p.x, y: p.y, r: 0, life: 1 })
            wake()
        }

        let resizeTimer = 0
        const onResize = () => {
            window.clearTimeout(resizeTimer)
            resizeTimer = window.setTimeout(build, 120)
        }

        // the site font has to be loaded before the word is measured and drawn
        document.fonts.ready.then(build)
        window.addEventListener("resize", onResize)
        canvas.addEventListener("pointermove", onMove)
        canvas.addEventListener("pointerleave", onLeave)
        canvas.addEventListener("pointerdown", onDown)
        return () => {
            if (raf) cancelAnimationFrame(raf)
            window.clearTimeout(resizeTimer)
            window.removeEventListener("resize", onResize)
            canvas.removeEventListener("pointermove", onMove)
            canvas.removeEventListener("pointerleave", onLeave)
            canvas.removeEventListener("pointerdown", onDown)
        }
    }, [word])

    return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
