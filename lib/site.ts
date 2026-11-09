/*
 * The site's public address, used for share previews, the sitemap and
 * robots.txt. Set NEXT_PUBLIC_SITE_URL (in .env.local, or the host's
 * environment settings) to the live domain, for example https://pixiewebs.com.
 * On Vercel it falls back to the deployment's own address.
 */
export const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
    "http://localhost:3000"
).replace(/\/$/, "")

export const SITE_NAME = "Pixie Webs"

/** the home page's title in search results and link previews */
export const SITE_TITLE = "Pixie Webs | Websites, E-Commerce, ERP & Mobile Apps in Kerala"

export const SITE_DESCRIPTION =
    "Pixie Webs is a digital studio in Kerala, India, building fast websites, online stores, ERP & CRM systems and mobile apps that help businesses grow."
