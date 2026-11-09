/*
 * Every project Pixie Webs has shipped, in one list. The /work page shows all
 * of them; the home page's Our Works section shows the ones marked `featured`.
 *
 * To add a live link: put the site's address in `href` (for example
 * "https://sezocabs.com"). While `href` is empty the project shows without a
 * Visit button, which suits internal systems like the ERPs.
 *
 * Screens are WebP copies of assets/originals/our-works, in public/work/all, named
 * <slug>-<n>-<width>.webp at 960 and 1600px wide. `screens` is how many there
 * are; the first one is the cover. The one-line blurbs were written from the
 * screenshots, so check them.
 */

export type CategoryId = "erp" | "ecommerce" | "website"

export type Work = {
    slug: string
    name: string
    category: CategoryId
    /** the short line above the name: what kind of business or system it is */
    kind: string
    blurb: string
    /** the live site, or "" until there is one */
    href: string
    /** how many screens are in public/work/all for this project */
    screens: number
    /** shown in the home page's Our Works section, using this image in public/work/featured */
    featured?: string
}

export const CATEGORIES: { id: CategoryId; label: string; tagline: string }[] = [
    { id: "erp", label: "ERP Systems", tagline: "Business systems built around how each team works." },
    { id: "ecommerce", label: "E-Commerce", tagline: "Online stores that turn browsing into buying." },
    { id: "website", label: "Websites", tagline: "Sites that give a brand a first impression worth keeping." },
]

