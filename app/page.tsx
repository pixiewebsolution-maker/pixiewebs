import Hero19 from "@/components/originkit/hero-19"
import SideNav from "@/components/SideNav"
import HeroStack from "@/components/HeroStack"
import ScrollSteps from "@/components/ScrollSteps"
import WhyChooseUs from "@/components/WhyChooseUs"
import TrustedBy from "@/components/TrustedBy"
import Services from "@/components/Services"
import OurWork from "@/components/OurWork"
import Testimonials from "@/components/Testimonials"
import Faq from "@/components/Faq"
import FinalCta from "@/components/FinalCta"
import Footer from "@/components/Footer"

export default function Home() {
    return (
        <>
            <SideNav />
            {/* touch screens: one swipe, one step, from Services to the FAQs */}
            <ScrollSteps />
            <main>
                {/* the hero stays put while Why Choose Us scrolls up over it */}
                <HeroStack hero={<Hero19 />}>
                    <WhyChooseUs />
                </HeroStack>
                <TrustedBy />
                <Services />
                <OurWork />
                <Testimonials />
                <Faq />
                <FinalCta />
            </main>
            <Footer />
        </>
    )
}
