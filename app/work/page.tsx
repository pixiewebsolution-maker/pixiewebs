import type { Metadata } from "next"
import SideNav from "@/components/SideNav"
import WorksPage from "@/components/work/WorksPage"
import Footer from "@/components/Footer"

const title = "Our Works | Pixie Webs"
const description =
    "Business systems, online stores and websites Pixie Webs has built for brands in travel, hospitality, healthcare, retail and more."

export const metadata: Metadata = {
    alternates: { canonical: "/work" },
    title,
    description,
    openGraph: { title, description, url: "/work" },
    twitter: { title, description },
}

export default function Work() {
    return (
        <>
            <SideNav />
            <main>
                <WorksPage />
            </main>
            <Footer />
        </>
    )
}
