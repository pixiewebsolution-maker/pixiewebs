"use client"

import { memo, useState, type FormEvent } from "react"
import { motion } from "motion/react"
import Logo from "@/components/Logo"
import Globe from "@/components/ui/globe"
import styles from "./ContactPage.module.css"

/*
 * Shown large under the heading once there's a confirmed address; until then
 * the line invites people to the form instead.
 */
const CONTACT_EMAIL: string = ""

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

/** drawn once: the form's state changes never re-render (and so never rebuild) the globe */
const ContactGlobe = memo(function ContactGlobe() {
    return <Globe {...GLOBE_PROPS} />
})

type Status = "idle" | "sending" | "sent" | "not-configured" | "error"

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

    const toggle = (s: string) => setServices((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]))

    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget
        if (!form.reportValidity()) return
        const data = Object.fromEntries(new FormData(form)) as Record<string, string>
        setStatus("sending")
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, services }),
            })
            if (res.ok) {
                setSentName(data.name?.split(" ")[0] ?? "")
                setStatus("sent")
                form.reset()
                setServices([])
                return
            }
            const body = await res.json().catch(() => ({}))
            setStatus(body.error === "not-configured" ? "not-configured" : "error")
        } catch {
            setStatus("error")
        }
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
                    {CONTACT_EMAIL ? (
                        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                    ) : (
                        <>Tell us about it below, and we&rsquo;ll take it from there.</>
                    )}
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
                                Your message is on its way. We&rsquo;ll read it properly and get back to you soon.
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
                                <button type="submit" className={styles.pill} disabled={status === "sending"}>
                                    {status === "sending" ? "Sending…" : "Send"}
                                    <span className={styles.pillIcon}>
                                        <Arrow />
                                    </span>
                                </button>
                                <p className={styles.note} role="status" aria-live="polite">
                                    {status === "not-configured" && "Our form isn't connected yet. Please try again a little later."}
                                    {status === "error" && "Something went wrong sending that. Please try again."}
                                </p>
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
