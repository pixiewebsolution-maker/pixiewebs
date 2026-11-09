"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import mono from "@/public/clients/mono/manifest.json"
import color from "@/public/clients/color-dark/manifest.json"
import styles from "./TrustedBy.module.css"

/*
 * Client logos in white, for the dark band (public/clients/mono, made from the
 * files in public/clients). Hovering one shows it in its own colours, from
 * public/clients/color-dark: the colour logos with their black and very dark
 * parts lifted to white or a light tint, so they read on the charcoal (Raha,
 * Rasoi Studio and Trishika are their untouched originals). Logos that are
 * white to begin with simply stay white. Listed so each run of five mixes wide
 * wordmarks with square marks; slot k shows every fifth logo starting at k.
 */
const LOGOS: { file: string; name: string; white?: boolean }[] = [
    { file: "rogue-ninja.png", name: "Rogue Ninja", white: true },
    { file: "bossperfumes.png", name: "Boss General Trading" },
    { file: "raha.png", name: "Raha Convention Centre" },
    { file: "jacob-ventures.png", name: "Jacob Ventures" },
    { file: "atl.png", name: "Accurate Trade Links" },

    { file: "velastia.png", name: "Velastia" },
    { file: "sezo-cabs.png", name: "Sezo Cabs" },
    { file: "curefully.png", name: "Curefully" },
    { file: "trishika.png", name: "Trishika Saloon & Wellness Spa" },
    { file: "flynova.png", name: "Flynova Reisen", white: true },

    { file: "voiture.png", name: "Voiture" },
    { file: "vesper-wedding-company.png", name: "Vesper Wedding Company" },
    { file: "zenvitaa.png", name: "Zenvitaa Exports" },
    { file: "ondezyn.png", name: "Ondezyn" },
    { file: "kerala-mist.png", name: "Kerala Mist Holidays" },

    { file: "moven-active.png", name: "Moven Active" },
    { file: "rasoi-studio.png", name: "Rasoi Studio" },
    { file: "why-marketing.png", name: "WhyMarketing × Brandables" },
    { file: "maximum-efforts.png", name: "Maximum Effort", white: true },
]

/** Two rows: five slots each, or three on phones. */
const SLOTS_WIDE = 10
const SLOTS_NARROW = 6
const EVERY_MS = 3000

/** Area in em² every mark is drawn at, so a square mark and a long wordmark carry the same weight. */
const AREA = 28
/** a slot is ~11em wide at every size, so 10em always fits */
const MAX_W = 10
const MAX_H = 5

type Entry = { file: string; w: number; h: number }

/** a mark's pixel size and the height (in em) it's drawn at */
const size = (list: Entry[], file: string) => {
    const m = list.find((x) => x.file === file)
    if (!m) throw new Error(`no manifest entry for ${file}`)
    const r = m.w / m.h
    const h = Math.min(Math.sqrt(AREA / r), MAX_H, MAX_W / r)
    return { w: m.w, h: m.h, em: +h.toFixed(3) }
}

const SIZED = LOGOS.map((l) => ({ ...l, mono: size(mono, l.file), color: size(color, l.file) }))

/**
 * Slot k shows every n-th logo from k, so no logo can appear in two slots. A
 * slot left with a single logo borrows the first one; a slot holds rather than
 * put up a logo another slot is already showing, so it never appears twice.
 */
function queuesFor(n: number) {
    const queues = Array.from({ length: n }, (_, k) => SIZED.filter((_, i) => i % n === k))
    for (const q of queues) if (q.length === 1 && queues[0].length === 2) q.push(SIZED[0])
    return queues
}

type Pos = { cur: number[]; prev: (number | null)[] }

const startPos = (n: number): Pos => ({ cur: Array(n).fill(0), prev: Array(n).fill(null) })

