import type { Metadata } from "next"
import SideNav from "@/components/SideNav"
import Footer from "@/components/Footer"
import LegalPage, { type LegalSection } from "@/components/legal/LegalPage"
import { EMAIL, PHONES } from "@/lib/contact"

const title = "Terms & Conditions | Pixie Webs"
const description = "The terms for using the Pixie Webs website."

export const metadata: Metadata = {
    alternates: { canonical: "/terms" },
    title,
    description,
    openGraph: { title, description, url: "/terms" },
    twitter: { title, description },
}

const mail = <a href={`mailto:${EMAIL}`}>{EMAIL}</a>

const SECTIONS: LegalSection[] = [
    {
        heading: "About these terms",
        body: (
            <p>
                These terms apply to your use of this website, run by Pixie Webs, a digital studio in Kerala, India.
                By using the site, you agree to them. If you don&rsquo;t agree, please don&rsquo;t use the site.
            </p>
        ),
    },
    {
        heading: "Using this website",
        body: (
            <>
                <p>You&rsquo;re welcome to browse the site and contact us through it. Please don&rsquo;t:</p>
                <ul>
                    <li>use the site for anything unlawful, or in a way that harms others</li>
                    <li>try to break into, overload or disrupt the site or the systems behind it</li>
                    <li>copy or scrape the site&rsquo;s content in bulk, or send us spam through it</li>
                </ul>
            </>
        ),
    },
    {
        heading: "Our content",
        body: (
            <>
                <p>
                    The design, text, graphics and code of this website belong to Pixie Webs unless stated otherwise.
                    You may view and share links to it, but you may not copy, reuse or sell it without our written
                    permission.
                </p>
                <p>
                    The projects in Our Works are shown with our clients&rsquo; permission. Client names, logos and
                    trademarks belong to their owners and appear here only to show work we&rsquo;ve done.
                </p>
            </>
        ),
    },
    {
        heading: "Enquiries, quotes and projects",
        body: (
            <p>
                Information on this site, including service descriptions and answers in our FAQs, is general and may
                change. Sending us an enquiry doesn&rsquo;t create an agreement. Any project we take on is covered by
                a separate written proposal or agreement, which sets out its scope, timeline, price, payment terms and
                ownership, and takes priority over anything on this website.
            </p>
        ),
    },
    {
        heading: "Links to other websites",
        body: (
            <p>
                The site links to other websites, such as our clients&rsquo; sites, WhatsApp and our social media
                pages. We don&rsquo;t control those sites and aren&rsquo;t responsible for their content or how they
                handle your information.
            </p>
        ),
    },
    {
        heading: "No guarantees",
        body: (
            <p>
                We work to keep this website accurate and available, but it&rsquo;s provided as it is. We don&rsquo;t
                promise it will always be complete, error-free or uninterrupted.
            </p>
        ),
    },
    {
        heading: "Limitation of liability",
        body: (
            <p>
                As far as the law allows, Pixie Webs isn&rsquo;t liable for any loss or damage arising from your use
                of this website or from relying on its content. Nothing in these terms limits any liability that
                can&rsquo;t be limited under the law.
            </p>
        ),
    },
    {
        heading: "Privacy",
        body: (
            <p>
                How we handle information you share with us is explained in our <a href="/privacy">Privacy Policy</a>.
            </p>
        ),
    },
    {
        heading: "Changes to these terms",
        body: (
            <p>
                We may update these terms from time to time. The date at the top of this page shows when they last
                changed, and using the site after a change means you accept the updated terms.
            </p>
        ),
    },
    {
        heading: "Governing law",
        body: (
            <p>
                These terms are governed by the laws of India. Any dispute about them or this website will be handled
                by the courts of Kerala, India.
            </p>
        ),
    },
    {
        heading: "Contact",
        body: (
            <p>
                Questions about these terms? Email {mail} or call{" "}
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

export default function Terms() {
    return (
        <>
            <SideNav />
            <LegalPage
                title="Terms &"
                em="Conditions."
                updated="9 November 2026"
                intro={
                    <p>
                        Thanks for visiting Pixie Webs. These terms explain the rules for using this website. They
                        don&rsquo;t cover project work, which always has its own written agreement.
                    </p>
                }
                sections={SECTIONS}
            />
            <Footer />
        </>
    )
}
