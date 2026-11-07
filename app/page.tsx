import Hero19 from "@/components/originkit/hero-19"
import SideNav from "@/components/SideNav"
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
            <main>
                <Hero19 />
                <WhyChooseUs />
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
