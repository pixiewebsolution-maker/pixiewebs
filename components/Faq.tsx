"use client"

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import styles from "./Faq.module.css"

type QA = { q: string; a: string }

/*
 * Starter questions and answers, grouped by service. The answers stay general
 * on purpose (no prices, fixed timelines or guarantees); review them and adjust
 * to how Pixie Webs actually works before launch.
 */
const CATEGORIES: { label: string; faqs: QA[] }[] = [
    {
        label: "General",
        faqs: [
            {
                q: "How do we get started?",
                a: "Tell us about your business and what you want to build, through the contact form or a quick call. We'll ask a few questions, suggest an approach, and share a proposal with the scope and timeline before any work begins.",
            },
            {
                q: "How much does a project cost?",
                a: "Every project is quoted on its own scope: the features, pages, integrations and platforms involved. After a short discussion we share a clear, itemised quote, so you know exactly what you're paying for before we start.",
            },
            {
                q: "How long does a project take?",
                a: "It depends on the scope. A focused business website usually takes a few weeks, while online stores, custom systems and apps take longer. We agree on a clear timeline with you up front, broken into milestones.",
            },
            {
                q: "How will we stay updated during the project?",
                a: "You'll have one point of contact, regular progress updates, and a review at each milestone, so you always know where things stand and can give feedback before we move on.",
            },
            {
                q: "Can you work with our existing brand and designs?",
                a: "Yes. We can build on your logo, colours, brand guidelines or designs you already have, or create a fresh visual direction with you if you're starting out.",
            },
        ],
    },
    {
        label: "Websites",
        faqs: [
            {
                q: "Will my website work well on phones and tablets?",
                a: "Yes. Every site we build is responsive: it adapts to phones, tablets, laptops and large screens, and we test it across devices and browsers before launch.",
            },
            {
                q: "Can you redesign my existing website?",
                a: "Yes. We can refresh the design of your current site or rebuild it on a modern stack, keeping your content, and your search rankings where possible, while improving speed and usability.",
            },
            {
                q: "Will I be able to update the content myself?",
                a: "If you'd like to, yes. We can set up an easy-to-use content management system so your team can edit pages, images and posts without touching any code.",
            },
            {
                q: "Will my website be optimised for search engines?",
                a: "Every site is built with technical SEO in mind: fast loading, clean structure, proper metadata and mobile-friendliness. For ongoing growth, our Digital Growth & Support service covers SEO beyond launch.",
            },
            {
                q: "Do you help with the domain and hosting?",
                a: "Yes. We can help you choose and set up a domain and reliable hosting, or work with the domain and hosting you already have.",
            },
        ],
    },
    {
        label: "E-Commerce",
        faqs: [
            {
                q: "Which e-commerce platforms do you work with?",
                a: "We build stores on WooCommerce and Shopify, and fully custom e-commerce when you need something those platforms can't do. We'll recommend the right fit for your products, budget and growth plans.",
            },
            {
                q: "Can my customers pay online?",
                a: "Yes. We integrate trusted payment gateways so customers can pay by card, UPI, net banking or wallets, depending on the gateway you choose.",
            },
            {
                q: "Can I manage products, orders and stock myself?",
                a: "Yes. You'll have a dashboard to add and edit products, track orders and keep stock levels up to date, and we'll show your team how to use it.",
            },
            {
                q: "Can you move my existing store to a new platform?",
                a: "Yes. We can migrate your products, customers and order history to a new platform where the platforms allow it, and set up redirects so you keep your search traffic.",
            },
            {
                q: "Will my store be fast and secure?",
                a: "We build for speed and follow security best practices, including SSL, secure checkout and regular updates, so shopping feels quick and safe.",
            },
        ],
    },
    {
        label: "ERP & CRM",
        faqs: [
            {
                q: "Can you build a custom ERP or CRM for my business?",
                a: "Yes. We build business management systems around the way your team already works, from sales and customers to inventory, billing and reports, and can automate the repetitive tasks in between.",
            },
            {
                q: "Why choose a custom system over an off-the-shelf tool?",
                a: "Off-the-shelf tools often make you change how you work. A custom system fits your processes, includes only what you need, and can grow with your business.",
            },
            {
                q: "Can it connect with the tools we already use?",
                a: "Usually, yes. We can integrate with accounting software, payment gateways, email, messaging and other services through their APIs where they're available.",
            },
            {
                q: "Can our team use it on their phones?",
                a: "Yes. Systems are built to work in the browser on desktops, tablets and phones, and can come with a companion mobile app if your team needs one.",
            },
            {
                q: "Can you move our existing data into the new system?",
                a: "Yes. We can import your data from spreadsheets or your current software, cleaned up and mapped to the new system, so your team starts with everything in place.",
            },
        ],
    },
    {
        label: "Apps",
        faqs: [
            {
                q: "Do you develop apps for both Android and iOS?",
                a: "Yes. We build native Android and iOS apps as well as cross-platform apps that share one codebase, so you can reach users on both.",
            },
            {
                q: "Native or cross-platform: which is right for me?",
                a: "Cross-platform shares one codebase and suits most business apps; native suits apps that need the deepest device features or performance. We'll recommend one based on your goals and budget.",
            },
            {
                q: "Do you publish the app to the stores?",
                a: "Yes. We prepare the listings and handle submission to the Google Play Store and Apple App Store, and guide you through any review feedback.",
            },
            {
                q: "Can the app connect to my website or existing system?",
                a: "Yes. Apps can share data with your website, store or business system through APIs, so everything stays in sync.",
            },
            {
                q: "Do you update the app after launch?",
                a: "Yes. We can keep your app compatible with new Android and iOS versions, fix issues and add features as your users' needs grow.",
            },
        ],
    },
    {
        label: "SEO & Support",
        faqs: [
            {
                q: "What happens after my website goes live?",
                a: "We stay with you. We offer maintenance and technical support to keep your site secure, updated and running smoothly, and we're here when you want to add features or grow further.",
            },
            {
                q: "What does your SEO service include?",
                a: "Technical improvements, on-page optimisation, content guidance and regular reporting, so you can see how your visibility grows over time.",
            },
            {
                q: "Do you offer maintenance plans?",
                a: "Yes. Ongoing maintenance covers updates, backups, security monitoring and small changes, so your platforms keep running smoothly.",
            },
            {
                q: "What if something stops working?",
                a: "Get in touch and we'll investigate and fix it. Clients on a maintenance plan get priority support.",
            },
            {
                q: "Can you improve a site you didn't build?",
                a: "Yes. We can audit an existing site's speed, SEO and usability, then fix what's holding it back, whether that's a few changes or a rebuild.",
            },
        ],
    },
]

