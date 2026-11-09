"use client"

import { useEffect, useRef, useState, type RefObject } from "react"
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "motion/react"
import styles from "./WorksPage.module.css"

/*
 * A faint silver stroke in the background that draws itself down the whole
 * Our Works page as it scrolls: a knot of loops beside the heading, then a long
 * cursive line that winds from side to side behind the projects, ending at the
 * closing call to action. Its drawn end keeps pace with the middle of the screen.
 *
 * The knot is from Skiper UI's "SVG follow scroll" (skiper19,
 * https://skiper-ui.com, by @gurvinder-singh02, inspired by comgio.ai); the
 * tail is drawn here to fit the page's height, recoloured to the site's silver
 * and softened with a spring. Visitors who ask for less motion see it whole.
 *
 * It's laid out in the page's own pixels: the page marks where the knot sits
 * (data-stroke-knot, the heading) and where the line ends (data-stroke-end,
 * the closing title), and it's rebuilt whenever the page changes size.
 */

/** skiper19's knot, up to where its tail sets off downward; its box is about x 495–1273, y 0–562 */
const KNOT =
    "M876.605 394.131C788.982 335.917 696.198 358.139 691.836 416.303C685.453 501.424 853.722 498.43 941.95 409.714C1016.1 335.156 1008.64 186.907 906.167 142.846C807.014 100.212 712.699 198.494 789.049 245.127C889.053 306.207 986.062 116.979 840.548 43.3233C743.932 -5.58141 678.027 57.1682 672.279 112.188C666.53 167.208 712.538 172.943 736.353 163.088C760.167 153.234 764.14 120.924 746.651 93.3868C717.461 47.4252 638.894 77.8642 601.018 116.979C568.164 150.908 557 201.079 576.467 246.924C593.342 286.664 630.24 310.55 671.68 302.614C756.114 286.446 729.747 206.546 681.86 186.442C630.54 164.898 492 209.318 495.026 287.644C496.837 334.494 518.402 366.466 582.455 367.287C680.013 368.538 771.538 299.456 898.634 292.434C1007.02 286.446 1192.67 309.384 1242.36 382.258C1266.99 418.39 1273.65 443.108 1247.75 474.477C1217.32 511.33 1149.4 511.259 1096.84 466.093C1044.29 420.928 1029.14 380.576 1033.97 324.172C1038.31 273.428 1069.55 228.986 1117.2 216.384C1152.2 207.128 1188.29 213.629 1194.45 245.127C1201.49 281.062 1132.22 280.104 1100.44 272.673C1065.32 264.464 1044.22 234.837 1032.77 201.413C1019.29 162.061 1029.71 131.126 1056.44 100.965C1086.19 67.4032 1143.96 54.5526 1175.78 86.1513C1207.02 117.17 1186.81 143.379 1156.22 166.691C1112.57 199.959 1052.57 186.238 999.784 155.164C957.312 130.164 899.171 63.7054 931.284 26.3214C952.068 2.12513 996.288 3.87363 1007.22 43.58C1018.15 83.2749 1003.56 122.644 975.969 163.376C948.377 204.107 907.272 255.122 913.558 321.045C919.727 385.734 990.968 497.068 1063.84 503.35C1111.46 507.456 1166.79 511.984 1175.68 464.527C1191.52 379.956 1101.26 334.985 1030.29 377.017C971.109 412.064 956.297 483.647 953.797 561.655"
const KNOT_X0 = 495
const KNOT_X1 = 1273
const KNOT_NUMS = KNOT.match(/-?[\d.]+/g)!.map(Number)

/** where the drawn end sits, as a share of the screen's height from its top */
const TIP = 0.5

type Pt = { x: number; y: number }
type Geo = { w: number; h: number; d: string; width: number }

const f = (n: number) => n.toFixed(1)

/** the knot, scaled by s and moved so its box's left edge is at x and its top at y */
function knotPath(s: number, x: number, y: number) {
    let i = 0
    return KNOT.replace(/-?[\d.]+/g, () => {
        const v = KNOT_NUMS[i]
        const out = i % 2 === 0 ? x + (v - KNOT_X0) * s : y + v * s
        i++
        return f(out)
    })
}

/**
 * The tail: from the knot's end down to `end`, a cursive line swinging from
 * one side of the page to the other, with a loop tied into every other
 * crossing. Each stop's tangent leans down and outward, so the line swings a
 * little wide at each side and turns back, like handwriting.
 */
