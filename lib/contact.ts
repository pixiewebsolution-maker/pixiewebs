/*
 * Pixie Webs' contact details, in one place: the footer, the contact page,
 * the contact form and the legal pages all read from here.
 */

export const EMAIL = "hello@pixiewebs.com"

/** `tel` is for phone links, `wa` for WhatsApp (country code, no + or spaces) */
export const PHONES = [
    { display: "+91 90484 68404", tel: "+919048468404", wa: "919048468404" },
    { display: "+91 91887 77807", tel: "+919188777807", wa: "919188777807" },
]

/** the contact form opens a WhatsApp chat with this number */
export const WHATSAPP = PHONES[0].wa

export const whatsappLink = (text?: string, number = WHATSAPP) =>
    `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ""}`

export const SOCIALS = [
    { name: "Instagram", href: "https://www.instagram.com/pixiewebs/" },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/pixie-webs/" },
    { name: "Threads", href: "https://www.threads.com/@pixiewebs" },
]
