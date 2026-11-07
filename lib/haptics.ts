/*
 * A short tap of the phone's vibration motor, for scroll steps that click into
 * place (the Why Choose Us wheel, Services, the Our Works niches).
 *
 * The web's only vibration API is navigator.vibrate: Android browsers have it;
 * iPhones and computers don't, so there this does nothing. Browsers also only
 * allow it once the visitor has tapped the page, so it's skipped until then
 * (rather than logging a blocked call), and for visitors who ask for less motion.
 */
let last = 0
let reduce: MediaQueryList | null = null

export function haptic(ms = 10) {
    if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return
    if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return
    reduce ??= window.matchMedia("(prefers-reduced-motion: reduce)")
    if (reduce.matches) return
    // a fast flick through several steps gives a few taps, not a buzz
    const now = performance.now()
    if (now - last < 70) return
    last = now
    try {
        navigator.vibrate(ms)
    } catch {
        // some browsers throw instead of ignoring a blocked call
    }
}
