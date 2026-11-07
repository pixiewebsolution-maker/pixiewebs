"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import manifest from "@/public/clients/color/manifest.json"
import styles from "./TrustedBy.module.css"

/*
 * Client logos in their own colours, made from the files in public/clients (see
 * public/clients/color; logos that are white themselves use their near-black
 * mark from mono-dark, so they show on the light page). Listed
 * so each run of five mixes wide wordmarks with
 * square marks; slot k shows every fifth logo starting at k.
 */
const LOGOS: { file: string; name: string }[] = [
    { file: "rogue-ninja.png", name: "Rogue Ninja" },
    { file: "bossperfumes.png", name: "Boss General Trading" },
    { file: "raha.png", name: "Raha Convention Centre" },
    { file: "jacob-ventures.png", name: "Jacob Ventures" },
    { file: "atl.png", name: "Accurate Trade Links" },

    { file: "velastia.png", name: "Velastia" },
    { file: "sezo-cabs.png", name: "Sezo Cabs" },
    { file: "curefully.png", name: "Curefully" },
    { file: "trishika.png", name: "Trishika Saloon & Wellness Spa" },
    { file: "flynova.png", name: "Flynova Reisen" },

    { file: "voiture.png", name: "Voiture" },
    { file: "vesper-wedding-company.png", name: "Vesper Wedding Company" },
    { file: "zenvitaa.png", name: "Zenvitaa Exports" },
    { file: "ondezyn.png", name: "Ondezyn" },
    { file: "kerala-mist.png", name: "Kerala Mist Holidays" },

    { file: "moven-active.png", name: "Moven Active" },
    { file: "rasoi-studio.png", name: "Rasoi Studio" },
    { file: "why-marketing.png", name: "WhyMarketing × Brandables" },
    { file: "maximum-efforts.png", name: "Maximum Efforts" },
]

/** Two rows: five slots each, or three on phones. */
const SLOTS_WIDE = 10
const SLOTS_NARROW = 6
const EVERY_MS = 2000

/** Area in em² every mark is drawn at, so a square mark and a long wordmark carry the same weight. */
const AREA = 21
/** a slot is ~10em wide at every size, so 9.5em always fits */
const MAX_W = 9.5
const MAX_H = 4.5

const size = (file: string) => {
    const m = manifest.find((x) => x.file === file)
    if (!m) throw new Error(`no manifest entry for ${file}`)
    const r = m.w / m.h
    const h = Math.min(Math.sqrt(AREA / r), MAX_H, MAX_W / r)
    return { w: m.w, h: m.h, em: +h.toFixed(3) }
}

const SIZED = LOGOS.map((l) => ({ ...l, ...size(l.file) }))

/**
 * Slot k shows every n-th logo from k, so no logo can appear in two slots. A
 * slot left with a single logo borrows the first one, which is safe while slot
 * 0 holds exactly two: they show it on opposite ticks.
 */
function queuesFor(n: number) {
    const queues = Array.from({ length: n }, (_, k) => SIZED.filter((_, i) => i % n === k))
    for (const q of queues) if (q.length === 1 && queues[0].length === 2) q.push(SIZED[0])
    return queues
}

export default function TrustedBy() {
    const ref = useRef<HTMLElement>(null)
    const [tick, setTick] = useState(0)
    // no motion on first paint; only swaps animate
    const [swapped, setSwapped] = useState(false)
    const [slots, setSlots] = useState(SLOTS_WIDE)
    const queues = useMemo(() => queuesFor(slots), [slots])
    const perRow = slots / 2

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 640px)")
        const apply = () => setSlots(mq.matches ? SLOTS_NARROW : SLOTS_WIDE)
        apply()
        mq.addEventListener("change", apply)
        return () => mq.removeEventListener("change", apply)
    }, [])

    // advance every two seconds, but only while the strip is on screen
    useEffect(() => {
        const el = ref.current
        if (!el) return
        let timer = 0
        const start = () => {
            if (timer) return
            timer = window.setInterval(() => {
                setSwapped(true)
                setTick((t) => t + 1)
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
                        const cur = tick % queue.length
                        const prev = (tick - 1 + queue.length) % queue.length
                        // stagger along each row, the second row a beat behind the first
                        const delay = (slot % perRow) + Math.floor(slot / perRow) * 0.5
                        return (
                            <li key={slot} className={styles.slot} style={{ ["--i" as string]: delay }}>
                                {queue.map((logo, i) => (
                                    <Image
                                        key={logo.file}
                                        src={`/clients/color/${logo.file}`}
                                        alt={i === cur ? logo.name : ""}
                                        aria-hidden={i !== cur}
                                        width={logo.w}
                                        height={logo.h}
                                        className={styles.mark}
                                        data-state={i === cur ? "in" : swapped && i === prev ? "out" : "idle"}
                                        style={{ height: `${logo.em}em`, width: "auto" }}
                                    />
                                ))}
                            </li>
                        )
                    })}
                </ul>
            </div>
        </section>
    )
}
