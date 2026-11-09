import { EMAIL, PHONES, SOCIALS } from "@/lib/contact"
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site"

/**
 * Structured data (schema.org JSON-LD) on every page, so search engines know
 * who Pixie Webs is: a professional service in Kerala, India, its contact
 * details, social profiles and what it offers. This feeds Google's knowledge
 * panel and rich results.
 */
export default function StructuredData() {
    const org = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "ProfessionalService",
                "@id": `${SITE_URL}/#business`,
                name: SITE_NAME,
                url: `${SITE_URL}/`,
                logo: `${SITE_URL}/icon.png`,
                image: `${SITE_URL}/opengraph-image.png`,
                description: SITE_DESCRIPTION,
                email: EMAIL,
                telephone: PHONES.map((p) => p.tel),
                address: { "@type": "PostalAddress", addressRegion: "Kerala", addressCountry: "IN" },
                areaServed: ["India", "United Arab Emirates", "Worldwide"],
                sameAs: SOCIALS.map((s) => s.href),
                contactPoint: PHONES.map((p) => ({
                    "@type": "ContactPoint",
                    telephone: p.tel,
                    email: EMAIL,
                    contactType: "sales",
                    availableLanguage: ["English", "Malayalam"],
                })),
                knowsAbout: [
                    "Web design",
                    "Website development",
                    "E-commerce development",
                    "ERP and CRM development",
                    "Mobile app development",
                    "UI/UX design",
                    "SEO",
                ],
                hasOfferCatalog: {
                    "@type": "OfferCatalog",
                    name: "Services",
                    itemListElement: [
                        "Website design & development",
                        "E-commerce stores",
                        "ERP & CRM systems",
                        "Mobile apps",
                        "SEO & ongoing support",
                    ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
                },
            },
            {
                "@type": "WebSite",
                "@id": `${SITE_URL}/#website`,
                url: `${SITE_URL}/`,
                name: SITE_NAME,
                publisher: { "@id": `${SITE_URL}/#business` },
                inLanguage: "en",
            },
        ],
    }
    return (
        <script
            type="application/ld+json"
            // JSON-LD must be raw JSON in the page; "<" is escaped so the text can't close the tag
            dangerouslySetInnerHTML={{ __html: JSON.stringify(org).replace(/</g, "\\u003c") }}
        />
    )
}
