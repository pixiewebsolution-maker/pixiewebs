import type { Metadata } from "next"
import SideNav from "@/components/SideNav"
import Footer from "@/components/Footer"
import LegalPage, { type LegalSection } from "@/components/legal/LegalPage"
import { EMAIL, PHONES } from "@/lib/contact"

const title = "Privacy Policy | Pixie Webs"
const description = "How Pixie Webs handles the information you share with us and what this website collects."

export const metadata: Metadata = {
    alternates: { canonical: "/privacy" },
    title,
    description,
    openGraph: { title, description, url: "/privacy" },
    twitter: { title, description },
}

const mail = <a href={`mailto:${EMAIL}`}>{EMAIL}</a>

const SECTIONS: LegalSection[] = [
    {
        heading: "Who we are",
        body: (
            <p>
                Pixie Webs is a digital studio in Kerala, India, that designs and builds websites, online stores,
                business systems and mobile apps. This policy covers this website and the information you share with
                us through it. You can reach us at {mail} or {PHONES[0].display}.
            </p>
        ),
    },
    {
        heading: "Information you give us",
        body: (
            <>
                <p>
                    Our contact form doesn&rsquo;t store anything on this website. When you press{" "}
                    <strong>Send on WhatsApp</strong>, it opens WhatsApp with your details written into a message:
                    your name, email, and anything else you chose to fill in, such as your company, phone number,
                    the services you need, your budget and your project description. Nothing is sent until you press
                    send in WhatsApp yourself.
                </p>
                <p>
                    If you message us on WhatsApp, email us or call us, we receive what you choose to share, along
                    with your phone number or email address.
                </p>
            </>
        ),
    },
    {
        heading: "Information collected automatically",
        body: (
            <>
                <p>
                    We use <strong>Vercel Web Analytics</strong> to understand how the site is used, such as which
                    pages are visited and how people find us. It doesn&rsquo;t use cookies, and it doesn&rsquo;t
                    identify you or follow you across other websites. It records things like:
                </p>
                <ul>
                    <li>the pages you visit and the page that sent you here</li>
                    <li>your country, and the type of device, browser and operating system you use</li>
                </ul>
                <p>
                    We only see these figures in total, not for any one person. Like any web host, our hosting
                    provider, Vercel, may also keep short-lived technical logs (for example, IP addresses) to run
                    the site securely.
                </p>
            </>
        ),
    },
    {
        heading: "How we use it",
        body: (
            <ul>
                <li>to reply to your enquiry and talk with you about your project</li>
                <li>to prepare proposals, quotes and, if we work together, to deliver and support your project</li>
                <li>to understand how the website is used, so we can improve it</li>
                <li>to keep the website secure and working properly</li>
            </ul>
        ),
    },
    {
        heading: "Who we share it with",
        body: (
            <>
                <p>
                    We don&rsquo;t sell or rent your information, and we don&rsquo;t use it for advertising. It is
                    handled by the services we use to run the site and talk with you:
                </p>
                <ul>
                    <li>
                        <strong>WhatsApp</strong> (Meta), when you message us there. Their own privacy policy applies
                        to what passes through their service.
                    </li>
                    <li>
                        <strong>Vercel</strong>, which hosts this website and provides its analytics.
                    </li>
                    <li>our email provider, when you email us</li>
                </ul>
                <p>We may also share information if the law requires us to.</p>
            </>
        ),
    },
    {
        heading: "Cookies",
        body: (
            <p>
                This website doesn&rsquo;t use cookies for tracking or advertising. Links to our social media pages
                (Instagram, LinkedIn and Threads) take you to those sites, where their own cookie and privacy policies
                apply.
            </p>
        ),
    },
    {
        heading: "How long we keep it",
        body: (
            <p>
                We keep enquiry conversations for as long as they&rsquo;re useful for the enquiry or project, and for
                any period the law requires, for example for accounts and invoices. Analytics figures are kept in
                total only. You can ask us to delete your messages at any time.
            </p>
        ),
    },
    {
        heading: "Keeping it safe",
        body: (
            <p>
                We take reasonable steps to protect the information you share with us and limit who can see it. No
                method of sending or storing information online is completely secure, but we work to keep yours safe.
            </p>
        ),
    },
    {
        heading: "Your choices and rights",
        body: (
            <p>
                You can ask us what information we hold about you, ask us to correct it, or ask us to delete it, in
                line with India&rsquo;s Digital Personal Data Protection Act, 2023 and other laws that apply to you.
                Email {mail} and we&rsquo;ll respond as soon as we can.
            </p>
        ),
    },
    {
        heading: "Children",
        body: (
            <p>
                This website is meant for businesses and adults. We don&rsquo;t knowingly collect information from
                children under 18. If you think a child has sent us their details, please contact us and we&rsquo;ll
                delete them.
            </p>
        ),
    },
    {
        heading: "Changes to this policy",
        body: (
            <p>
                We may update this policy from time to time. The date at the top of this page shows when it last
                changed.
            </p>
        ),
    },
    {
        heading: "Contact",
        body: (
            <p>
                Questions about this policy or your information? Email {mail} or call{" "}
                {PHONES.map((p, i) => (
                    <span key={p.tel}>
                        {i > 0 && " or "}
                        <a href={`tel:${p.tel}`}>{p.display}</a>
                    </span>
                ))}
                .
            </p>
        ),
    },
]

export default function Privacy() {
    return (
        <>
            <SideNav />
            <LegalPage
                title="Privacy"
                em="Policy."
                updated="9 November 2026"
                intro={
                    <p>
                        Your privacy matters to us. This page explains, in plain words, what information Pixie Webs
                        receives through this website, why, and what we do with it.
                    </p>
                }
                sections={SECTIONS}
            />
            <Footer />
        </>
    )
}