const EASE = [0.22, 0.8, 0.24, 1] as const
const pad = (n: number) => String(n).padStart(2, "0")
/** pinning needs a screen tall enough to hold the title, tabs and a few rows */
const PIN_QUERY = "(min-height: 560px)"

/** a set of questions comes in row by row */
const listMotion = {
    hidden: {},
    shown: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}
const rowMotion = {
    hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
    shown: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: EASE } },
}

function Arrow() {
    return (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
        </svg>
    )
}

function ContactCard({ className }: { className: string }) {
    return (
        <div className={`${styles.contact} ${className}`}>
            <p className={styles.contactTitle}>Still have a question?</p>
            <p className={styles.contactText}>
                Tell us what you&rsquo;re planning and we&rsquo;ll walk you through how we&rsquo;d build it.
            </p>
            <a href="/contact" className={styles.pill}>
                Discuss Your Project
                <span className={styles.pillIcon}>
                    <Arrow />
                </span>
            </a>
        </div>
    )
}

/**
 * One line of the title, rising out of its own mask. The mask watches for
 * the scroll: the line itself starts fully hidden by it, so it would never
 * count as in view.
 */
function TitleLine({ children, delay, em }: { children: string; delay: number; em?: boolean }) {
    const Tag = em ? motion.em : motion.span
    return (
        <motion.span className={styles.titleLine} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.5 }}>
            <Tag
                variants={{ hidden: { y: "105%" }, shown: { y: "0%" } }}
                transition={{ duration: 0.9, delay, ease: EASE }}
            >
                {children}
            </Tag>
        </motion.span>
    )
}

