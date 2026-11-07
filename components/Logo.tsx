import Image from "next/image"

type LogoProps = {
    className?: string
    title?: string
    /** "dark" for light backgrounds (public/logo-dark.png), "light" for dark ones (public/logo.png) */
    tone?: "dark" | "light"
}

/** The Pixie Webs "P" mark, cut from the brand file "logo bg.png" (transparent). */
export default function Logo({ className, title = "Pixie Webs", tone = "dark" }: LogoProps) {
    const src = tone === "dark" ? "/logo-dark.png" : "/logo.png"
    return <Image className={className} src={src} alt={title} width={178} height={214} priority />
}
