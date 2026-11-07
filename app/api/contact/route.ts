/**
 * The contact form's endpoint. It checks the fields, then forwards the message
 * as JSON to CONTACT_FORWARD_URL: any service that takes a JSON POST, such as a
 * Formspree form endpoint, a Make/Zapier webhook, or your own mail API.
 *
 * Until CONTACT_FORWARD_URL is set (in .env.local, or the host's environment
 * settings), it answers 503 and the form tells the visitor it isn't connected
 * yet, so no message is ever silently lost.
 */

const SERVICES = ["Website", "E-Commerce", "ERP & CRM", "Mobile App", "SEO & Support", "Something else"]
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "")

export async function POST(request: Request) {
    let body: Record<string, unknown>
    try {
        body = await request.json()
    } catch {
        return Response.json({ ok: false, error: "invalid" }, { status: 400 })
    }

    // a hidden field people never see; bots that fill it get a quiet "ok"
    if (text(body.website, 200)) return Response.json({ ok: true })

    const entry = {
        name: text(body.name, 120),
        email: text(body.email, 200),
        company: text(body.company, 160),
        phone: text(body.phone, 40),
        services: Array.isArray(body.services) ? body.services.filter((s): s is string => SERVICES.includes(s as string)) : [],
        message: text(body.message, 5000),
        budget: text(body.budget, 120),
        sentAt: new Date().toISOString(),
    }

    if (!entry.name || !entry.message || !EMAIL.test(entry.email)) {
        return Response.json({ ok: false, error: "invalid" }, { status: 400 })
    }

    const target = process.env.CONTACT_FORWARD_URL
    if (!target) return Response.json({ ok: false, error: "not-configured" }, { status: 503 })

    try {
        const res = await fetch(target, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(entry),
        })
        if (!res.ok) return Response.json({ ok: false, error: "upstream" }, { status: 502 })
    } catch {
        return Response.json({ ok: false, error: "upstream" }, { status: 502 })
    }
    return Response.json({ ok: true })
}