/**
 * FAQ, in the dark band that runs on from Testimonials. The section holds the
 * screen while the page scrolls past it, and the scroll moves only the
 * questions: the title, the contact card and the tabs stay put, and a rail
 * beside the list fills as you go. Tabs switch between the question sets for
 * each service; the open question lifts onto a glass panel with a lit bar,
 * like the active row in Services.
 */
export default function Faq() {
    const id = useId()
    const [cat, setCat] = useState(0)
    const [open, setOpen] = useState<number | null>(0)
    const [pinned, setPinned] = useState(false)
    // how far the questions run past their window: the extra scroll the section needs
    const [extra, setExtra] = useState(0)

    const scrollerRef = useRef<HTMLDivElement>(null)
    const viewportRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const extraRef = useRef(0)

    useEffect(() => {
        const mq = window.matchMedia(PIN_QUERY)
        const sync = () => setPinned(mq.matches)
        sync()
        mq.addEventListener("change", sync)
        return () => mq.removeEventListener("change", sync)
    }, [])

    // Moves the questions by however far the page has scrolled into the
    // section, and fills the rail to match.
    const place = useCallback(() => {
        const scroller = scrollerRef.current
        const content = contentRef.current
        if (!scroller || !content) return
        const max = extraRef.current
        const y = pinned ? Math.min(max, Math.max(0, -scroller.getBoundingClientRect().top)) : 0
        content.style.transform = y ? `translate3d(0, ${-y}px, 0)` : ""
        scroller.style.setProperty("--p", max ? (y / max).toFixed(4) : "0")
    }, [pinned])

    // Re-measure whenever the questions change height (a tab, an answer opening).
    useLayoutEffect(() => {
        const viewport = viewportRef.current
        const content = contentRef.current
        if (!viewport || !content) return
        const measure = () => {
            const over = pinned ? Math.max(0, Math.ceil(content.scrollHeight - viewport.clientHeight)) : 0
            extraRef.current = over
            setExtra(over)
            place()
        }
        measure()
        const ro = new ResizeObserver(measure)
        ro.observe(viewport)
        ro.observe(content)
        return () => ro.disconnect()
    }, [pinned, place])

    useEffect(() => {
        if (!pinned) return
        window.addEventListener("scroll", place, { passive: true })
        window.addEventListener("resize", place)
        return () => {
            window.removeEventListener("scroll", place)
            window.removeEventListener("resize", place)
        }
    }, [pinned, place])

    /** the page position at which the questions are scrolled by `y` */
    const pageTopFor = (y: number) => {
        const scroller = scrollerRef.current
        return scroller ? scroller.getBoundingClientRect().top + window.scrollY + y : 0
    }

    // A new set starts at its first question, at the top of the window.
    const pick = (i: number, el: HTMLElement) => {
        // a tab partly off the edge of a narrow bar slides into view
        el.scrollIntoView({ block: "nearest", inline: "nearest" })
        if (i === cat) return
        setCat(i)
        setOpen(0)
        const scroller = scrollerRef.current
        if (pinned && scroller && scroller.getBoundingClientRect().top < 0) {
            window.scrollTo({ top: pageTopFor(0), behavior: "auto" })
        }
    }

    // Keyboard focus on a question outside the window scrolls the page to it.
    const reveal = (li: HTMLElement | null) => {
        const viewport = viewportRef.current
        const scroller = scrollerRef.current
        if (!pinned || !li || !viewport || !scroller) return
        const y = Math.max(0, -scroller.getBoundingClientRect().top)
        const top = li.offsetTop
        const bottom = top + li.offsetHeight
        if (top >= y && bottom <= y + viewport.clientHeight) return
        const target = Math.min(extraRef.current, Math.max(0, top - 16))
        window.scrollTo({ top: pageTopFor(target), behavior: "auto" })
    }

    const faqs = CATEGORIES[cat].faqs

    return (
        <div
            ref={scrollerRef}
            className={styles.scroller}
            data-pinned={pinned}
            data-scrollable={extra > 0}
            // one screen, plus however far the questions run past their window
            style={pinned ? { height: `calc(100svh + ${extra}px)` } : undefined}
        >
            <section id="faq" className={styles.section} aria-labelledby={`${id}-title`}>
                <div className={styles.inner}>
                    <div className={styles.side}>
                        <div className={styles.head}>
                            <h2 id={`${id}-title`} className={styles.title}>
                                <TitleLine delay={0} em>
                                    FAQs
                                </TitleLine>
                            </h2>
                            <motion.p
                                className={styles.lede}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.8 }}
                                transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
                            >
                                What clients usually ask us before a project starts. Pick a service to see its questions.
                            </motion.p>
                        </div>
                        <motion.div
                            className={styles.contactSide}
                            initial={{ opacity: 0, y: 28 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
                        >
                            <ContactCard className="" />
                        </motion.div>
                    </div>

                    <div className={styles.main}>
                        {/* one row of tabs in a glass bar; it scrolls sideways if the screen is too narrow */}
                        <motion.div
                            className={styles.tabsWrap}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.8 }}
                            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
                        >
                            <div className={styles.tabs} role="tablist" aria-label="FAQ topics">
                                {CATEGORIES.map((c, i) => (
                                    <button
                                        key={c.label}
                                        type="button"
                                        role="tab"
                                        id={`${id}-tab${i}`}
                                        aria-selected={i === cat}
                                        aria-controls={`${id}-panel`}
                                        className={styles.tab}
                                        data-active={i === cat}
                                        onClick={(e) => pick(i, e.currentTarget)}
                                    >
                                        {i === cat && (
                                            <motion.span
                                                layoutId={`${id}-tab-pill`}
                                                className={styles.tabPill}
                                                transition={{ type: "spring", stiffness: 420, damping: 36 }}
                                            />
                                        )}
                                        <span className={styles.tabLabel}>{c.label}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        <div className={styles.listWrap}>
                            {/* fills as the page scrolls through the questions */}
                            <span className={styles.rail} aria-hidden="true">
                                <span className={styles.railFill} />
                            </span>

                            {/* the window the questions scroll through */}
                            <div ref={viewportRef} className={styles.viewport}>
                                <div ref={contentRef} className={styles.content}>
                                    <motion.ul
                                        key={cat}
                                        id={`${id}-panel`}
                                        role="tabpanel"
                                        aria-labelledby={`${id}-tab${cat}`}
                                        className={styles.list}
                                        variants={listMotion}
                                        initial="hidden"
                                        whileInView="shown"
                                        viewport={{ once: true, amount: 0.15 }}
                                    >
                                        {faqs.map((f, i) => {
                                            const isOpen = open === i
                                            return (
                                                <motion.li key={f.q} className={styles.row} data-open={isOpen} variants={rowMotion}>
                                                    <h3>
                                                        <button
                                                            type="button"
                                                            id={`${id}-q${i}`}
                                                            className={styles.q}
                                                            aria-expanded={isOpen}
                                                            aria-controls={`${id}-a${i}`}
                                                            onClick={() => setOpen(isOpen ? null : i)}
                                                            onFocus={(e) => reveal(e.currentTarget.closest("li"))}
                                                        >
                                                            <span className={styles.num}>{pad(i + 1)}</span>
                                                            <span className={styles.text}>{f.q}</span>
                                                            <span className={styles.icon} aria-hidden="true">
                                                                <svg viewBox="0 0 14 14" fill="none">
                                                                    <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                                                </svg>
                                                            </span>
                                                        </button>
                                                    </h3>
                                                    <AnimatePresence initial={false}>
                                                        {isOpen && (
                                                            <motion.div
                                                                key="answer"
                                                                id={`${id}-a${i}`}
                                                                role="region"
                                                                aria-labelledby={`${id}-q${i}`}
                                                                className={styles.answerWrap}
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.45, ease: EASE }}
                                                            >
                                                                {/* the words settle in just after the row opens */}
                                                                <motion.p
                                                                    className={styles.answer}
                                                                    initial={{ y: 10, filter: "blur(4px)" }}
                                                                    animate={{ y: 0, filter: "blur(0px)" }}
                                                                    transition={{ duration: 0.5, delay: 0.08, ease: EASE }}
                                                                >
                                                                    {f.a}
                                                                </motion.p>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </motion.li>
                                            )
                                        })}
                                    </motion.ul>
                                    {/* on phones the contact card closes the list */}
                                    <ContactCard className={styles.contactEnd} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