export default function TrustedBy() {
    const ref = useRef<HTMLElement>(null)
    // each slot keeps its own place in its queue, so a hovered one can hold still
    const [pos, setPos] = useState<Pos>(() => startPos(SLOTS_WIDE))
    // no motion on first paint; only swaps animate
    const [swapped, setSwapped] = useState(false)
    const [slots, setSlots] = useState(SLOTS_WIDE)
    const queues = useMemo(() => queuesFor(slots), [slots])
    const queuesRef = useRef(queues)
    queuesRef.current = queues
    /** the slot under the pointer, which doesn't switch */
    const hovered = useRef<number | null>(null)
    const perRow = slots / 2

    // a new layout starts every slot on its first logo
    useEffect(() => setPos(startPos(slots)), [slots])

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 640px)")
        const apply = () => setSlots(mq.matches ? SLOTS_NARROW : SLOTS_WIDE)
        apply()
        mq.addEventListener("change", apply)
        return () => mq.removeEventListener("change", apply)
    }, [])

    // advance every three seconds, but only while the strip is on screen
    useEffect(() => {
        const el = ref.current
        if (!el) return
        let timer = 0
        const start = () => {
            if (timer) return
            timer = window.setInterval(() => {
                setSwapped(true)
                setPos(({ cur }) => {
                    const qs = queuesRef.current
                    const next = [...cur]
                    const prev: (number | null)[] = cur.map(() => null)
                    qs.forEach((q, k) => {
                        if (k === hovered.current || q.length < 2) return
                        const n = (cur[k] + 1) % q.length
                        // never put up a logo another slot is already showing
                        // (one slot borrows the first slot's logo)
                        const shown = qs.some((o, j) => j !== k && o[next[j]]?.file === q[n].file)
                        if (shown) return
                        next[k] = n
                        prev[k] = cur[k]
                    })
                    return { cur: next, prev }
                })
            }, EVERY_MS)
        }
        const stop = () => {
            window.clearInterval(timer)
            timer = 0
        }
        const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()))
        io.observe(el)
        return () => {
            io.disconnect()
            stop()
        }
    }, [])

    return (
        <section ref={ref} className={styles.strip} aria-label="Our clients">
            <div className={styles.inner}>
                <h2 className={styles.heading}>Trusted by the best</h2>
                <ul className={styles.logos} data-swapped={swapped} style={{ ["--per-row" as string]: perRow }}>
                    {queues.map((queue, slot) => {
                        const cur = (pos.cur[slot] ?? 0) % queue.length
                        const prev = pos.prev[slot] ?? null
                        // stagger along each row, the second row a beat behind the first
                        const delay = (slot % perRow) + Math.floor(slot / perRow) * 0.5
                        return (
                            <li
                                key={slot}
                                className={styles.slot}
                                style={{ ["--i" as string]: delay }}
                                onMouseEnter={() => (hovered.current = slot)}
                                onMouseLeave={() => (hovered.current = null)}
                            >
                                {queue.map((logo, i) => (
                                    <span
                                        key={logo.file}
                                        className={styles.mark}
                                        data-state={i === cur ? "in" : swapped && i === prev ? "out" : "idle"}
                                        aria-hidden={i !== cur}
                                    >
                                        <Image
                                            src={`/clients/mono/${logo.file}`}
                                            alt={i === cur ? logo.name : ""}
                                            width={logo.mono.w}
                                            height={logo.mono.h}
                                            className={styles.white}
                                            style={{ height: `${logo.mono.em}em`, width: "auto" }}
                                        />
                                        {!logo.white && (
                                            <Image
                                                src={`/clients/color-dark/${logo.file}`}
                                                alt=""
                                                width={logo.color.w}
                                                height={logo.color.h}
                                                className={styles.color}
                                                style={{ height: `${logo.color.em}em`, width: "auto" }}
                                            />
                                        )}
                                    </span>
                                ))}
                            </li>
                        )
                    })}
                </ul>
            </div>
        </section>
    )
}
