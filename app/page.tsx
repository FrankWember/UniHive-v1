import { Header } from "@/app/_components/header"
import { HeroSection } from "@/app/_components/hero-section"
import { FeaturesSection } from "@/app/_components/features-section"
import { HowItWorksSection } from "@/app/_components/how-it-works-section"
import { TestimonialsSection } from "@/app/_components/testimonials-section"
import { CallToActionSection } from "@/app/_components/call-to-action"
import { Footer } from "@/app/_components/footer"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 pt-16"> {/* Add padding-top to account for fixed header */}
        <HeroSection />
        <div id="features">
          <FeaturesSection />
        </div>
        <div id="how-it-works">
          <HowItWorksSection />
        </div>
        <div id="testimonials">
          <TestimonialsSection />
        </div>
        <CallToActionSection />
      </main>
      <Footer />
    </div>
  )
}