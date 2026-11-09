import Image from "next/image"

type LogoProps = {
    className?: string
    title?: string
    /** "dark" for light backgrounds (public/logo-dark.png), "light" for dark ones (public/logo.png) */
    tone?: "dark" | "light"
}

/**
 * The Pixie Webs "P" mark, cut from the brand file "logo bg.png" (transparent).
 * Its alt text is empty by default: everywhere it appears, the name "PIXIE
 * WEBS" is written right beside it, so a screen reader would say it twice.
 * Pass `title` where the mark stands alone.
 */
export default function Logo({ className, title = "", tone = "dark" }: LogoProps) {
    const src = tone === "dark" ? "/logo-dark.png" : "/logo.png"
    return <Image className={className} src={src} alt={title} width={178} height={214} priority />
}
