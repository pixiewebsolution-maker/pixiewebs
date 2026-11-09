import type { Metadata } from "next"
import SideNav from "@/components/SideNav"
import ContactPage from "@/components/contact/ContactPage"
import Footer from "@/components/Footer"

const title = "Contact | Pixie Webs"
const description =
    "Tell us about your website, store, business system or app, and we'll take it from there."

export const metadata: Metadata = {
    alternates: { canonical: "/contact" },
    title,
    description,
    openGraph: { title, description, url: "/contact" },
    twitter: { title, description },
}

export default function Contact() {
    return (
        <>
            <SideNav />
            <ContactPage />
            <Footer />
        </>
    )
}