function tailPath(from: Pt, end: Pt, w: number, step: number, radius: number) {
    const span = end.y - from.y
    const n = Math.max(2, Math.round(span / step))
    const left = w * 0.16
    const right = w * 0.84
    const stops: Pt[] = [from]
    for (let i = 1; i < n; i++) {
        stops.push({ x: i % 2 ? left : right, y: from.y + (span * i) / n })
    }
    stops.push(end)

    // the tangent at each stop: down, leaning toward the side it sits on
    const tan = stops.map((p, i) => {
        if (i === 0) return { x: 0, y: 1 }
        if (i === stops.length - 1) return { x: 0, y: 1 }
        const out = p.x < w / 2 ? -1 : 1
        const len = Math.hypot(0.55, 1)
        return { x: (out * 0.55) / len, y: 1 / len }
    })

    const c = (p1: Pt, p2: Pt, p3: Pt) => `C${f(p1.x)} ${f(p1.y)} ${f(p2.x)} ${f(p2.y)} ${f(p3.x)} ${f(p3.y)}`
    let d = ""
    for (let i = 0; i < stops.length - 1; i++) {
        const a = stops[i]
        const b = stops[i + 1]
        const k = Math.hypot(b.x - a.x, b.y - a.y) * 0.42
        const p1 = { x: a.x + tan[i].x * k, y: a.y + tan[i].y * k }
        const p2 = { x: b.x - tan[i + 1].x * k, y: b.y - tan[i + 1].y * k }
        // every other crossing (not the last) gets a loop tied into its middle
        if (i % 2 === 1 && i < stops.length - 2) {
            const [left, right] = split(a, p1, p2, b)
            d += c(left[1], left[2], left[3])
            d += loop(left[3], right[1], radius, i % 4 === 1 ? 1 : -1)
            d += c(right[1], right[2], right[3])
        } else {
            d += c(p1, p2, b)
        }
    }
    return d
}

const mid = (p: Pt, q: Pt) => ({ x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 })

/** a cubic cut in two at its middle (de Casteljau) */
function split(p0: Pt, p1: Pt, p2: Pt, p3: Pt): [Pt[], Pt[]] {
    const a = mid(p0, p1)
    const b = mid(p1, p2)
    const cc = mid(p2, p3)
    const ab = mid(a, b)
    const bc = mid(b, cc)
    const m = mid(ab, bc)
    return [
        [p0, a, ab, m],
        [m, bc, cc, p3],
    ]
}

/**
 * A full circle tied into the line at m: it leaves m in the line's direction
 * (towards `toward`), curls round to the `side`, and comes back through m
 * heading the same way, so the line runs on without a kink.
 */
function loop(m: Pt, toward: Pt, r: number, side: 1 | -1) {
    const len = Math.hypot(toward.x - m.x, toward.y - m.y) || 1
    const t = { x: (toward.x - m.x) / len, y: (toward.y - m.y) / len }
    const n = { x: -t.y * side, y: t.x * side }
    const ctr = { x: m.x + n.x * r, y: m.y + n.y * r }
    // the point at angle θ round the circle, and the direction it's heading there
    const at = (θ: number) => ({
        x: ctr.x - n.x * r * Math.cos(θ) + t.x * r * Math.sin(θ),
        y: ctr.y - n.y * r * Math.cos(θ) + t.y * r * Math.sin(θ),
    })
    const dir = (θ: number) => ({ x: n.x * Math.sin(θ) + t.x * Math.cos(θ), y: n.y * Math.sin(θ) + t.y * Math.cos(θ) })
    const kappa = 0.5523 * r
    let d = ""
    for (let q = 0; q < 4; q++) {
        const θ0 = (q * Math.PI) / 2
        const θ1 = ((q + 1) * Math.PI) / 2
        const p0 = at(θ0)
        const p3 = at(θ1)
        const d0 = dir(θ0)
        const d1 = dir(θ1)
        d += `C${f(p0.x + d0.x * kappa)} ${f(p0.y + d0.y * kappa)} ${f(p3.x - d1.x * kappa)} ${f(p3.y - d1.y * kappa)} ${f(p3.x)} ${f(p3.y)}`
    }
    return d
}

function build(page: HTMLElement): Geo | null {
    const knotEl = page.querySelector<HTMLElement>("[data-stroke-knot]")
    const endEl = page.querySelector<HTMLElement>("[data-stroke-end]")
    if (!knotEl || !endEl) return null
    const box = page.getBoundingClientRect()
    const w = page.clientWidth
    const h = page.scrollHeight
    const phone = w < 640
    const vh = window.innerHeight

    // the knot: about a third of the page wide, its right edge near the right margin;
    // on a phone, half the width, beside the heading's short second line
    const knotW = phone ? w * 0.5 : Math.min(w * 0.32, 520)
    const s = knotW / (KNOT_X1 - KNOT_X0)
    const k = knotEl.getBoundingClientRect()
    const kx = phone ? w - knotW - 6 : w - knotW - w * 0.05
    const ky = phone ? k.top - box.top + 44 : k.top - box.top - 562 * s * 0.22
    const knot = knotPath(s, kx, ky)
    const from = { x: kx + (953.797 - KNOT_X0) * s, y: ky + 561.655 * s }

    // the end: just above the closing title, at its centre, leading the eye into it
    const e = endEl.getBoundingClientRect()
    const end = { x: e.left - box.left + e.width / 2, y: e.top - box.top - 28 }

    const radius = phone ? w * 0.09 : Math.min(w * 0.05, 80)
    const tail = tailPath(from, end, w, Math.max(420, Math.min(860, vh * 0.85)), radius)
    return { w, h, d: knot + tail, width: Math.max(3, Math.min(7, 13 * s)) }
}

