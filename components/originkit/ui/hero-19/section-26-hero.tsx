/* eslint-disable */
// Delivered by Originkit · stack: nextjs · styling: tailwind
// Adapted for Pixie Webs: a light stage in the site's palette, Pixie's
// copy and logo. Navigation lives in the site-wide side menu (SideNav).
"use client";

import { useLayoutEffect, useRef } from "react";

import Logo from "@/components/Logo";
import { Orb } from "@/components/originkit/ui/hero-19/orb";

/** Public asset under /originkit/hero-19 */
function asset(file: string) {
  return `/originkit/hero-19/${file}`;
}

/** Feathers the hand's top and base into the backdrop. */
const HAND_MASK =
  "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 7%, #000 20%, #000 86%, rgba(0,0,0,0.5) 95%, transparent 100%)";

/**
 * The light stage: a soft studio light falling from the top centre, a faint
 * grey vignette toward the edges, all on the site's warm white.
 */
const STAGE =
  "radial-gradient(55% 60% at 50% 0%, #ffffff 0%, rgba(255,255,255,0) 70%), radial-gradient(130% 95% at 50% 40%, rgba(12,12,13,0) 55%, rgba(12,12,13,0.06) 100%)";

export const Section26Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // The hero is always exactly one screen tall. The artwork (orb, hand, glow)
  // keeps the stage it was authored on (874 / 1133 / 840px) anchored to the
  // bottom and scales by --art. On phones and tablets the text keeps its size
  // at the top and the artwork shrinks just enough to fit the room it leaves;
  // on desktop the artwork scales with the screen's height, so the orb and hand
  // keep their proportions on short laptops and tall monitors alike.
  useLayoutEffect(() => {
    const el = sectionRef.current;
    const text = textRef.current;
    if (!el || !text) return;
    const fit = () => {
      let s = Math.min(1.4, Math.max(0.6, el.clientHeight / 840));
      if (window.innerWidth < 1280) {
        const tablet = window.innerWidth >= 768;
        const stageH = tablet ? 1133 : 874;
        const orbTop = tablet ? 607 : 499; // where the artwork starts on that stage
        const textBottom = text.getBoundingClientRect().bottom - el.getBoundingClientRect().top;
        const room = el.clientHeight - textBottom - 24;
        s = Math.min(1, Math.max(0.5, room / (stageH - orbTop)));
      }
      el.style.setProperty("--art", s.toFixed(4));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    ro.observe(text);
    return () => ro.disconnect();
  }, []);

  return (
    <section id="home" ref={sectionRef} className="h19 relative h-dvh min-h-[560px] w-full overflow-hidden bg-[var(--bg)]" aria-label="Pixie Webs">
      {/* Background runs edge to edge; only the composition below is capped */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0" style={{ backgroundImage: STAGE }} />

      {/* Fade into the page at the bottom, so the next section joins without an edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[18%] bg-linear-to-b from-transparent to-[var(--bg)]"
      />

      {/* The stage: exactly one screen tall */}
      <div className="relative h-full overflow-hidden ultrawide:mx-auto ultrawide:h-[1080px] ultrawide:max-w-[1920px]">
        {/* Logo. The site menu (components/SideNav) is fixed at the top right,
            on the same 44px row as this, at every size. */}
        <div className="h19-in absolute top-4 left-4 z-40 flex h-11 items-center ipad:top-8 ipad:left-12 desktop-sm:top-[37px] desktop-sm:left-25" style={{ ["--d" as string]: 0 }}>
          <a href="#home" className="flex items-center gap-3" aria-label="Pixie Webs home">
            <Logo className="block h-[26px] w-auto desktop-sm:h-[30px]" />
            <span aria-hidden className="block h-[26px] w-px bg-[#0c0c0d]/80 desktop-sm:h-[30px]" />
            <span className="font-sans text-[18px] leading-none font-bold tracking-[0.01em] whitespace-nowrap text-[#0c0c0d] desktop-sm:text-[20px]">
              PIXIE WEBS
            </span>
          </a>
        </div>

        {/* Headline. Desktop anchors the block to the bottom of the stage, so it
            holds its place as the viewport grows. */}
        <div ref={textRef} className="absolute top-[118px] left-1/2 z-20 flex w-[calc(100%-32px)] -translate-x-1/2 flex-col items-center gap-7 ipad:top-[clamp(110px,19.5svh,200px)] ipad:w-[min(640px,calc(100%-96px))] desktop-sm:top-auto desktop-sm:bottom-[clamp(150px,24vh,260px)] desktop-sm:left-25 desktop-sm:w-auto desktop-sm:translate-x-0 desktop-sm:items-start desktop-sm:gap-[44px]">
          <div className="flex flex-col items-center gap-4 text-center text-[#0c0c0d] desktop-sm:w-[600px] desktop-sm:items-start desktop-sm:text-left">
            <h1 className="h19-in font-sans text-[clamp(26px,7.8vw,34px)] leading-[1.1] font-bold tracking-[-0.015em] ipad:text-[46px] desktop-sm:text-[clamp(32px,2.6vw,44px)] desktop-sm:leading-[1.08]" style={{ ["--d" as string]: 1 }}>
              We build technology
              <br />
              that moves
              <br />
              businesses forward.
            </h1>
            <p className="h19-in max-w-[350px] font-sans text-[16px] leading-[1.5] tracking-[-0.2px] text-[#0c0c0d]/65 ipad:max-w-[520px] ipad:text-[18px] desktop-sm:max-w-[360px]" style={{ ["--d" as string]: 2 }}>
              From powerful websites to intelligent business systems and mobile
              applications, we turn ambitious ideas into digital experiences.
            </p>
          </div>
        </div>

        {/* Call to action. Desktop: a short line and two buttons on the right,
            level with the headline. Phones and tablets: just the buttons, low
            on the faded base of the hand, so the orb keeps its room. */}
        <div
          className="h19-in absolute inset-x-4 bottom-[max(24px,env(safe-area-inset-bottom))] z-30 flex flex-col items-center gap-7 ipad:bottom-12 desktop-sm:inset-x-auto desktop-sm:right-25 desktop-sm:bottom-[calc(clamp(150px,24vh,260px)+92px)] desktop-sm:items-start"
          style={{ ["--d" as string]: 3 }}
        >
          <p className="hidden font-sans text-[clamp(28px,2.3vw,42px)] leading-[1.12] font-normal tracking-[-0.025em] text-[#0c0c0d] desktop-sm:block">
            Let&rsquo;s build your
            <br />
            next big thing.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 ipad:gap-3 desktop-sm:gap-2.5">
            <a
              href="/contact"
              className="group inline-flex h-11 items-center gap-2 rounded-full bg-[#0c0c0d] pr-4 pl-5 font-sans text-[14px] ipad:h-12 ipad:gap-2.5 ipad:pr-5 ipad:pl-6 ipad:text-[15px] desktop-sm:h-11 desktop-sm:gap-2 desktop-sm:pr-4 desktop-sm:pl-5 desktop-sm:text-[14px] font-semibold whitespace-nowrap text-white shadow-[0_14px_30px_rgba(12,12,13,0.22)] transition-colors duration-200 [@media(hover:hover)]:hover:bg-[#2a2a2b]"
            >
              Start a Project
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </a>
            <a
              href="#work"
              className="group inline-flex h-11 items-center gap-2 rounded-full border border-solid border-black/15 bg-white/60 px-4 font-sans text-[14px] ipad:h-12 ipad:px-5 ipad:text-[15px] desktop-sm:h-11 desktop-sm:px-4 desktop-sm:text-[14px] font-semibold whitespace-nowrap text-[#0c0c0d] backdrop-blur-[10px] transition-colors duration-200 [@media(hover:hover)]:hover:border-black/30 [@media(hover:hover)]:hover:bg-white"
            >
              View Our Work
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <path d="M5 11l6-6M6 5h5v5" />
              </svg>
            </a>
          </div>
        </div>

        {/* Artwork — orb, hand and glow, on the stage they were authored on
            (402x874 / 744x1133 / 840 tall), anchored to the bottom and scaled
            by --art. */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[874px] origin-bottom ipad:h-[1133px] desktop-sm:h-[840px]"
          style={{ transform: "scale(var(--art, 1))" }}
        >
        <div className="pointer-events-none absolute inset-0 z-10">
          <Orb />
        </div>

        {/* Hand, in its natural colour */}
        <img
          aria-hidden
          src={asset("hand.webp")}
          alt=""
          className="pointer-events-none absolute top-[calc(50%+255px)] left-[calc(50%-4px)] z-10 h-[410px] w-[738px] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover ipad:top-[894px] ipad:left-1/2 ipad:h-[502px] ipad:w-[902px] desktop-sm:top-auto desktop-sm:bottom-0 desktop-sm:h-auto desktop-sm:w-[86vw] desktop-sm:origin-bottom desktop-sm:scale-115 desktop-sm:translate-y-0 ultrawide:top-[384px] ultrawide:bottom-auto ultrawide:w-[1180px] ultrawide:min-w-0 ultrawide:scale-100"
          style={{
            // The export has a hard top edge, and once it is lifted off the floor
            // a hard base too. Feather both so it dissolves into the backdrop.
            maskImage: HAND_MASK,
            WebkitMaskImage: HAND_MASK,
          }}
        />

        {/* A soft grey shadow pooling under the hand */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[-35px] left-1/2 z-0 h-[60px] w-[340px] -translate-x-1/2 rounded-full bg-black/10 blur-[30px] desktop-sm:h-[99px] desktop-sm:w-[663px] desktop-sm:blur-[45px]"
        />
        </div>

      </div>
    </section>
  );
};
