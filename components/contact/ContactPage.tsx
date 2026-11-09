"use client"

import { memo, useEffect, useState, type FormEvent } from "react"
import dynamic from "next/dynamic"
import { motion } from "motion/react"
import Logo from "@/components/Logo"
import { EMAIL, PHONES, whatsappLink } from "@/lib/contact"
import styles from "./ContactPage.module.css"


const SERVICES = ["Website", "E-Commerce", "ERP & CRM", "Mobile App", "SEO & Support", "Something else"]
const TICKER = ["Websites", "E-Commerce", "ERP & CRM", "Mobile Apps", "SEO & Support"]

const EASE = [0.22, 0.8, 0.24, 1] as const

/*
 * The globe's look, in the site's colours: white land dots and coastlines on
 * a sphere a shade darker than the band. Kept in one constant, because the
 * globe rebuilds itself whenever an object prop is a new object.
 */
const GLOBE_PROPS = {
    speed: 2,
    smoothing: 8,
    dots: { color: "#ffffff", size: 4, density: 8, allDots: false },
    fill: "dots",
    // fills about 80% of its square, clear of the edges
    scale: 9.2,
    stopOnHover: true,
    markerConfig: { markers: [], color: "#ffffff", size: 40 },
    direction: "left",
    initialLatitude: 18,
    initialLongitude: -60,
    oceanColor: "#121214",
    outlineColor: "#ffffff",
    showOutline: true,
    showGrid: false,
    outlineWidth: 1,
    dragSpeed: 5,
    detail: 5,
}

/** the globe's code loads in its own chunk, so it never holds up the form and heading */
const Globe = dynamic(() => import("@/components/ui/globe"), { ssr: false })

/**
 * Drawn once: the form's state changes never re-render (and so never rebuild)
 * the globe. It starts once the browser is idle after the first paint, since
 * building its map of dots is heavy work on a phone.
 */
const ContactGlobe = memo(function ContactGlobe() {
    const [ready, setReady] = useState(false)
    useEffect(() => {
        const go = () => setReady(true)
        if ("requestIdleCallback" in window) {
            const id = window.requestIdleCallback(go, { timeout: 2500 })
            return () => window.cancelIdleCallback(id)
        }
        const t = setTimeout(go, 1200)
        return () => clearTimeout(t)
    }, [])
    return ready ? <Globe {...GLOBE_PROPS} /> : null
})

type Status = "idle" | "sent"

/** the form, written out as a WhatsApp message */
function toMessage(d: Record<string, string>, services: string[]) {
    // optional fields left empty are skipped (null); "" keeps a blank line
    const lines: (string | null)[] = [
        "Hi Pixie Webs, I'd like to talk about a project.",
        "",
        `Name: ${d.name.trim()}`,
        `Email: ${d.email.trim()}`,
        d.company?.trim() ? `Company: ${d.company.trim()}` : null,
        d.phone?.trim() ? `Phone: ${d.phone.trim()}` : null,
        services.length > 0 ? `Looking for: ${services.join(", ")}` : null,
        d.budget?.trim() ? `Budget: ${d.budget.trim()}` : null,
        "",
        "About the project:",
        d.message.trim(),
    ]
    return lines.filter((l): l is string => l !== null).join("\n")
}

function Arrow() {
    return (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
        </svg>
    )
}

/** one line of the heading, rising out of its own mask */
function Line({ children, delay, em }: { children: string; delay: number; em?: boolean }) {
    const Tag = em ? motion.em : motion.span
    return (
        <span className={styles.line}>
            <Tag initial={{ y: "105%" }} animate={{ y: "0%" }} transition={{ duration: 0.9, delay, ease: EASE }}>
                {children}
            </Tag>
        </span>
    )
}

/** an underlined field whose label sits on the line and floats up once it's in use */
function Field({
    name,
    label,
    type = "text",
    required,
    multiline,
    autoComplete,
}: {
    name: string
    label: string
    type?: string
    required?: boolean
    multiline?: boolean
    autoComplete?: string
}) {
    const id = `contact-${name}`
    const common = {
        id,
        name,
        required,
        autoComplete,
        placeholder: " ",
        className: styles.input,
    }
    return (
        <div className={styles.field}>
            {multiline ? (
                <textarea
                    {...common}
                    rows={1}
                    // grows with what's written
                    onInput={(e) => {
                        const t = e.currentTarget
                        t.style.height = "auto"
                        t.style.height = `${t.scrollHeight}px`
                    }}
                />
            ) : (
                <input {...common} type={type} />
            )}
            <label htmlFor={id} className={styles.label}>
                {label}
                {!required && <span className={styles.optional}> (optional)</span>}
            </label>
        </div>
    )
}

