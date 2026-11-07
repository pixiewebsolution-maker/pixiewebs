import type { Metadata, Viewport } from "next"
import { Montserrat } from "next/font/google"
import "./globals.css"

// the site's one typeface, used by every section
const montserrat = Montserrat({
    subsets: ["latin"],
    variable: "--font-montserrat",
    display: "swap",
})

export const metadata: Metadata = {
    title: "Pixie Webs",
    description:
        "From powerful websites to intelligent business systems and mobile applications, Pixie Webs turns ambitious ideas into digital experiences.",
}

export const viewport: Viewport = {
    themeColor: "#f6f6f3",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={montserrat.variable}>
            <body>{children}</body>
        </html>
    )
}
