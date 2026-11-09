import type { Metadata, Viewport } from "next"
import { Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site"
import StructuredData from "@/components/StructuredData"

// the site's one typeface, used by every section
const montserrat = Montserrat({
    subsets: ["latin"],
    variable: "--font-montserrat",
    display: "swap",
})

export const metadata: Metadata = {
    // the live address, so share previews and the sitemap use full links (lib/site.ts)
    metadataBase: new URL(SITE_URL),
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    applicationName: SITE_NAME,
    keywords: [
        "web design Kerala",
        "website development Kerala",
        "e-commerce website development",
        "ERP software development",
        "CRM development",
        "mobile app development Kerala",
        "digital agency Kerala",
        "Pixie Webs",
    ],
    alternates: { canonical: "/" },
    formatDetection: { telephone: false },
    // the share image is app/opengraph-image.png (and twitter-image.png)
    openGraph: {
        type: "website",
        siteName: SITE_NAME,
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        url: "/",
        locale: "en_IN",
    },
    twitter: {
        card: "summary_large_image",
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
    },
}

export const viewport: Viewport = {
    themeColor: "#f6f6f3",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={montserrat.variable}>
            <body>
                <StructuredData />
                {children}
                {/* Vercel Web Analytics: visit counts without cookies; switch it on under
                    the project's Analytics tab in Vercel */}
                <Analytics />
            </body>
        </html>
    )
}