/**
 * The contact page, in the dark band: a two-tone statement, an underlined
 * form on the left, a turning wireframe globe on the right, and the services
 * running past in a ticker at the foot.
 */
export default function ContactPage() {
    const [services, setServices] = useState<string[]>([])
    const [status, setStatus] = useState<Status>("idle")
    const [sentName, setSentName] = useState("")
    /** the WhatsApp link for the last message, in case the new tab was blocked */
    const [sentLink, setSentLink] = useState("")

    const toggle = (s: string) => setServices((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]))

    // Send opens a WhatsApp chat with Pixie Webs, the message already written
    // out from the form; the visitor just presses send in WhatsApp.
    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget
        if (!form.reportValidity()) return
        const data = Object.fromEntries(new FormData(form)) as Record<string, string>
        // a field people never see; bots that fill it get nowhere
        if (data.website) return
        const link = whatsappLink(toMessage(data, services))
        window.open(link, "_blank", "noopener,noreferrer")
        setSentLink(link)
        setSentName(data.name?.split(" ")[0] ?? "")
        setStatus("sent")
        form.reset()
        setServices([])
    }

    return (
        <main className={styles.page}>
            {/* the logo lockup, as at the top of the home page */}
            <a href="/" className={styles.lockup} aria-label="Pixie Webs home">
                <Logo tone="light" className={styles.logo} />
                <span aria-hidden="true" className={styles.divider} />
                <span className={styles.brand}>PIXIE WEBS</span>
            </a>

            <section className={styles.hero}>
                <h1 className={styles.title}>
                    <Line delay={0.1}>Have a project in mind?</Line>
                    <Line delay={0.2} em>
                        Let&rsquo;s talk.
                    </Line>
                </h1>
                <motion.p
                    className={styles.reach}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
                >
                    <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                    <span className={styles.phones}>
                        {PHONES.map((p) => (
                            <a key={p.tel} href={`tel:${p.tel}`}>
                                {p.display}
                            </a>
                        ))}
                    </span>
                </motion.p>
            </section>

            <div className={styles.rule} />

            <section className={styles.body}>
                <motion.div
                    className={styles.formCol}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
                >
                    <p className={styles.tag}>Contact form</p>

                    {status === "sent" ? (
                        <div className={styles.sent} role="status">
                            <p className={styles.sentTitle}>Thank you{sentName ? `, ${sentName}` : ""}.</p>
                            <p className={styles.sentText}>
                                WhatsApp has opened with your message written out. Just press send there, and
                                we&rsquo;ll get back to you soon. If it didn&rsquo;t open,{" "}
                                <a href={sentLink} target="_blank" rel="noopener noreferrer">
                                    open WhatsApp here
                                </a>
                                .
                            </p>
                            <button type="button" className={styles.again} onClick={() => setStatus("idle")}>
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <form className={styles.form} onSubmit={submit} noValidate>
                            <Field name="name" label="Name" required autoComplete="name" />
                            <Field name="email" label="Email" type="email" required autoComplete="email" />
                            <Field name="company" label="Company" autoComplete="organization" />
                            <Field name="phone" label="Phone" type="tel" autoComplete="tel" />

                            <fieldset className={styles.services}>
                                <legend className={styles.legend}>What do you need?</legend>
                                <div className={styles.chips}>
                                    {SERVICES.map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            className={styles.chip}
                                            aria-pressed={services.includes(s)}
                                            onClick={() => toggle(s)}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </fieldset>

                            <Field name="message" label="Describe your project" required multiline />
                            <Field name="budget" label="Ballpark budget" />

                            {/* a field people never see; bots tend to fill it */}
                            <input type="text" name="website" tabIndex={-1} autoComplete="off" className={styles.trap} aria-hidden="true" />

                            <div className={styles.submitRow}>
                                <button type="submit" className={styles.pill}>
                                    Send on WhatsApp
                                    <span className={styles.pillIcon}>
                                        <Arrow />
                                    </span>
                                </button>
                                <p className={styles.note}>Opens WhatsApp with your message ready to send.</p>
                            </div>
                        </form>
                    )}
                </motion.div>

                <motion.div
                    className={styles.figure}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, delay: 0.4, ease: EASE }}
                >
                    <p className={styles.tag}>Fig. 01 &mdash; Working with businesses, near and far</p>
                    <div className={styles.globe}>
                        <ContactGlobe />
                    </div>
                </motion.div>
            </section>

            {/* the services, running past */}
            <div className={styles.ticker} aria-hidden="true">
                <div className={styles.tickerTrack}>
                    {[0, 1].map((copy) => (
                        <div key={copy} className={styles.tickerGroup}>
                            {TICKER.map((t) => (
                                <span key={t} className={styles.tickerItem}>
                                    {t}
                                    <span className={styles.tickerDash} />
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}
