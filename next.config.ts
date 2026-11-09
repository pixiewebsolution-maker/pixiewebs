import type { NextConfig } from "next"

/** a week fresh, then served from cache while it refreshes in the background */
const IMAGE_CACHE = "public, max-age=604800, stale-while-revalidate=2592000"

const nextConfig: NextConfig = {
    images: {
        // AVIF first (smallest), WebP for browsers without it
        formats: ["image/avif", "image/webp"],
        // optimised images are cached for a month
        minimumCacheTTL: 2592000,
    },
    // the site's own images (screenshots, logos, service photos) rarely change,
    // so browsers keep them between visits instead of downloading them again
    async headers() {
        return ["/work/:path*", "/services/:path*", "/clients/:path*", "/originkit/:path*", "/logo.png", "/logo-dark.png"].map(
            (source) => ({ source, headers: [{ key: "Cache-Control", value: IMAGE_CACHE }] }),
        )
    },
}

export default nextConfig
