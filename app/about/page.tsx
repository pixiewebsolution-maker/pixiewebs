import type { Metadata } from "next"
import SideNav from "@/components/SideNav"
import AboutPage from "@/components/about/AboutPage"
import Footer from "@/components/Footer"

const title = "About | Pixie Webs"
const description =
    "Pixie Webs is a digital studio from Kerala, India, building websites, online stores, business systems and mobile apps that move businesses forward."

export const metadata: Metadata = {
    alternates: { canonical: "/about" },
    title,
    description,
    openGraph: { title, description, url: "/about" },
    twitter: { title, description },
}

export default function About() {
    return (
        <>
            <SideNav />
            <AboutPage />
            <Footer />
        </>
    )
}
