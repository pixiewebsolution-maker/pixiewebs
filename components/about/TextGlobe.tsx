"use client"

import { useEffect, useRef } from "react"

/**
 * A slowly turning globe woven from words: each word sits on a point of an
 * even (Fibonacci) sphere, drawn larger and brighter the nearer it is, and
 * fading to silver as it turns away. Drag to spin it; it coasts and settles
 * back to its idle turn. Drawn on a 2D canvas, paused while off screen, and
 * held still for visitors who ask for less motion.
 */
export default function TextGlobe({ words, count = 46, className }: { words: string[]; count?: number; className?: string }) {
    const ref = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = ref.current
        const ctx = canvas?.getContext("2d")
        if (!canvas || !ctx) return
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

        // points on a Fibonacci sphere, each carrying one of the words in turn
        const pts = Array.from({ length: count }, (_, i) => {
            const y = 1 - (2 * (i + 0.5)) / count
            const r = Math.sqrt(1 - y * y)
            const t = i * Math.PI * (3 - Math.sqrt(5))
            return { x: Math.cos(t) * r, y, z: Math.sin(t) * r, word: words[i % words.length] }
        })

        let w = 0
        let h = 0
        let dpr = 1
        const resize = () => {
            const box = canvas.getBoundingClientRect()
            dpr = Math.min(window.devicePixelRatio || 1, 2)
            w = box.width
            h = box.height
            canvas.width = Math.round(w * dpr)
            canvas.height = Math.round(h * dpr)
        }
        resize()
        const ro = new ResizeObserver(resize)
        ro.observe(canvas)

        const family = getComputedStyle(canvas).fontFamily || "sans-serif"
        // rotation (radians) and spin velocity (radians per frame at 60fps)
        let rx = -0.35
        let ry = 0
        let vx = 0
        let vy = 0
        const IDLE = 0.0035
        let dragging = false
        let lastX = 0
        let lastY = 0

        const draw = () => {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            ctx.clearRect(0, 0, w, h)
            const R = Math.min(w, h) * 0.4
            const cx = w / 2
            const cy = h / 2
            const sx = Math.sin(rx)
            const cxr = Math.cos(rx)
            const sy = Math.sin(ry)
            const cyr = Math.cos(ry)
            const base = Math.max(10, R * 0.075)

            const placed = pts.map((p) => {
                // turn about the vertical axis, then tilt about the horizontal one
                const x1 = p.x * cyr + p.z * sy
                const z1 = -p.x * sy + p.z * cyr
                const y2 = p.y * cxr - z1 * sx
                const z2 = p.y * sx + z1 * cxr
                return { x: x1, y: y2, z: z2, word: p.word }
            })
            placed.sort((a, b) => a.z - b.z)

            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            for (const p of placed) {
                const depth = (p.z + 1) / 2 // 0 at the back, 1 at the front
                const scale = 0.55 + depth * 0.65
                const size = base * scale
                ctx.font = `${depth > 0.55 ? 700 : 500} ${size.toFixed(1)}px ${family}`
                // front words bright white, back ones dim silver
                const shade = Math.round(150 + depth * 105)
                ctx.fillStyle = `rgba(${shade}, ${shade}, ${shade}, ${(0.12 + depth * 0.88).toFixed(3)})`
                ctx.fillText(p.word, cx + p.x * R, cy + p.y * R)
            }
        }

        let raf = 0
        let visible = true
        const tick = () => {
            if (!dragging) {
                // coast, then ease back to the idle turn
                vy += (IDLE - vy) * 0.025
                vx += (0 - vx) * 0.04
                ry += vy
                rx = Math.max(-1.2, Math.min(1.2, rx + vx))
            }
            draw()
            raf = visible ? requestAnimationFrame(tick) : 0
        }

        const io = new IntersectionObserver(([e]) => {
            visible = e.isIntersecting
            if (visible && !raf && !reduce) raf = requestAnimationFrame(tick)
        })
        io.observe(canvas)

        const down = (e: PointerEvent) => {
            dragging = true
            lastX = e.clientX
            lastY = e.clientY
            canvas.setPointerCapture(e.pointerId)
        }
        const move = (e: PointerEvent) => {
            if (!dragging) return
            const dx = e.clientX - lastX
            const dy = e.clientY - lastY
            lastX = e.clientX
            lastY = e.clientY
            vy = dx * 0.006
            vx = dy * 0.004
            ry += vy
            rx = Math.max(-1.2, Math.min(1.2, rx + vx))
            if (reduce) draw()
        }
        const up = () => {
            dragging = false
        }
        canvas.addEventListener("pointerdown", down)
        canvas.addEventListener("pointermove", move)
        canvas.addEventListener("pointerup", up)
        canvas.addEventListener("pointercancel", up)

        // fonts load after first paint; redraw once they're in
        document.fonts?.ready.then(draw)
        if (reduce) {
            draw()
            ro.disconnect()
            const r2 = new ResizeObserver(() => {
                resize()
                draw()
            })
            r2.observe(canvas)
            return () => {
                r2.disconnect()
                io.disconnect()
                canvas.removeEventListener("pointerdown", down)
                canvas.removeEventListener("pointermove", move)
                canvas.removeEventListener("pointerup", up)
                canvas.removeEventListener("pointercancel", up)
            }
        }
        raf = requestAnimationFrame(tick)
        return () => {
            cancelAnimationFrame(raf)
            ro.disconnect()
            io.disconnect()
            canvas.removeEventListener("pointerdown", down)
            canvas.removeEventListener("pointermove", move)
            canvas.removeEventListener("pointerup", up)
            canvas.removeEventListener("pointercancel", up)
        }
    }, [words, count])

    return <canvas ref={ref} className={className} aria-hidden="true" style={{ touchAction: "pan-y", cursor: "grab" }} />
}