export const WORKS: Work[] = [
    // ── ERP systems ──
    {
        slug: "radwa",
        name: "Radwa ERP",
        category: "erp",
        kind: "HR & operations",
        blurb: "An HR-led ERP covering employees, departments, attendance, leave and documents, with live summaries for managers.",
        href: "",
        screens: 3,
        featured: "erp-radwa",
    },
    {
        slug: "billing-suite",
        name: "Projects & Billing Suite",
        category: "erp",
        kind: "Projects & invoicing",
        blurb: "A projects and billing system that tracks clients, project status, deadlines and invoices from a single dashboard.",
        href: "",
        screens: 3,
        featured: "erp-billing",
    },
    {
        slug: "smilecare",
        name: "SmileCare Dental",
        category: "erp",
        kind: "Dental clinic",
        blurb: "A clinic system for a dental practice: appointments, the patient queue, walk-ins, treatments and payments on one dashboard.",
        href: "",
        screens: 3,
        featured: "erp-smilecare",
    },
    {
        slug: "pitstop",
        name: "Pitstop Workshop Manager",
        category: "erp",
        kind: "Car wash & workshop",
        blurb: "A workshop system for a car wash: job cards, clients and vehicles, staff attendance, GST billing, stock and revenue on one screen.",
        href: "",
        screens: 3,
    },
    {
        slug: "arabian-mandhi",
        name: "Arabian Mandhi Billing",
        category: "erp",
        kind: "Restaurant billing",
        blurb: "A restaurant billing system: table orders sent to the kitchen, GST bills, cash, card and UPI payments, and the day's revenue.",
        href: "",
        screens: 3,
    },

    // ── E-commerce ──
    {
        slug: "boss-perfumes",
        name: "Boss Perfumes",
        category: "ecommerce",
        kind: "Fragrance store",
        blurb: "A refined online store for a perfume brand, built around its collections and signature fragrances.",
        href: "https://bossperfumes.com/",
        screens: 1,
        featured: "shop-boss",
    },
    {
        slug: "moven",
        name: "Moven Active",
        category: "ecommerce",
        kind: "Activewear store",
        blurb: "A clean online store for a performance activewear brand, built around big product imagery and a quick checkout.",
        href: "https://movenactive.com/",
        screens: 1,
        featured: "shop-moven",
    },
    {
        slug: "velastia",
        name: "Velastia",
        category: "ecommerce",
        kind: "Cosmetics store",
        blurb: "A rich, luxurious storefront for a cosmetics brand, with offers and collections up front.",
        href: "",
        screens: 1,
        featured: "shop-velastia",
    },
    {
        slug: "lakaffy",
        name: "Lakaffy",
        category: "ecommerce",
        kind: "Coffee store",
        blurb: "A bold online store for a small-batch coffee roaster, with single-origin beans, instant coffee and brew guides from Karnataka's estates.",
        href: "https://lakaffy.com/",
        screens: 1,
    },
    {
        slug: "atl",
        name: "Accurate Trade Links",
        category: "ecommerce",
        kind: "Weighing systems",
        blurb: "A product site for a weighing systems company, from retail counters to industrial floors.",
        href: "https://accuratetradelinks.com/",
        screens: 1,
    },
    {
        slug: "guardexo",
        name: "GuardExo",
        category: "ecommerce",
        kind: "Speciality chemicals",
        blurb: "A product site for a biocides and preservatives brand, organised by product range and industry.",
        href: "",
        screens: 1,
    },

    // ── Websites ──
    {
        slug: "sezo-cabs",
        name: "Sezo Cabs",
        category: "website",
        kind: "Travel & cabs",
        blurb: "A premium travel site for luxury journeys and airport transfers across Kerala, with WhatsApp bookings.",
        href: "https://sezocabs.com/",
        screens: 1,
        featured: "web-kerala-travel",
    },
    {
        slug: "rogue-ninja",
        name: "Rogue Ninja",
        category: "website",
        kind: "Fight gym",
        blurb: "A bold, high-energy site for a fight gym, with its programs, gallery and sign-ups.",
        href: "https://rogueninja.in/",
        screens: 1,
        featured: "web-rogue-ninja",
    },
    {
        slug: "ondezyn",
        name: "Ondezyn",
        category: "website",
        kind: "Fashion studio",
        blurb: "An editorial site for a bridal fashion studio, showing its custom designs and collections.",
        href: "https://ondezyn.com/",
        screens: 1,
        featured: "web-ondezyn",
    },
    {
        slug: "vesper",
        name: "Vesper Wedding Company",
        category: "website",
        kind: "Wedding planning",
        blurb: "A cinematic site for a wedding planning and design studio in the UAE, built around the evenings it creates.",
        href: "https://www.vesperweddingcompany.com/",
        screens: 1,
    },
    {
        slug: "raha",
        name: "Raha Convention Centre",
        category: "website",
        kind: "Events venue",
        blurb: "A site for a convention centre, showing its spaces, events, reviews and reservations.",
        href: "https://www.rahaconventioncentre.in/",
        screens: 1,
    },
    {
        slug: "trishika",
        name: "Trishika Saloon & Spa",
        category: "website",
        kind: "Salon & wellness",
        blurb: "An elegant site for a luxury salon and wellness spa, in a calm gold-on-navy look.",
        href: "https://www.trishikasaloonandwellnessspa.com/",
        screens: 1,
    },
    {
        slug: "voiture",
        name: "Voiture",
        category: "website",
        kind: "Car & bike marketplace",
        blurb: "A marketplace for premium cars and bikes from verified dealers and individual sellers.",
        href: "",
        screens: 1,
    },
    {
        slug: "sri-sai",
        name: "Sri Sai Shipping Agencies",
        category: "website",
        kind: "Logistics",
        blurb: "A site for a freight forwarding company, covering its services, port operations and global logistics.",
        href: "https://www.srisaishipping.com/",
        screens: 1,
    },
    {
        slug: "kerala-mist",
        name: "Kerala Mist",
        category: "website",
        kind: "Kerala tours",
        blurb: "A tour operator site for custom trips across Munnar, Alleppey, Kochi and more, with WhatsApp enquiries.",
        href: "https://www.kerala-mist.com/",
        screens: 1,
    },
    {
        slug: "flynova",
        name: "Flynova",
        category: "website",
        kind: "Travel agency",
        blurb: "A travel agency site for tour packages across India, led by big destination imagery.",
        href: "https://www.flynovareisen.in/",
        screens: 1,
    },
    {
        slug: "zenvitaa",
        name: "Zenvitaa Exports",
        category: "website",
        kind: "Food exports",
        blurb: "A site for a Kerala food ingredients exporter: coconut products, coir mats and more, shipped worldwide.",
        href: "https://www.zenvitaaexports.com/",
        screens: 1,
    },
    {
        slug: "why-marketing",
        name: "Why Marketing",
        category: "website",
        kind: "Brand consultancy",
        blurb: "A site for a marketing and brand consultancy, with a free website and social media audit up front.",
        href: "https://www.whymarketing.in/",
        screens: 1,
    },
    {
        slug: "dr-priyanka",
        name: "Dr. Priyanka NP",
        category: "website",
        kind: "Research portfolio",
        blurb: "A personal site for a cardiovascular research scientist, with her research, publications and technologies.",
        href: "",
        screens: 1,
    },
]

/** one screen of a project, at 960 or 1600px wide */
export const screen = (slug: string, n: number, w: 960 | 1600 = 1600) => `/work/all/${slug}-${n}-${w}.webp`

/** where a project's link goes: the live site if there is one, else its card on /work */
export const workLink = (w: Work) => w.href || `/work#${w.slug}`