/**
 * For points along a path made of M and C commands: the length along the path
 * and the lowest point reached so far, plus the path's total length. Each
 * curve is walked in short straight steps, close enough to the true length.
 */
function sample(d: string) {
    const tok = d.match(/[MC]|-?\d*\.?\d+(?:e-?\d+)?/g) ?? []
    const len: number[] = [0]
    const y: number[] = []
    let total = 0
    let low = -Infinity
    let x0 = 0
    let y0 = 0
    let i = 0
    const STEPS = 16
    while (i < tok.length) {
        const cmd = tok[i++]
        if (cmd === "M") {
            x0 = +tok[i++]
            y0 = +tok[i++]
            low = y0
            y.push(low)
            continue
        }
        // C: one or more cubic curves from the current point
        while (i + 5 < tok.length && tok[i] !== "M" && tok[i] !== "C") {
            const [x1, y1, x2, y2, x3, y3] = tok.slice(i, i + 6).map(Number)
            i += 6
            let px = x0
            let py = y0
            for (let k = 1; k <= STEPS; k++) {
                const t = k / STEPS
                const u = 1 - t
                const qx = u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3
                const qy = u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3
                total += Math.hypot(qx - px, qy - py)
                low = Math.max(low, qy)
                len.push(total)
                y.push(low)
                px = qx
                py = qy
            }
            x0 = x3
            y0 = y3
        }
    }
    return { len, y, total }
}

export default function ScrollStroke({ pageRef }: { pageRef: RefObject<HTMLDivElement | null> }) {
    const reduce = useReducedMotion()
    const pathRef = useRef<SVGPathElement>(null)
    const [geo, setGeo] = useState<Geo | null>(null)
    /** for each sampled length along the path, the lowest point reached so far; and the page's top */
    const table = useRef<{ len: number[]; y: number[]; total: number; top: number } | null>(null)

    // lay the stroke out to the page, and again whenever the page changes size
    useEffect(() => {
        const page = pageRef.current
        if (!page) return
        let frame = 0
        const apply = () => {
            const next = build(page)
            if (next) setGeo((g) => (g && g.d === next.d && g.h === next.h ? g : next))
        }
        // later changes wait a frame, so a burst of them builds once
        const update = () => {
            cancelAnimationFrame(frame)
            frame = requestAnimationFrame(apply)
        }
        apply()
        const ro = new ResizeObserver(update)
        ro.observe(page)
        window.addEventListener("resize", update)
        return () => {
            cancelAnimationFrame(frame)
            ro.disconnect()
            window.removeEventListener("resize", update)
        }
    }, [pageRef])

    // sample the drawn path, so a scroll position can be turned into how much of
    // it to draw. Worked out from the curves' own maths rather than asking the
    // browser for hundreds of points along the path, which froze slow phones.
    useEffect(() => {
        const page = pageRef.current
        if (!page || !geo) return
        table.current = { ...sample(geo.d), top: page.getBoundingClientRect().top + window.scrollY }
        // the new layout takes effect now, without waiting for a scroll
        progress.set(progressAt(window.scrollY))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [geo])

    /** how much of the path to draw (0–1) with the page scrolled to `scrollY` */
    const progressAt = (scrollY: number) => {
        const t = table.current
        if (!t) return 0
        const target = scrollY - t.top + window.innerHeight * TIP
        // the first sample whose lowest point reaches the target
        let lo = 0
        let hi = t.y.length - 1
        if (t.y[hi] <= target) return 1
        while (lo < hi) {
            const mid = (lo + hi) >> 1
            if (t.y[mid] < target) lo = mid + 1
            else hi = mid
        }
        // a little of the knot is always drawn
        return Math.max(t.len[lo] / t.total, 0.03)
    }

    const { scrollY } = useScroll()
    const progress = useMotionValue(0.03)
    useMotionValueEvent(scrollY, "change", (v) => progress.set(progressAt(v)))
    const pathLength = useSpring(progress, { stiffness: 120, damping: 30, mass: 0.6 })

    if (!geo) return null
    return (
        <svg
            className={styles.stroke}
            width={geo.w}
            height={geo.h}
            viewBox={`0 0 ${geo.w} ${geo.h}`}
            fill="none"
            aria-hidden="true"
        >
            <defs>
                {/* the silver of the headings' second line, running down the page */}
                <linearGradient id="works-stroke" x1="0" y1="0" x2="0" y2={geo.h} gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#ffffff" />
                    <stop offset="0.5" stopColor="#d4d4d4" />
                    <stop offset="1" stopColor="#a8a8a8" />
                </linearGradient>
            </defs>
            <motion.path
                ref={pathRef}
                d={geo.d}
                stroke="url(#works-stroke)"
                strokeWidth={geo.width}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ pathLength: reduce ? 1 : pathLength }}
            />
        </svg>
    )
}
