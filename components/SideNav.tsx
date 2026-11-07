"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

import TextRoll from "@/components/ui/text-roll"

const LINKS = [
    { name: "Home", href: "/#home" },
    { name: "Services", href: "/#services" },
    { name: "Why Us", href: "/#why" },
    { name: "Work", href: "/#work" },
    { name: "About", href: "/#about" },
    { name: "Contact", href: "/contact" },
]

/** The panel's slide: quick to start, soft to land. */
const EASE = [0.76, 0, 0.24, 1] as const

/**
 * A fixed Menu button at the top right, on every part of the page, that opens
 * a black side panel of large rolling links (TextRoll). Closes on a link, the
 * backdrop, the button or Escape.
 */
export default function SideNav() {
    const [open, setOpen] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const firstLinkRef = useRef<HTMLAnchorElement>(null)

    useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
        window.addEventListener("keydown", onKey)
        // hold the page still behind the panel
        const root = document.documentElement
        const overflow = root.style.overflow
        root.style.overflow = "hidden"
        firstLinkRef.current?.focus({ preventScroll: true })
        const button = buttonRef.current
        return () => {
            window.removeEventListener("keydown", onKey)
            root.style.overflow = overflow
            button?.focus({ preventScroll: true })
        }
    }, [open])

    const close = () => setOpen(false)

    return (
        <>
            {/* lines up with the logo row in the hero at each size */}
            <button
                ref={buttonRef}
                type="button"
                aria-expanded={open}
                aria-controls="side-nav"
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((o) => !o)}
                className={`fixed top-4 right-4 z-[70] flex h-11 items-center gap-3 rounded-full pr-1.5 pl-5 text-[13px] font-semibold tracking-[0.12em] uppercase shadow-[0_10px_30px_rgba(12,12,13,0.18)] ring-1 transition-colors duration-300 ipad:top-8 ipad:right-12 desktop-sm:top-[37px] desktop-sm:right-25 ${
                    open ? "bg-white text-[#0c0c0d] ring-black/10" : "bg-[#0c0c0d] text-white ring-white/15"
                }`}
            >
                <span>{open ? "Close" : "Menu"}</span>
                <span
                    aria-hidden
                    className={`relative grid size-8 place-items-center rounded-full transition-colors duration-300 ${open ? "bg-[#0c0c0d]" : "bg-white"}`}
                >
                    <span
                        className={`absolute h-[1.5px] w-3.5 rounded-full transition-transform duration-300 ${open ? "translate-y-0 rotate-45 bg-white" : "-translate-y-[3px] bg-[#0c0c0d]"}`}
                    />
                    <span
                        className={`absolute h-[1.5px] w-3.5 rounded-full transition-transform duration-300 ${open ? "translate-y-0 -rotate-45 bg-white" : "translate-y-[3px] bg-[#0c0c0d]"}`}
                    />
                </span>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        key="backdrop"
                        aria-hidden
                        onClick={close}
                        className="fixed inset-0 z-[60] bg-black/35 backdrop-blur-[3px]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    />
                )}
                {open && (
                    <motion.aside
                        key="panel"
                        id="side-nav"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Site menu"
                        className="fixed inset-y-0 right-0 z-[65] flex w-full flex-col bg-[#0c0c0d] px-8 pt-28 pb-10 text-white ipad:w-[min(560px,90vw)] ipad:px-14 ipad:pt-36"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.65, ease: EASE }}
                    >
                        <p className="text-[12px] font-semibold tracking-[0.2em] text-white/40 uppercase">Navigation</p>

                        <nav aria-label="Main" className="flex flex-1 flex-col justify-center">
                            <ul className="flex list-none flex-col gap-4 ipad:gap-5">
                                {LINKS.map((link, i) => (
                                    <motion.li
                                        key={link.name}
                                        initial={{ opacity: 0, y: 32 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 16 }}
                                        transition={{ delay: 0.18 + i * 0.06, duration: 0.55, ease: EASE }}
                                    >
                                        <a
                                            ref={i === 0 ? firstLinkRef : undefined}
                                            href={link.href}
                                            onClick={close}
                                            // TextRoll prints each name twice (resting row and rolling row)
                                            aria-label={link.name}
                                            className="flex items-baseline gap-4 outline-offset-8"
                                        >
                                            <span className="w-6 text-[12px] font-medium text-white/35 tabular-nums">
                                                {String(i + 1).padStart(2, "0")}
                                            </span>
                                            <TextRoll className="text-[clamp(36px,10vw,58px)] leading-[0.85] font-extrabold tracking-[-0.03em] text-white uppercase dark:text-white">
                                                {link.name}
                                            </TextRoll>
                                        </a>
                                    </motion.li>
                                ))}
                            </ul>
                        </nav>

                        <motion.div
                            className="flex items-center justify-between gap-6 border-t border-white/10 pt-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                        >
                            <p className="text-[13px] leading-snug text-white/50">
                                Websites, business systems
                                <br />
                                and mobile apps.
                            </p>
                            <a
                                href="/contact"
                                onClick={close}
                                className="shrink-0 rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-[#0c0c0d] transition-colors hover:bg-[#e8e8e8]"
                            >
                                Let&rsquo;s Talk
                            </a>
                        </motion.div>
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    )
}
