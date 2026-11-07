import type { Metadata } from "next"
import SideNav from "@/components/SideNav"
import ContactPage from "@/components/contact/ContactPage"
import Footer from "@/components/Footer"

export const metadata: Metadata = {
    title: "Contact | Pixie Webs",
    description: "Tell us about your website, store, business system or app, and we'll take it from there.",
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
