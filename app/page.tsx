import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/landing/hero-section"
import { BenefitsSection } from "@/components/landing/benefits-section"
import { FeaturedResourcesSection } from "@/components/landing/featured-resources-section"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FFFDE7]">
      <SiteHeader />
      <main>
        <HeroSection />
        <BenefitsSection />
        <FeaturedResourcesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
